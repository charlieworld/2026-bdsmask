-- 留言異動紀錄：保留新增、更新與刪除的完整快照，供管理員救回誤刪資料。
create table if not exists public.post_audit (
  id bigint generated always as identity primary key,
  post_id uuid not null,
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  occurred_at timestamptz not null default now(),
  old_row jsonb,
  new_row jsonb
);

create index if not exists post_audit_post_id_occurred_at_idx
  on public.post_audit (post_id, occurred_at desc);

alter table public.post_audit enable row level security;

create or replace function public.audit_post_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.post_audit (post_id, operation, new_row)
    values (new.id, tg_op, to_jsonb(new));
    return new;
  end if;

  if tg_op = 'UPDATE' then
    insert into public.post_audit (post_id, operation, old_row, new_row)
    values (new.id, tg_op, to_jsonb(old), to_jsonb(new));
    return new;
  end if;

  insert into public.post_audit (post_id, operation, old_row)
  values (old.id, tg_op, to_jsonb(old));
  return old;
end;
$$;

drop trigger if exists posts_audit_changes on public.posts;

create trigger posts_audit_changes
after insert or update or delete on public.posts
for each row execute function public.audit_post_change();
