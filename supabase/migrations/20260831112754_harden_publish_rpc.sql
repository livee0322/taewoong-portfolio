create schema if not exists private;

create or replace function private.publish_portfolio_impl()
returns table (id uuid, version_number bigint, published_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  state_row public.portfolio_cms_state%rowtype;
  published_row public.published_versions%rowtype;
begin
  select * into state_row from public.portfolio_cms_state where portfolio_cms_state.id = 'portfolio' for update;
  if not found then raise exception 'Save a draft before publishing'; end if;
  if not public.portfolio_snapshot_is_valid(state_row.draft_snapshot) then raise exception 'Draft validation failed'; end if;
  update public.published_versions set is_current = false where is_current;
  insert into public.published_versions (snapshot, schema_version, change_note, is_current)
  values (state_row.draft_snapshot, state_row.schema_version, 'Published from public Portfolio CMS', true)
  returning * into published_row;
  return query select published_row.id, published_row.version_number, published_row.published_at;
end;
$$;

create or replace function public.publish_portfolio()
returns table (id uuid, version_number bigint, published_at timestamptz)
language sql
security invoker
set search_path = ''
as $$
  select * from private.publish_portfolio_impl();
$$;

revoke all on schema private from public, anon, authenticated;
revoke all on function private.publish_portfolio_impl() from public, anon, authenticated;
revoke all on function public.publish_portfolio() from public, anon, authenticated;
grant usage on schema private to anon;
grant execute on function private.publish_portfolio_impl() to anon;
grant execute on function public.publish_portfolio() to anon;
