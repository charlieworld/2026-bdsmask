-- toggle_like 的回傳欄位 likes 與 posts.likes 同名，更新時必須限定資料表別名。
create or replace function public.toggle_like(
  p_post_id uuid,
  p_voter_id text,
  p_passcode text
)
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
  v_room := case p_passcode
    when 'ASK2026' then 'ask2026'
    when 'ASKLIVE' then 'asklive'
    else null
  end;
  if v_room is null then raise exception 'invalid passcode'; end if;
  if coalesce(btrim(p_voter_id), '') = '' then raise exception 'missing voter id'; end if;

  if not exists (
    select 1 from public.posts p
    where p.id = p_post_id and p.room = v_room and p.is_visible
  ) then
    raise exception 'post not found';
  end if;

  select exists(
    select 1 from public.post_likes pl
    where pl.post_id = p_post_id and pl.voter_id = p_voter_id
  ) into v_exists;

  if v_exists then
    delete from public.post_likes pl
    where pl.post_id = p_post_id and pl.voter_id = p_voter_id;
    update public.posts p
    set likes = greatest(p.likes - 1, 0)
    where p.id = p_post_id
    returning p.likes into v_likes;
    return query select p_post_id, v_likes, false;
  end if;

  insert into public.post_likes(post_id, voter_id)
  values (p_post_id, p_voter_id)
  on conflict do nothing;
  update public.posts p
  set likes = p.likes + 1
  where p.id = p_post_id
  returning p.likes into v_likes;
  return query select p_post_id, v_likes, true;
end;
$$;

grant execute on function public.toggle_like(uuid, text, text) to anon;

notify pgrst, 'reload schema';
