import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/chat";
import { getSupabase } from "../lib/supabase";
import { getNickname, getVoterId, setNickname } from "../lib/anon";

const PASSCODE = "ASK2026";
const GATE_KEY = "ask2026_ok";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "現場即時互動牆 | 第二屆亞太禁羈研討會 (A.S.K. II)" },
    { name: "robots", content: "noindex" },
  ];
}

type Post = {
  id: string;
  author: string;
  content: string;
  likes: number;
  is_visible: boolean;
  created_at: string;
};

export default function Chat() {
  // 通關碼 gate。prerender 期間 sessionStorage 不存在，一律當作未通關，
  // 因此靜態輸出就是通關碼空殼；資料在 client hydrate 後才載入。
  const [passed, setPassed] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(GATE_KEY) === "1") setPassed(true);
  }, []);

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (codeInput.trim().toUpperCase() === PASSCODE) {
      sessionStorage.setItem(GATE_KEY, "1");
      setPassed(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  }

  if (!passed) {
    return (
      <main className="pt-32 pb-20 px-6 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">現場即時互動牆</h1>
          <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-orange-500 mb-8"></div>
          <p className="text-gray-500 mb-8">請輸入現場公布的通關碼進入。</p>
          <form onSubmit={submitCode} className="flex flex-col gap-4">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="通關碼"
              autoComplete="off"
              className="border accent-border px-4 py-3 text-center tracking-widest focus:outline-none focus:border-emerald-500"
            />
            {codeError && (
              <p className="text-sm text-red-600">通關碼不正確，請再確認。</p>
            )}
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 transition"
            >
              進入
            </button>
          </form>
        </div>
      </main>
    );
  }

  return <Wall />;
}

function Wall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [nickname, setNick] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const voterIdRef = useRef<string>("");

  // 初始化身分 + 載入資料 + 訂閱 Realtime。全部 client only。
  useEffect(() => {
    voterIdRef.current = getVoterId();
    setNick(getNickname());

    const supabase = getSupabase();
    if (!supabase) {
      setLoadError("尚未設定連線，暫時無法載入留言。");
      return;
    }

    let cancelled = false;

    (async () => {
      const { data: postsData, error: postsErr } = await supabase
        .from("posts")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (postsErr) setLoadError("載入留言失敗。");
        else setPosts((postsData as Post[]) ?? []);
      }

      const { data: likesData } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("voter_id", voterIdRef.current);

      if (!cancelled && likesData) {
        setLikedIds(new Set(likesData.map((r: { post_id: string }) => r.post_id)));
      }
    })();

    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const row = payload.new as Post;
          if (!row.is_visible) return;
          setPosts((prev) =>
            prev.some((p) => p.id === row.id) ? prev : [row, ...prev]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          const row = payload.new as Post;
          setPosts((prev) =>
            prev.map((p) => (p.id === row.id ? { ...p, likes: row.likes } : p))
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  function onNickChange(value: string) {
    setNick(value);
    setNickname(value);
  }

  async function submitPost(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (!text || sending) return;

    const supabase = getSupabase();
    if (!supabase) return;

    setSending(true);
    const author = nickname.trim() || "匿名";
    const { data, error } = await supabase.rpc("create_post", {
      p_author: author,
      p_content: text,
      p_passcode: PASSCODE,
    });

    if (!error && data) {
      // 樂觀加入（Realtime 也可能送同一筆，靠 id 去重）
      const row = data as Post;
      setPosts((prev) =>
        prev.some((p) => p.id === row.id) ? prev : [row, ...prev]
      );
      setContent("");
    } else {
      setLoadError("發表失敗，請再試一次。");
    }

    // 送出鈕短暫 disabled，避免連點
    setTimeout(() => setSending(false), 600);
  }

  async function toggleLike(post: Post) {
    const supabase = getSupabase();
    if (!supabase) return;

    const wasLiked = likedIds.has(post.id);

    // 樂觀更新
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(post.id);
      else next.add(post.id);
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, likes: Math.max(0, p.likes + (wasLiked ? -1 : 1)) }
          : p
      )
    );

    const { data, error } = await supabase.rpc("toggle_like", {
      p_post_id: post.id,
      p_voter_id: voterIdRef.current,
      p_passcode: PASSCODE,
    });

    if (error) {
      // 回滾
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.add(post.id);
        else next.delete(post.id);
        return next;
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, likes: Math.max(0, p.likes + (wasLiked ? 1 : -1)) }
            : p
        )
      );
      return;
    }

    // 以伺服器回傳的真值校正
    const result = Array.isArray(data) ? data[0] : data;
    if (result && typeof result.likes === "number") {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, likes: result.likes } : p))
      );
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (result.liked) next.add(post.id);
        else next.delete(post.id);
        return next;
      });
    }
  }

  return (
    <main className="pt-28 pb-32 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8 accent-border pb-6 border-b">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            現場即時互動牆
          </h1>
          <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-orange-500 mb-4"></div>
          <p className="text-sm text-gray-500">
            留言將被記錄並保留。請以尊重彼此的方式參與。
          </p>
        </header>

        <form onSubmit={submitPost} className="mb-10">
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">暱稱</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => onNickChange(e.target.value)}
              maxLength={40}
              className="w-full border accent-border px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            rows={3}
            placeholder="說點什麼吧…"
            className="w-full border accent-border px-3 py-2 focus:outline-none focus:border-emerald-500 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{content.length}/280</span>
            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="bg-black text-white px-6 py-2 font-bold hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              發表
            </button>
          </div>
        </form>

        {loadError && (
          <p className="text-sm text-red-600 text-center mb-6">{loadError}</p>
        )}

        <ul className="flex flex-col gap-4">
          {posts.length === 0 && !loadError && (
            <li className="text-center text-gray-400 py-10">
              還沒有留言，成為第一個吧！
            </li>
          )}
          {posts.map((post) => {
            const liked = likedIds.has(post.id);
            return (
              <li
                key={post.id}
                className="border accent-border p-4 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{post.author}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleString("zh-TW", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words mb-3">
                  {post.content}
                </p>
                <button
                  type="button"
                  onClick={() => toggleLike(post)}
                  className={`inline-flex items-center gap-1 text-sm px-3 py-1 border transition ${
                    liked
                      ? "border-orange-500 text-orange-600 bg-orange-50"
                      : "accent-border text-gray-500 hover:border-orange-500 hover:text-orange-600"
                  }`}
                  aria-pressed={liked}
                >
                  <span>{liked ? "❤️" : "🤍"}</span>
                  <span>{post.likes}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
