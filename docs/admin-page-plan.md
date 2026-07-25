# 管理頁面（/admin）實作計畫 — 留言審核

> 目標：在現有專案新增一頁 `/admin`，讓主辦方**隱藏 / 顯示 / 刪除**留言。以管理密語 `iamyourmaster` 進入。
> 對齊現況：React Router v8、prerender、GitHub Actions 部署、Supabase（RLS + security-definer RPC）。

---

## 0. 安全模型（最重要）

- 靜態站無法藏真正的機密。**管理密語 `iamyourmaster` 不寫死在前端原始碼/bundle**（寫死＝讀 JS 就能刪光）。
- 做法：管理員在 gate 輸入密語 → 前端拿它去呼叫 **security-definer 管理 RPC**，RPC 在**後端**比對密語才執行。前端從不含 literal，讀 JS 讀不到。
- 「驗證」邏輯：輸入密語後呼叫 `admin_list_posts(密語)`；成功（能載到含隱藏的全部留言）＝密語正確，進入管理 UI；失敗（RPC raise unauthorized）＝顯示錯誤。**不在 client 端比對字串**。
- 密語存放：僅存 React state（重整需重新輸入），不落 localStorage，降低外洩面。
- 誠實界線：這是「共用靜態密語」而非逐人帳號登入。知道密語的人都能審核；可被暴力猜（RPC 對 anon 開放）。對活動級審核工具足夠；要更強需接 Supabase Auth（真登入）。`/admin` 不出現在 Navbar、不被索引（noindex），僅靠網址進入。

---

## 1. Supabase：三支管理 RPC（security definer，密語後端驗證）

```sql
-- 列出「全部」留言（含已隱藏），供管理頁；RLS 只給 is_visible=true，故需 security definer 繞過
create or replace function public.admin_list_posts(p_passcode text)
returns setof public.posts
language plpgsql security definer set search_path = public as $$
begin
  if p_passcode is distinct from 'iamyourmaster' then raise exception 'unauthorized'; end if;
  return query select * from public.posts order by created_at desc;
end $$;
grant execute on function public.admin_list_posts(text) to anon;

-- 隱藏 / 顯示（toggle is_visible）
create or replace function public.admin_set_visibility(p_id uuid, p_visible boolean, p_passcode text)
returns public.posts
language plpgsql security definer set search_path = public as $$
declare v_row public.posts;
begin
  if p_passcode is distinct from 'iamyourmaster' then raise exception 'unauthorized'; end if;
  update public.posts set is_visible = p_visible where id = p_id returning * into v_row;
  return v_row;
end $$;
grant execute on function public.admin_set_visibility(uuid, boolean, text) to anon;

-- 永久刪除（cascade 連帶刪 post_likes，因 FK on delete cascade）
create or replace function public.admin_delete_post(p_id uuid, p_passcode text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_passcode is distinct from 'iamyourmaster' then raise exception 'unauthorized'; end if;
  delete from public.posts where id = p_id;
end $$;
grant execute on function public.admin_delete_post(uuid, text) to anon;
```

- RLS 不用改：管理 RPC 是 security definer，繞過 RLS；一般 anon 仍只能讀 is_visible=true、只能透過既有 RPC 寫入。
- 刪除為**永久**（配 UI 二次確認）；隱藏為**可逆**（顯示/隱藏來回切），是「留存但下架」的選項。

### 1.1 置頂留言 migration

`supabase/migrations/20260725000000_add_post_pinning.sql` 新增 `posts.pinned_at` 與 `admin_set_post_pin` RPC。一次只能置頂一則可見留言；置頂另一則會自動取消前一則，隱藏留言也會取消置頂。

---

## 2. 前端 `app/routes/admin.tsx`（client-only，prerender 成 gate 空殼）

- **密語 gate**：輸入 → `rpc('admin_list_posts',{p_passcode})`；成功進管理 UI 並把密語放 React state（供後續 RPC 用）；失敗顯示「密語錯誤」。
- **留言清單**（新→舊，含隱藏）：每列顯示
  - 暱稱（可著色，沿用 hue）、時間、內文、讚數、狀態徽章（`顯示中` / `已隱藏`）。
  - 動作：`隱藏`／`顯示` 切換（呼 `admin_set_visibility`）、`刪除`（呼 `admin_delete_post`，**點擊需二次確認**）。
- 動作後就地更新清單（樂觀更新或重抓）。
- 篩選（可選）：全部 / 只看已隱藏。
- `meta` 設 `noindex`；**不加 Navbar 連結**（靠網址進入）。
- prerender 安全：Supabase 呼叫只在 useEffect/handler；未驗證時 render 出純 gate，不碰瀏覽器 API。

---

## 3. 路由 / 部署

- `app/routes.ts` 加 `route("admin", "routes/admin.tsx")`。
- `react-router.config.ts` 的 prerender 陣列加 `"/admin"`（gate 空殼）。
- 部署：**無需新 Secret**（密語是輸入值，不進 env）；現有 `deploy.yml` 自動帶上線。

---

## 4. 已知限制 / 取捨

- **即時性**：隱藏 `is_visible=false` 或刪除後，**已經在看牆的人**因 Realtime 對 anon 套 RLS，可能要**重整才會消失**；新載入者立即看不到。對「事後審核」足夠。
  - 若要「當場秒消失」，可另做：隱藏改為一支 `admin_redact` RPC 把內容換成「（已由主辦單位隱藏）」但保留 row 可見 → UPDATE 事件能即時廣播；原文可另存一欄保留。看你要不要。
- 刪除永久且會連帶刪該留言的讚（cascade）。與活動「資料保留」目標的差異：刪除是「主動移除違規內容」的審核動作，隱藏則是可逆下架；一般情況建議優先用「隱藏」，刪除留給必要時。

---

## 5. 施工順序

1. Supabase SQL Editor 跑 §1 三支 RPC。
2. repo：加 `admin.tsx` + 路由註冊 + prerender；本地 `npm run dev` 用密語進、測隱藏/顯示/刪除。
3. curl 驗後端：錯誤密語被擋、正確密語可列全部/切可見/刪除。
4. 開 branch → PR → 你手動合併 → 線上實測（/admin 進入、隱藏一則到公開牆重整消失、刪除生效）。
