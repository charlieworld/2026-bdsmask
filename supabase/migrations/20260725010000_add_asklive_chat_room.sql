-- 將現有與現場專屬互動牆隔離。現有資料全數保留在 ask2026。
alter table public.posts
  add column if not exists pinned_at timestamptz,
  add column if not exists room text not null default 'ask2026';

create index if not exists posts_room_visible_pinned_created_at_idx
  on public.posts (room, pinned_at desc nulls last, created_at desc)
  where is_visible = true;

create or replace function public.create_post(
  p_author text,
  p_content text,
  p_passcode text,
  p_hue integer,
  p_quote_name text,
  p_quote_text text,
  p_quote_hue integer,
  p_quote_post_id uuid
)
returns public.posts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.posts;
  v_content text;
  v_author text;
  v_room text;
begin
  v_room := case p_passcode when 'ASK2026' then 'ask2026' when 'ASKLIVE' then 'asklive' else null end;
  if v_room is null then raise exception 'invalid passcode'; end if;
  v_content := btrim(coalesce(p_content, ''));
  if char_length(v_content) < 1 or char_length(v_content) > 500 then
    raise exception 'content length out of range';
  end if;
  v_author := nullif(btrim(coalesce(p_author, '')), '');
  insert into public.posts (author, content, hue, quote_name, quote_text, quote_hue, quote_post_id, room)
  values (coalesce(left(v_author, 40), '匿名'), v_content, p_hue, p_quote_name, p_quote_text, p_quote_hue, p_quote_post_id, v_room)
  returning * into v_row;
  return v_row;
end;
$$;

grant execute on function public.create_post(text, text, text, integer, text, text, integer, uuid) to anon;

create or replace function public.toggle_like(p_post_id uuid, p_voter_id text, p_passcode text)
returns table(post_id uuid, likes integer, liked boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exists boolean;
  v_likes integer;
  v_room text;
begin
  v_room := case p_passcode when 'ASK2026' then 'ask2026' when 'ASKLIVE' then 'asklive' else null end;
  if v_room is null then raise exception 'invalid passcode'; end if;
  if coalesce(btrim(p_voter_id), '') = '' then raise exception 'missing voter id'; end if;
  if not exists (select 1 from public.posts where id = p_post_id and room = v_room and is_visible) then
    raise exception 'post not found';
  end if;
  select exists(select 1 from public.post_likes where post_likes.post_id = p_post_id and post_likes.voter_id = p_voter_id) into v_exists;
  if v_exists then
    delete from public.post_likes where post_likes.post_id = p_post_id and post_likes.voter_id = p_voter_id;
    update public.posts set likes = greatest(likes - 1, 0) where id = p_post_id returning likes into v_likes;
    return query select p_post_id, v_likes, false;
  else
    insert into public.post_likes(post_id, voter_id) values (p_post_id, p_voter_id) on conflict do nothing;
    update public.posts set likes = likes + 1 where id = p_post_id returning likes into v_likes;
    return query select p_post_id, v_likes, true;
  end if;
end;
$$;

grant execute on function public.toggle_like(uuid, text, text) to anon;

-- 每個互動牆各自可有一則置頂留言。
create or replace function public.admin_set_post_pin(
  p_id uuid,
  p_pinned boolean,
  p_passcode text
)
returns public.posts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.posts;
  v_room text;
begin
  if p_passcode is distinct from 'iamyourmaster' then raise exception 'unauthorized'; end if;
  select room into v_room from public.posts where id = p_id;
  if v_room is null then raise exception 'post not found'; end if;
  if p_pinned then
    update public.posts set pinned_at = null where room = v_room and pinned_at is not null;
    update public.posts set pinned_at = now() where id = p_id and is_visible = true returning * into v_row;
    if v_row.id is null then raise exception 'post hidden'; end if;
  else
    update public.posts set pinned_at = null where id = p_id returning * into v_row;
  end if;
  return v_row;
end;
$$;

grant execute on function public.admin_set_post_pin(uuid, boolean, text) to anon;
