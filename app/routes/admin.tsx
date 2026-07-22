import { useState } from "react";
import type { Route } from "./+types/admin";
import { getSupabase } from "../lib/supabase";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "留言管理 | 第二屆亞太禁羈研討會 (A.S.K. II)" },
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
};

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

const ADMIN_STYLE = `
.admin-scope ::placeholder { color: #a3a3a3; }
.admin-scope .admin-input:focus { border-color: #f97316 !important; }
.admin-scope .admin-submit:not(:disabled):hover { filter: brightness(.92); }
.admin-scope .admin-action:not(:disabled):hover { filter: brightness(.94); }
.admin-scope .admin-action:disabled { opacity: .5; cursor: default; }
`;

export default function Admin() {
  // 密語 gate：從不在前端比對字串，改用 RPC 呼叫成功與否判斷。
  // 密語只存在 React state，不落 storage，重整需重新輸入。
  const [passcode, setPasscode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "hidden" | "quoted">("all");
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    const code = codeInput.trim();
    if (!code || verifying) return;

    const supabase = getSupabase();
    if (!supabase) {
      setCodeError(true);
      return;
    }

    setVerifying(true);
    setCodeError(false);

    const { data, error } = await supabase.rpc("admin_list_posts", {
      p_passcode: code,
    });

    setVerifying(false);

    if (error) {
      setCodeError(true);
      return;
    }

    setPasscode(code);
    setPosts((data as Post[]) ?? []);
  }

  function setBusy(id: string, busy: boolean) {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function toggleVisibility(post: Post) {
    if (!passcode || busyIds.has(post.id)) return;
    const supabase = getSupabase();
    if (!supabase) return;

    setBusy(post.id, true);
    setActionError(null);
    const nextVisible = !post.is_visible;

    const { data, error } = await supabase.rpc("admin_set_visibility", {
      p_id: post.id,
      p_visible: nextVisible,
      p_passcode: passcode,
    });

    if (error) {
      setActionError("操作失敗，請再試一次。");
    } else {
      const row = (Array.isArray(data) ? data[0] : data) as Post | undefined;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, is_visible: row?.is_visible ?? nextVisible } : p
        )
      );
    }
    setBusy(post.id, false);
  }

  async function deletePost(post: Post) {
    if (!passcode || busyIds.has(post.id)) return;
    const confirmed = window.confirm(
      `確定要永久刪除這則留言嗎？此動作無法復原。\n\n「${post.content.slice(0, 40)}${post.content.length > 40 ? "…" : ""}」`
    );
    if (!confirmed) return;

    const supabase = getSupabase();
    if (!supabase) return;

    setBusy(post.id, true);
    setActionError(null);

    const { error } = await supabase.rpc("admin_delete_post", {
      p_id: post.id,
      p_passcode: passcode,
    });

    if (error) {
      setActionError("刪除失敗，請再試一次。");
      setBusy(post.id, false);
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    }
  }

  function logout() {
    setPasscode(null);
    setCodeInput("");
    setPosts([]);
    setActionError(null);
  }

  if (!passcode) {
    return (
      <main
        className="admin-scope"
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
            留言管理
          </h1>
          <p style={{ margin: "0 0 28px", color: "#737373", fontSize: 15 }}>
            請輸入管理密語進入。
          </p>
          <form
            onSubmit={submitCode}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <input
              type="password"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="管理密語"
              autoComplete="off"
              className="admin-input"
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
                密語不正確，請再確認。
              </p>
            )}
            <button
              type="submit"
              className="admin-submit"
              disabled={verifying}
              style={{
                background: verifying ? "#e5e5e5" : "#f97316",
                color: verifying ? "#a3a3a3" : "#ffffff",
                border: "none",
                borderRadius: 10,
                padding: "11px 28px",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "inherit",
                letterSpacing: ".15em",
                cursor: verifying ? "default" : "pointer",
                transition: "filter .15s",
              }}
            >
              {verifying ? "驗證中⋯" : "進入"}
            </button>
          </form>
        </div>
        <style dangerouslySetInnerHTML={{ __html: ADMIN_STYLE }} />
      </main>
    );
  }

  // 統計每則留言被引用的次數：有 quote_post_id 的直接用 id 算；
  // 舊資料沒有 quote_post_id，退回用作者+內容比對出目標留言。
  const signatureToId = new Map(
    posts.map((p) => [`${p.author} ${p.content}`, p.id] as const)
  );
  const quoteCounts = new Map<string, number>();
  for (const p of posts) {
    if (!p.quote_name && !p.quote_text) continue;
    const targetId =
      p.quote_post_id ?? signatureToId.get(`${p.quote_name} ${p.quote_text}`);
    if (!targetId) continue;
    quoteCounts.set(targetId, (quoteCounts.get(targetId) ?? 0) + 1);
  }

  const visiblePosts = posts.filter((p) => {
    if (filter === "hidden") return !p.is_visible;
    if (filter === "quoted") return (quoteCounts.get(p.id) ?? 0) > 0;
    return true;
  });
  const hiddenCount = posts.filter((p) => !p.is_visible).length;
  const quotedCount = posts.filter((p) => (quoteCounts.get(p.id) ?? 0) > 0).length;

  return (
    <main
      className="admin-scope"
      style={{
        maxWidth: 840,
        margin: "0 auto",
        padding: "120px 32px 96px",
        background: "#ffffff",
        color: "#171717",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 32,
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: ".04em",
              color: "#111111",
            }}
          >
            留言管理
          </h1>
          <p style={{ margin: 0, color: "#737373", fontSize: 14 }}>
            共 {posts.length} 則，已隱藏 {hiddenCount} 則，被引用 {quotedCount}{" "}
            則。
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="admin-action"
          style={{
            background: "transparent",
            border: "1px solid #dddddd",
            color: "#737373",
            borderRadius: 10,
            padding: "9px 18px",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          登出
        </button>
      </div>

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
              ["all", "全部"],
              ["hidden", "只看已隱藏"],
              ["quoted", "只看被引用"],
            ] as const
          ).map(([key, label]) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
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
      </div>

      {actionError && (
        <p
          style={{
            fontSize: 13,
            color: "#dc2626",
            marginBottom: 20,
          }}
        >
          {actionError}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {visiblePosts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#a3a3a3",
              fontSize: 14,
              padding: "40px 0",
            }}
          >
            沒有符合條件的留言。
          </div>
        )}
        {visiblePosts.map((post) => {
          const busy = busyIds.has(post.id);
          const hasQuote = !!(post.quote_name || post.quote_text);
          const quotedByCount = quoteCounts.get(post.id) ?? 0;
          return (
            <article
              key={post.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: 14,
                padding: "18px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: post.is_visible ? "#ecfdf5" : "#fef2f2",
                    color: post.is_visible ? "#059669" : "#dc2626",
                  }}
                >
                  {post.is_visible ? "顯示中" : "已隱藏"}
                </span>
                {hasQuote && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: "#eff6ff",
                      color: "#2563eb",
                    }}
                  >
                    引用
                  </span>
                )}
                <span style={{ fontWeight: 700, fontSize: 15 }}>
                  {post.author}
                </span>
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

              {hasQuote && (
                <div
                  style={{
                    background: "#f7f7f7",
                    borderLeft: "3px solid #93c5fd",
                    borderRadius: 8,
                    padding: "8px 12px",
                    margin: "0 0 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#2563eb",
                      marginBottom: 2,
                    }}
                  >
                    引用 {post.quote_name}
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
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#262626",
                  overflowWrap: "anywhere",
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.content}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13,
                    color: "#a3a3a3",
                    marginRight: "auto",
                  }}
                >
                  <span>♥ {post.likes}</span>
                  {quotedByCount > 0 && <span>被引用 {quotedByCount} 次</span>}
                </span>
                <button
                  type="button"
                  className="admin-action"
                  disabled={busy}
                  onClick={() => toggleVisibility(post)}
                  style={{
                    background: "#f1f1f1",
                    color: "#171717",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: busy ? "default" : "pointer",
                  }}
                >
                  {post.is_visible ? "隱藏" : "顯示"}
                </button>
                <button
                  type="button"
                  className="admin-action"
                  disabled={busy}
                  onClick={() => deletePost(post)}
                  style={{
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: busy ? "default" : "pointer",
                  }}
                >
                  刪除
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: ADMIN_STYLE }} />
    </main>
  );
}
