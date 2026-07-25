import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import type { Route } from "./+types/chat";
import { getSupabase } from "../lib/supabase";
import {
  getHue,
  getNickname,
  getVoterId,
  randomNickname,
  setHue as persistHue,
  setNickname,
} from "../lib/anon";

const MAX_LEN = 500;

const CHAT_ROOMS = {
  main: {
    passcode: "ASK2026",
    room: "ask2026",
    gateKey: "ask2026_ok",
    consentKey: "ask2026_consent_ok",
  },
  live: {
    passcode: "ASKLIVE",
    room: "asklive",
    gateKey: "asklive_ok",
    consentKey: "asklive_consent_ok",
  },
} as const;

type ChatRoom = (typeof CHAT_ROOMS)[keyof typeof CHAT_ROOMS];

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
  hue: number | null;
  quote_name: string | null;
  quote_text: string | null;
  quote_hue: number | null;
  quote_post_id: string | null;
  pinned_at: string | null;
  room: string;
};

type Quoting = { id: string; name: string; text: string; hue: number };

/**
 * 暱稱顏色：在 oklch 空間對 orange-500 → emerald-500 線性插值。
 * t 為拉桿值 0–100。alpha 例如 "12%" 產生淡底版。
 * 務必用 oklch，不要 RGB 線性插值。
 */
function hueToColor(t: number, alpha?: string): string {
  const p = t / 100;
  const L = 0.705 + (0.696 - 0.705) * p;
  const C = 0.213 + (0.17 - 0.213) * p;
  const H = 47.6 + (162.5 - 47.6) * p;
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)}${
    alpha ? " / " + alpha : ""
  })`;
}

/** 時間戳格式：YYYY/MM/DD 上午|下午hh:mm */
function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date =
    d.getFullYear() +
    "/" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "/" +
    String(d.getDate()).padStart(2, "0");
  const h = d.getHours();
  const time =
    (h < 12 ? "上午" : "下午") +
    String(h % 12 || 12).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0");
  return date + " " + time;
}

const CHAT_STYLE = `
@keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
@keyframes chatMessageIn { 0% { opacity: 0; transform: translateY(-10px) scale(.985); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes chatHeartPop { 0% { transform: scale(1); } 35% { transform: scale(1.48) rotate(-8deg); } 68% { transform: scale(.88) rotate(5deg); } 100% { transform: scale(1) rotate(0); } }
@keyframes chatLikeCountPop { 0% { transform: translateY(0); } 40% { transform: translateY(-3px); } 100% { transform: translateY(0); } }
.chat-scope ::placeholder { color: #a3a3a3; }
.chat-scope input[type="range"].nick-hue { -webkit-appearance: none; appearance: none; height: 10px; border-radius: 999px; outline: none; background: linear-gradient(to right, #f97316, #ca8a3d, #8f9a55, #10b981); }
.chat-scope input[type="range"].nick-hue::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #ffffff; border: 3px solid #171717; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.25); }
.chat-scope input[type="range"].nick-hue::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #ffffff; border: 3px solid #171717; cursor: pointer; }
.chat-scope .chat-input:focus, .chat-scope .chat-textarea:focus { border-color: #f97316 !important; }
.chat-scope .chat-submit:not(:disabled):hover { filter: brightness(.92); }
.chat-scope .chat-clearquote:hover { color: #171717 !important; }
.chat-scope .chat-like:hover { color: #ea580c !important; }
.chat-scope .chat-quotebtn:hover { color: #059669 !important; }
.chat-scope .chat-reroll:hover { background: #f1f1f1 !important; }
.chat-scope .chat-reroll:active { transform: scale(.94); }
.chat-scope .chat-new-message { animation: chatMessageIn .46s cubic-bezier(.2,.8,.2,1) both; }
.chat-scope .chat-like:active { transform: scale(.96); }
.chat-scope .chat-like.is-pulsing .chat-heart { animation: chatHeartPop .46s cubic-bezier(.2,.8,.2,1) both; }
.chat-scope .chat-like.is-pulsing .chat-like-count { animation: chatLikeCountPop .36s ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .chat-scope .chat-new-message,
  .chat-scope .chat-like.is-pulsing .chat-heart,
  .chat-scope .chat-like.is-pulsing .chat-like-count { animation: none; }
  .chat-scope .chat-like { transition: none !important; }
}
`;

export default function Chat() {
  const { pathname } = useLocation();
  const room = pathname === "/chat-live" ? CHAT_ROOMS.live : CHAT_ROOMS.main;
  // 通關碼 gate。prerender 期間 sessionStorage 不存在，一律當作未通關，
  // 因此靜態輸出就是通關碼空殼；資料在 client hydrate 後才載入。
  const [passed, setPassed] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [consented, setConsented] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(room.gateKey) === "1") setPassed(true);
    if (sessionStorage.getItem(room.consentKey) === "1") setConsented(true);
  }, [room]);

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    if (codeInput.trim().toUpperCase() === room.passcode) {
      sessionStorage.setItem(room.gateKey, "1");
      setPassed(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  }

  function submitConsent(e: React.FormEvent) {
    e.preventDefault();
    if (!consentChecked) return;
    sessionStorage.setItem(room.consentKey, "1");
    setConsented(true);
  }

  if (!passed) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          color: "#171717",
          padding: "120px 32px 96px",
        }}
      >
        <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: ".04em",
              color: "#111111",
            }}
          >
            現場即時互動牆
          </h1>
          <p style={{ margin: "0 0 28px", color: "#737373", fontSize: 15 }}>
            請輸入現場公布的通關碼進入。
          </p>
          <form
            onSubmit={submitCode}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="通關碼"
              autoComplete="off"
              className="chat-input"
              style={{
                boxSizing: "border-box",
                background: "#ffffff",
                border: "1px solid #dddddd",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 15,
                fontWeight: 700,
                textAlign: "center",
                letterSpacing: ".2em",
                fontFamily: "inherit",
                outline: "none",
                color: "#171717",
              }}
            />
            {codeError && (
              <p style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>
                通關碼不正確，請再確認。
              </p>
            )}
            <button
              type="submit"
              className="chat-submit"
              style={{
                background: "#f97316",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                padding: "11px 28px",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "inherit",
                letterSpacing: ".15em",
                cursor: "pointer",
                transition: "filter .15s",
              }}
            >
              進入
            </button>
          </form>
        </div>
        <style dangerouslySetInnerHTML={{ __html: CHAT_STYLE }} />
      </main>
    );
  }

  if (!consented) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          color: "#171717",
          padding: "80px 20px 96px",
        }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: ".02em",
              color: "#111111",
              textAlign: "center",
            }}
          >
            留言交流規範與資訊留存政策
          </h1>
          <p
            style={{
              margin: "0 0 24px",
              color: "#737373",
              fontSize: 13.5,
              textAlign: "center",
            }}
          >
            進入互動牆前，請詳閱並同意以下內容。
          </p>
          <form onSubmit={submitConsent}>
            <div
              style={{
                border: "1px solid #dddddd",
                borderRadius: 12,
                padding: "20px 22px",
                maxHeight: 360,
                overflowY: "auto",
                fontSize: 13.5,
                lineHeight: 1.85,
                color: "#404040",
                background: "#fafafa",
              }}
            >
              <p style={{ margin: "0 0 14px" }}>
                為維護學術研討之專業品質，保障參與者之人格權益，並建立良性之交流環境，凡於本討論區發表言論之使用者，均視為已充分閱讀、理解並同意遵守以下規範：
              </p>
              <p style={{ margin: "0 0 14px" }}>
                一、
                本留言板係專為「第二屆亞太禁羈研討會」（以下簡稱「本研討會」）之參與者提供意見交流與學術提問之平台。使用者於本留言板發表之所有內容，將同步公開顯示於本研討會之官方網站。
              </p>
              <p style={{ margin: "0 0 14px" }}>
                二、
                使用者於進行學術探討時，應秉持理性、客觀與相互尊重之態度。
                <br />
                引用限制：
                嚴禁在本平台公開引述、發表、散布任何研究者本人尚未正式公開發表之學術報告或研究論文內容。
                <br />
                禁止不實陳述：
                嚴禁將本研討會之任何發表內容或他人言論，移轉至其他社群媒體平台或外部管道，進行斷章取義或扭曲事實之不實陳述。
              </p>
              <p style={{ margin: "0 0 14px" }}>
                三、
                本平台所有留言均屬發表者之個人言論，不代表本研討會籌備委員會（以下簡稱「本會」）之立場。
                <br />
                嚴禁人身攻擊：
                使用者發表言論時請自重，嚴禁發表任何涉及公然侮辱、誹謗、惡意攻擊、謾罵，或足以貶損他人社會客觀評價之言論。
                <br />
                法律責任歸屬：
                發表者之言論若不法侵害他人之名譽、信用或人格法益，發表者須自行承擔一切民事賠償與刑事責任，概與本會無涉。
              </p>
              <p style={{ margin: "0 0 14px" }}>
                四、
                本平台為公開之網路交流空間，使用者應充分尊重他人之隱私權，切勿未經當事人同意，擅自揭露、散布、發表任何第三方之個人資料（包括但不限於真實姓名、聯絡電話、電子郵件、住址、工作單位等）或個人生活私密資訊。違反者除須自負侵權行為損害賠償外，本平台將依法立即移除該違法內容。
              </p>
              <p style={{ margin: "0 0 14px" }}>
                五、
                請注意，本平台為「對公眾開放」之網絡空間。使用者自願在此提交之任何資訊（如：暱稱、頭像、學術觀點及留言評論等），前述資訊可能被不特定第三方瀏覽、收集、利用，或用於本會客觀上無法控制之用途。使用者於提交資料前，應審慎評估其揭露範圍。
              </p>
              <p style={{ margin: "0 0 14px" }}>
                六、
                本平台使用者同意，本會對於本平台內之所有留言、暱稱、提問及相關系統數據，享有完整之留存、備份、管理、學術研究彙整及基於本研討會推廣目的之利用權利。
                前述數據留存與利用，不受使用者事後登出或停止使用本網站之影響。
              </p>
              <p style={{ margin: 0 }}>
                七、
                使用者若欲申請更正、停止利用或刪除其於本討論區留存之個人數據，請透過電子郵件（Email:
                bdsmaskorg@gmail.com）聯繫本會，或於研討會當日現場向工作人員提出申請。在某些情況下，我們可能無法刪除所有個人資料和評論。在這種情況下，我們將向您提供回覆和解釋。
              </p>
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                margin: "18px 2px 22px",
                fontSize: 14,
                fontWeight: 600,
                color: "#171717",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                style={{
                  marginTop: 3,
                  width: 17,
                  height: 17,
                  accentColor: "#f97316",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
              我已閱讀並同意上述「留言交流規範與資訊留存政策」
            </label>
            <button
              type="submit"
              className="chat-submit"
              disabled={!consentChecked}
              style={{
                display: "block",
                width: "100%",
                background: consentChecked ? "#f97316" : "#e5e5e5",
                color: consentChecked ? "#ffffff" : "#a3a3a3",
                border: "none",
                borderRadius: 10,
                padding: "13px 28px",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "inherit",
                letterSpacing: ".1em",
                cursor: consentChecked ? "pointer" : "not-allowed",
                transition: "filter .15s",
              }}
            >
              同意並繼續
            </button>
          </form>
        </div>
        <style dangerouslySetInnerHTML={{ __html: CHAT_STYLE }} />
      </main>
    );
  }

  return <Wall room={room} />;
}

function Wall({ room }: { room: ChatRoom }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [newPostIds, setNewPostIds] = useState<Set<string>>(new Set());
  const [likePulseIds, setLikePulseIds] = useState<Set<string>>(new Set());
  const [nickname, setNick] = useState("");
  const [hue, setHueState] = useState(0);
  const [draft, setDraft] = useState("");
  const [quoting, setQuoting] = useState<Quoting | null>(null);
  const [sortBy, setSortBy] = useState<"time" | "likes" | "quotes">("time");
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const voterIdRef = useRef<string>("");

  function markNewPost(id: string) {
    setNewPostIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      setNewPostIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 700);
  }

  function pulseLike(id: string) {
    setLikePulseIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      setLikePulseIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 520);
  }

  // 初始化身分 + 載入資料 + 訂閱 Realtime。全部 client only。
  useEffect(() => {
    voterIdRef.current = getVoterId();
    setNick(getNickname());
    setHueState(getHue());

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
        .eq("room", room.room)
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
        setLikedIds(
          new Set(likesData.map((r: { post_id: string }) => r.post_id))
        );
      }
    })();

    const channel = supabase
      .channel(`posts-realtime-${room.room}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const row = payload.new as Post;
          if (!row.is_visible || row.room !== room.room) return;
          markNewPost(row.id);
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
          if (row.room !== room.room) return;
          setPosts((prev) =>
            prev.map((p) => (p.id === row.id ? { ...p, ...row } : p))
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [room]);

  function onNickChange(value: string) {
    setNick(value);
    setNickname(value);
  }

  function onHueChange(value: number) {
    setHueState(value);
    persistHue(value);
  }

  const count = draft.length;
  const canSend = count > 0 && count <= MAX_LEN;
  const nickColor = hueToColor(hue);
  const nickColorSoft = hueToColor(hue, "12%");

  // 有 quote_post_id 的引用（新資料）用 id 精確比對是否還在目前可見的留言清單裡。
  // 舊資料沒有 quote_post_id，只能退回用「作者+內容」的文字快照比對出目標 id。
  const visiblePostIds = useMemo(() => new Set(posts.map((p) => p.id)), [posts]);
  const visiblePostSignatures = useMemo(() => {
    return new Map(posts.map((p) => [`${p.author} ${p.content}`, p.id] as const));
  }, [posts]);

  // 統計每則留言被引用的次數，供「最多被引用」排序與顯示用。
  const quoteCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      if (!p.quote_name && !p.quote_text) continue;
      const targetId =
        p.quote_post_id ??
        visiblePostSignatures.get(`${p.quote_name} ${p.quote_text}`);
      if (!targetId) continue;
      counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
    }
    return counts;
  }, [posts, visiblePostSignatures]);

  // 手動置頂永遠排在第一；其餘留言再套用選擇的排序。
  const sorted = useMemo(() => {
    return [...posts].sort(
      (a, b) => {
        if (!!a.pinned_at !== !!b.pinned_at) return a.pinned_at ? -1 : 1;
        if (sortBy === "likes") return b.likes - a.likes || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === "quotes") return (quoteCounts.get(b.id) ?? 0) - (quoteCounts.get(a.id) ?? 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    );
  }, [posts, sortBy, quoteCounts]);

  async function submitPost() {
    const text = draft.trim();
    if (!text || count > MAX_LEN || sending) return;

    const supabase = getSupabase();
    if (!supabase) return;

    setSending(true);
    const author = nickname.trim() || "匿名";
    const q = quoting;

    const { data, error } = await supabase.rpc("create_post", {
      p_author: author,
      p_content: text,
      p_passcode: room.passcode,
      p_hue: hue,
      p_quote_name: q ? q.name : null,
      p_quote_text: q ? q.text : null,
      p_quote_hue: q ? q.hue : null,
      p_quote_post_id: q ? q.id : null,
    });

    if (!error && data) {
      const row = (Array.isArray(data) ? data[0] : data) as Post;
      setPosts((prev) =>
        prev.some((p) => p.id === row.id) ? prev : [row, ...prev]
      );
      markNewPost(row.id);
      setDraft("");
      setQuoting(null);
    } else {
      setLoadError("發表失敗，請再試一次。");
    }

    setTimeout(() => setSending(false), 600);
  }

  async function toggleLike(post: Post) {
    const supabase = getSupabase();
    if (!supabase) return;

    const wasLiked = likedIds.has(post.id);
    pulseLike(post.id);

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
      p_passcode: room.passcode,
    });

    if (error) {
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

  const inputBase: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "#ffffff",
    border: "1px solid #dddddd",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <main
      className="chat-scope"
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "120px 32px 96px",
        background: "#ffffff",
        color: "#171717",
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 999,
            border: "1px solid #b9e9d4",
            background: "#ecfdf5",
            color: "#059669",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".1em",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#10b981",
              animation: "pulseDot 1.6s ease-in-out infinite",
            }}
          />
          LIVE
        </div>
        <h1
          style={{
            margin: "0 0 14px",
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: ".04em",
            color: "#111111",
          }}
        >
          現場即時互動牆
        </h1>
        <p style={{ margin: 0, color: "#737373", fontSize: 15 }}>
          留言將被記錄並保留。請以尊重彼此的方式參與。
        </p>
      </div>

      {/* Composer */}
      <div
        style={{
          background: "#fafafa",
          border: "1px solid #e8e8e8",
          borderRadius: 16,
          padding: 24,
          marginBottom: 48,
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 700,
            color: "#737373",
            letterSpacing: ".06em",
            marginBottom: 8,
          }}
        >
          暱稱
        </label>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <input
            className="chat-input"
            value={nickname}
            onChange={(e) => onNickChange(e.target.value)}
            maxLength={40}
            style={{
              ...inputBase,
              color: nickColor,
              fontWeight: 700,
              marginBottom: 0,
            }}
          />
          <button
            type="button"
            className="chat-reroll"
            onClick={() => onNickChange(randomNickname())}
            aria-label="隨機換一個暱稱"
            title="隨機換一個暱稱"
            style={{
              flexShrink: 0,
              background: "#ffffff",
              border: "1px solid #dddddd",
              borderRadius: 10,
              width: 46,
              fontSize: 19,
              lineHeight: 1,
              cursor: "pointer",
              transition: "background .15s, transform .1s",
            }}
          >
            🎲
          </button>
        </div>

        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 700,
            color: "#737373",
            letterSpacing: ".06em",
            marginBottom: 10,
          }}
        >
          暱稱顏色
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <input
            type="range"
            className="nick-hue"
            min={0}
            max={100}
            value={hue}
            onChange={(e) => onHueChange(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 88,
              padding: "6px 12px",
              borderRadius: 999,
              background: nickColorSoft,
              color: nickColor,
              fontSize: 13,
              fontWeight: 900,
              whiteSpace: "nowrap",
            }}
          >
            {nickname || "暱稱預覽"}
          </span>
        </div>

        {quoting && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: "#f1f1f1",
              borderLeft: "3px solid #10b981",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 10,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: hueToColor(quoting.hue),
                  marginBottom: 2,
                }}
              >
                {quoting.name}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: "#525252",
                  lineHeight: 1.6,
                  overflowWrap: "anywhere",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {quoting.text}
              </div>
            </div>
            <button
              type="button"
              className="chat-clearquote"
              onClick={() => setQuoting(null)}
              aria-label="取消引用"
              style={{
                background: "transparent",
                border: "none",
                color: "#a3a3a3",
                fontSize: 16,
                lineHeight: 1,
                cursor: "pointer",
                padding: 2,
                fontFamily: "inherit",
              }}
            >
              ✕
            </button>
          </div>
        )}

        <textarea
          className="chat-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="說點什麼吧⋯"
          rows={4}
          style={{
            ...inputBase,
            color: "#171717",
            resize: "vertical",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 14,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: count > MAX_LEN ? "#dc2626" : "#a3a3a3",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count}/{MAX_LEN}
          </span>
          <button
            type="button"
            className="chat-submit"
            onClick={submitPost}
            disabled={!canSend || sending}
            style={{
              background: canSend ? "#f97316" : "#e5e5e5",
              color: canSend ? "#ffffff" : "#a3a3a3",
              border: "none",
              borderRadius: 10,
              padding: "11px 28px",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "inherit",
              letterSpacing: ".15em",
              cursor: canSend && !sending ? "pointer" : "default",
              transition: "filter .15s",
            }}
          >
            發表
          </button>
        </div>
      </div>

      {loadError && (
        <p
          style={{
            fontSize: 13,
            color: "#dc2626",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {loadError}
        </p>
      )}

      {/* Sort bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "#f1f1f1",
            borderRadius: 999,
            padding: 3,
          }}
        >
          {(
            [
              ["time", "最新"],
              ["likes", "最多愛心"],
              ["quotes", "最多被引用"],
            ] as const
          ).map(([key, label]) => {
            const active = sortBy === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSortBy(key)}
                style={{
                  background: active ? "#ffffff" : "transparent",
                  color: active ? "#171717" : "#737373",
                  border: "none",
                  borderRadius: 999,
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  transition: "all .15s",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,.12)" : "none",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <span style={{ flex: 1, height: 1, background: "#eeeeee" }} />
        <span
          style={{
            fontSize: 13,
            color: "#a3a3a3",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {posts.length} 則
        </span>
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.length === 0 && !loadError && (
          <div
            style={{
              textAlign: "center",
              color: "#a3a3a3",
              fontSize: 14,
              padding: "40px 0",
            }}
          >
            還沒有留言，成為第一個吧！
          </div>
        )}
        {sorted.map((post) => {
          const liked = likedIds.has(post.id);
          const color = hueToColor(post.hue ?? 0);
          const hasQuote = !!(post.quote_name || post.quote_text);
          const quoteColor = hueToColor(post.quote_hue ?? 0);
          const quoteHidden =
            hasQuote &&
            (post.quote_post_id
              ? !visiblePostIds.has(post.quote_post_id)
              : !visiblePostSignatures.has(
                  `${post.quote_name} ${post.quote_text}`
                ));
          const quotedCount = quoteCounts.get(post.id) ?? 0;
          const pinned = !!post.pinned_at;
          return (
            <article
              key={post.id}
              className={newPostIds.has(post.id) ? "chat-new-message" : undefined}
              style={{
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: 14,
                padding: "20px 22px",
                boxShadow: "0 1px 3px rgba(0,0,0,.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color,
                    overflowWrap: "anywhere",
                  }}
                >
                  {post.author}
                </span>
                {pinned && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: 999,
                      padding: "3px 8px",
                      background: "#fff7ed",
                      color: "#ea580c",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    置頂
                  </span>
                )}
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 13,
                    color: "#a3a3a3",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatTime(post.created_at)}
                </span>
              </div>

              {hasQuote && quoteHidden && (
                <div
                  style={{
                    background: "#f7f7f7",
                    borderLeft: "3px solid #d4d4d4",
                    borderRadius: 8,
                    padding: "10px 12px",
                    margin: "0 0 12px",
                    fontSize: 13.5,
                    color: "#a3a3a3",
                    fontStyle: "italic",
                  }}
                >
                  原留言已被隱藏
                </div>
              )}
              {hasQuote && !quoteHidden && (
                <div
                  style={{
                    background: "#f7f7f7",
                    borderLeft: `3px solid ${quoteColor}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    margin: "0 0 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: quoteColor,
                      marginBottom: 2,
                    }}
                  >
                    {post.quote_name}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: "#525252",
                      lineHeight: 1.6,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {post.quote_text}
                  </div>
                </div>
              )}

              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: 15.5,
                  lineHeight: 1.7,
                  color: "#262626",
                  overflowWrap: "anywhere",
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.content}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <button
                  type="button"
                  className={`chat-like${likePulseIds.has(post.id) ? " is-pulsing" : ""}`}
                  onClick={() => toggleLike(post)}
                  aria-pressed={liked}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: "transparent",
                    border: "none",
                    color: liked ? "#f97316" : "#737373",
                    padding: "4px 0",
                    fontSize: 13.5,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  <span
                    className="chat-heart"
                    style={{ display: "inline-block", fontSize: 18, lineHeight: 1, marginLeft: -2 }}
                  >
                    {liked ? "♥" : "♡"}
                  </span>
                  <span className="chat-like-count">{post.likes}</span>
                </button>
                <button
                  type="button"
                  className="chat-quotebtn"
                  onClick={() =>
                    setQuoting({
                      id: post.id,
                      name: post.author,
                      text: post.content,
                      hue: post.hue ?? 0,
                    })
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "transparent",
                    border: "none",
                    color: "#737373",
                    padding: "4px 0",
                    fontSize: 13.5,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "color .15s",
                  }}
                >
                  <span style={{ fontSize: 15, lineHeight: 1 }}>❝</span> 引用
                </button>
                {quotedCount > 0 && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13.5,
                      color: "#a3a3a3",
                    }}
                  >
                    被引用 {quotedCount} 次
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: CHAT_STYLE }} />
    </main>
  );
}
