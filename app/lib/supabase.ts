import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * 惰性取得 Supabase client。
 *
 * 重要：/chat 頁會被 prerender（build 時等同一次 server 端靜態渲染）。
 * 因此絕不能在模組頂層或 render 期間建立 client——只能在 useEffect 或事件
 * handler 內呼叫本函式。若 env 缺（例如 build 時沒注入 secrets），回傳 null，
 * 讓頁面仍能渲染出通關碼空殼而不會讓 prerender 失敗。
 */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  client = createClient(url, anonKey);
  return client;
}
