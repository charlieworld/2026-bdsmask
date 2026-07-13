# 現場即時互動牆（/chat）實作計畫 — 對齊現有專案版

> 目標：在**現有的** bdsmask.org 專案（React Router v8 framework mode、`ssr:false` + prerender、GitHub Actions 部署、apex 網域 base `/`）新增一頁 `/chat`，做成 100 人現場的即時留言 + 點讚牆。
> 決策：① 通關碼 `ASK2026` ② 每人每則只能 like 一次（可 unlike）③ 資料事後保留 ④ 匿名可填暱稱。

---

## 0. 與原範本的差異（重要：不要照原文做的事）

| 原範本 | 為什麼不能照做 | 本計畫的做法 |
|---|---|---|
| `npx create-remix` 開新專案 | 這是**加一頁**，不是新專案 | 在現有 repo 加 `app/routes/chat.tsx` |
| `base: "/repo/"` | 你綁 apex 網域，base 是 `/`；改了會讓全站資產爆掉 | base 維持 `/`，不動 |
| `gh-pages` 推分支 + 改 Pages source | 會推翻現有 Actions 部署、重演 legacy race | 沿用現有 `deploy.yml`，新頁自動一起部署 |
| 邏輯寫進 `_index.tsx` | 那是活動首頁 | 寫在 `chat.tsx` |
| 安全靠前端冷卻 | anon key 公開，前端防護可被繞過 | 以 **RLS + security-definer RPC** 為主，通關碼在 RPC 內驗證 |

---

## 1. 架構

- 前端：現有 React Router v8。`/chat` 是 client-only 頁（prerender 出空殼，`useEffect` 內連 Supabase）。
- 後端：Supabase（Postgres + Realtime）。所有**寫入**走 security-definer RPC；直接改表由 RLS 擋掉。
- 部署：現有 GitHub Actions `deploy.yml`，build 時注入 Supabase env。
- 匯出：活動後手動 Export CSV → Google Sheet（作為存檔備份；資料本體保留在 Supabase）。

---

## 2. Supabase 設定

### 2.1 資料表

```sql
-- 留言
create table public.posts (
  id         uuid primary key default gen_random_uuid(),
  author     text not null default '匿名',
  content    text not null,
  likes      int  not null default 0,          -- 由 RPC 維護的計數
  is_visible boolean not null default true,     -- 主辦後台下架用
  created_at timestamptz not null default now()
);

-- 點讚（一人一則一列，DB 層強制唯一）
create table public.post_likes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  voter_id   text not null,                     -- 瀏覽器端隨機 id（localStorage）
  created_at timestamptz not null default now(),
  primary key (post_id, voter_id)
);
```

### 2.2 RLS（安全核心）

```sql
alter table public.posts       enable row level security;
alter table public.post_likes  enable row level security;

-- 只讀 is_visible=true 的留言
create policy "read visible posts" on public.posts
  for select using (is_visible = true);

-- 讓 client 讀自己按過的讚（載入時還原 like 狀態）
create policy "read likes" on public.post_likes
  for select using (true);

-- 注意：不建立任何 anon 的 INSERT/UPDATE/DELETE policy。
-- 因此 anon 無法直接寫表；所有寫入只能透過下方 security-definer RPC。
```

### 2.3 寫入 RPC（通關碼在這裡驗證）

```sql
-- 發表留言
create or replace function public.create_post(p_author text, p_content text, p_passcode text)
returns public.posts
language plpgsql security definer set search_path = public as $$
declare v_row public.posts; v_content text; v_author text;
begin
  if p_passcode is distinct from 'ASK2026' then raise exception 'invalid passcode'; end if;
  v_content := btrim(coalesce(p_content,''));
  if char_length(v_content) < 1 or char_length(v_content) > 280 then
    raise exception 'content length out of range';
  end if;
  v_author := nullif(btrim(coalesce(p_author,'')), '');
  insert into public.posts(author, content)
  values (coalesce(left(v_author,40),'匿名'), v_content)
  returning * into v_row;
  return v_row;
end $$;
grant execute on function public.create_post(text,text,text) to anon;

-- 點讚 / 取消（toggle），回傳新讚數與目前狀態
create or replace function public.toggle_like(p_post_id uuid, p_voter_id text, p_passcode text)
returns table(post_id uuid, likes int, liked boolean)
language plpgsql security definer set search_path = public as $$
declare v_exists boolean; v_likes int;
begin
  if p_passcode is distinct from 'ASK2026' then raise exception 'invalid passcode'; end if;
  if coalesce(btrim(p_voter_id),'') = '' then raise exception 'missing voter id'; end if;

  select exists(select 1 from public.post_likes
                where post_likes.post_id = p_post_id and post_likes.voter_id = p_voter_id)
    into v_exists;

  if v_exists then
    delete from public.post_likes
      where post_likes.post_id = p_post_id and post_likes.voter_id = p_voter_id;
    update public.posts p set likes = greatest(p.likes - 1, 0)
      where p.id = p_post_id returning p.likes into v_likes;
    return query select p_post_id, v_likes, false;
  else
    insert into public.post_likes(post_id, voter_id) values (p_post_id, p_voter_id)
      on conflict do nothing;
    update public.posts p set likes = p.likes + 1
      where p.id = p_post_id returning p.likes into v_likes;
    return query select p_post_id, v_likes, true;
  end if;
end $$;
grant execute on function public.toggle_like(uuid,text,text) to anon;
```

### 2.4 Realtime

```sql
alter publication supabase_realtime add table public.posts;   -- 或用 Dashboard 勾 Enable Realtime
```
- Client 只需訂閱 `posts` 一張表即可：`INSERT`=新留言、`UPDATE`=讚數變動（RPC 更新 posts.likes）。
- **下架的即時性注意**：把 `is_visible` 設 false 後，因 Realtime 對 anon 也套 RLS，已載入的 client 可能收不到該 UPDATE（新值不符 SELECT policy）→ 只在**重新整理**後消失。若要「即時消失」，建議改用一支下架 RPC 把 `content` 換成「（此留言已由主辦單位隱藏）」而保留 row 可見，這樣 UPDATE 會即時廣播；原文若要留存可另存一欄。低風險活動用「重整才消失」通常也夠。

---

## 3. 前端（現有 repo）

### 3.1 新增/修改檔案
```
app/lib/supabase.ts          建立 supabase client（讀 import.meta.env.VITE_SUPABASE_*）
app/lib/anon.ts              voter_id（localStorage, crypto.randomUUID）+ 隨機趣味暱稱產生器
app/routes/chat.tsx          /chat 頁：通關碼 gate → 留言牆
app/components/Navbar.tsx    加一個「即時互動」→ /chat 連結
react-router.config.ts       prerender 陣列加入 "/chat"
```

### 3.2 chat.tsx 行為
1. **通關碼 gate**：讀 `sessionStorage['ask2026_ok']`；沒有就顯示輸入框，輸入 === `ASK2026` 才進頁並存旗標。（前端只是門簾；真正保護在 RPC。）
2. **身分**：`voter_id` 從 localStorage 取/建；`nickname` 從 localStorage 取，無則給隨機趣味暱稱（如「熱血的長頸鹿」），欄位可改，改完存回。
3. **載入（useEffect，client only）**：
   - `posts`：`select('*').eq('is_visible', true).order('created_at')`
   - 我的讚：`post_likes.select('post_id').eq('voter_id', voterId)` → 存成 Set 還原 like 狀態
   - 訂閱 Realtime `posts`：INSERT 加到列表、UPDATE 更新讚數
4. **發表**：`rpc('create_post', { p_author, p_content, p_passcode:'ASK2026' })`，樂觀更新。
5. **like/unlike**：`rpc('toggle_like', { p_post_id, p_voter_id, p_passcode:'ASK2026' })`，樂觀切換本地 Set + 讚數；失敗回滾。
6. **體感優化**：送出按鈕短暫 disabled、樂觀 UI、Realtime 斷線自動重連（會場 wifi 常不穩）。
7. **告知**：頁面標註「留言將被記錄並保留」。

---

## 4. 部署（改一處）

`.github/workflows/deploy.yml` 的 build step 加 env（值放 repo Settings → Secrets）：
```yaml
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```
- anon key 本就是公開值，但仍走 Secret 管理較整潔。通關碼 `ASK2026` 不是機密（發給參與者），檢查在 RPC 端。
- 其餘部署維持不變（Actions、apex 網域、base `/`）。

---

## 5. 誠實條款（風險與界線）

- **通關碼**：會被打包進前端、也會發給 100 人，屬「軟門檻」，不是機密。它擋路人、擋場外隨機打 API，但擋不了知道碼的人。
- **一人一讚**：靠 localStorage 的 `voter_id`。防重複點有效；清快取換身分重刷擋不了。低風險活動可接受。
- **灌水/洗版**：RPC 已擋空字串/超長；真正的 rate limit 無登入難做到位。可接受範圍內，必要時活動中由後台看情況處理。
- **資料保留**：不自動刪。免費專案閒置 7 天會暫停（資料不失，喚醒即回）；建議活動後另匯出 CSV 存檔備份。
- **隱私（此活動特別在意）**：禁羈為 kink/BDSM 學術活動，留言可能敏感。已改為匿名、明確告知留存；Supabase 預設美國區，若在意資料落地可建專案時選區域。

---

## 6. 施工順序（建議）

1. Supabase：建專案 → 跑 §2 的 SQL（表 + RLS + RPC + Realtime）。
2. repo：加 `supabase.ts` / `anon.ts` / `chat.tsx` / Navbar 連結 / prerender 加 `/chat`；本地 `npm run dev` 用測試 Supabase 專案跑通留言+讚+即時同步。
3. GitHub：加 Secrets（URL、anon key）；改 `deploy.yml` env。
4. 開 branch → PR → 你手動合併；合併後實測 `/chat`：兩個瀏覽器互看即時同步、like 一次不能重複、unlike 正常、通關碼錯誤被 RPC 擋下。
