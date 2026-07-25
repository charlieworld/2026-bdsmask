-- 舊版與現場專屬版 create_post 的參數型別不同，會讓 PostgREST 回傳 300 Multiple Choices。
-- 移除所有舊 overload，只保留前端目前使用的 8 參數版本。
do $$
declare
  v_signature regprocedure;
begin
  for v_signature in
    select p.oid::regprocedure
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'create_post'
  loop
    execute format('drop function %s', v_signature);
  end loop;
end;
$$;

create function public.create_post(
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
  v_room := case p_passcode
    when 'ASK2026' then 'ask2026'
    when 'ASKLIVE' then 'asklive'
    else null
  end;
  if v_room is null then raise exception 'invalid passcode'; end if;

  v_content := btrim(coalesce(p_content, ''));
  if char_length(v_content) < 1 or char_length(v_content) > 500 then
    raise exception 'content length out of range';
  end if;

  v_author := nullif(btrim(coalesce(p_author, '')), '');
  insert into public.posts (
    author, content, hue, quote_name, quote_text, quote_hue, quote_post_id, room
  )
  values (
    coalesce(left(v_author, 40), '匿名'), v_content, p_hue,
    p_quote_name, p_quote_text, p_quote_hue, p_quote_post_id, v_room
  )
  returning * into v_row;
  return v_row;
end;
$$;

grant execute on function public.create_post(
  text, text, text, integer, text, text, integer, uuid
) to anon;

notify pgrst, 'reload schema';
