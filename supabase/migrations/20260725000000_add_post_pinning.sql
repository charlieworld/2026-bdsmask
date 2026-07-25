-- 管理頁手動置頂：同一時間只允許一則留言置頂。
alter table public.posts
  add column if not exists pinned_at timestamptz;

create index if not exists posts_visible_pinned_created_at_idx
  on public.posts (pinned_at desc nulls last, created_at desc)
  where is_visible = true;

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
begin
  if p_passcode is distinct from 'iamyourmaster' then
    raise exception 'unauthorized';
  end if;

  if p_pinned then
    update public.posts set pinned_at = null where pinned_at is not null;
    update public.posts
      set pinned_at = now()
      where id = p_id and is_visible = true
      returning * into v_row;

    if v_row.id is null then
      raise exception 'post not found or hidden';
    end if;
  else
    update public.posts
      set pinned_at = null
      where id = p_id
      returning * into v_row;

    if v_row.id is null then
      raise exception 'post not found';
    end if;
  end if;

  return v_row;
end;
$$;

grant execute on function public.admin_set_post_pin(uuid, boolean, text) to anon;

-- 隱藏留言時一併取消置頂，避免日後重新顯示舊的置頂狀態。
create or replace function public.admin_set_visibility(
  p_id uuid,
  p_visible boolean,
  p_passcode text
)
returns public.posts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.posts;
begin
  if p_passcode is distinct from 'iamyourmaster' then
    raise exception 'unauthorized';
  end if;

  update public.posts
    set is_visible = p_visible,
        pinned_at = case when p_visible then pinned_at else null end
    where id = p_id
    returning * into v_row;

  if v_row.id is null then
    raise exception 'post not found';
  end if;

  return v_row;
end;
$$;

grant execute on function public.admin_set_visibility(uuid, boolean, text) to anon;
