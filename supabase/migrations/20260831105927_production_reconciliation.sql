-- Portfolio CMS production baseline: intentionally public read/write, without Supabase Auth.
-- Draft and Published are independent snapshots. publish_portfolio() promotes one
-- complete snapshot atomically, so readers never observe a partial publication.

create extension if not exists pgcrypto;
create schema if not exists private;

create table public.portfolio_cms_state (
  id text primary key check (id = 'portfolio'),
  schema_version integer not null default 1 check (schema_version = 1),
  draft_snapshot jsonb not null check (jsonb_typeof(draft_snapshot) = 'object'),
  draft_revision bigint not null default 0 check (draft_revision >= 0),
  updated_at timestamptz not null default now()
);

create table public.draft_revisions (
  id uuid primary key default gen_random_uuid(),
  draft_revision bigint not null,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  change_note text,
  created_at timestamptz not null default now()
);

create index draft_revisions_latest on public.draft_revisions (created_at desc);

create table public.published_versions (
  id uuid primary key default gen_random_uuid(),
  version_number bigint generated always as identity unique,
  schema_version integer not null default 1 check (schema_version = 1),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  change_note text,
  published_at timestamptz not null default now(),
  is_current boolean not null default false
);

create unique index published_versions_single_current on public.published_versions (is_current) where is_current;
create index published_versions_latest on public.published_versions (version_number desc);

create table public.assets (
  id text primary key default gen_random_uuid()::text,
  storage_path text unique,
  external_url text,
  public_path text,
  filename text not null check (length(trim(filename)) > 0),
  mime_type text not null check (mime_type like 'image/%'),
  byte_size bigint not null check (byte_size between 0 and 10485760),
  alt_text text not null default '',
  caption text not null default '',
  category text not null default 'Uploads',
  source text not null default 'upload' check (source in ('library','upload','external')),
  object_position text not null default 'center' check (object_position in ('top-left','top','top-right','left','center','right','bottom-left','bottom','bottom-right')),
  created_at timestamptz not null default now(),
  constraint asset_location check (
    num_nonnulls(storage_path, external_url, public_path) = 1
    and (external_url is null or external_url ~ '^https://')
    and (public_path is null or public_path ~ '^/')
  )
);

create or replace function public.portfolio_snapshot_is_valid(candidate jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select
    jsonb_typeof(candidate) = 'object'
    and candidate ->> 'schemaVersion' = '1'
    and length(trim(candidate #>> '{home,hero,title}')) > 0
    and length(trim(candidate #>> '{home,hero,description}')) > 0
    and jsonb_typeof(candidate -> 'works') = 'array'
    and jsonb_typeof(candidate -> 'projects') = 'array'
    and jsonb_typeof(candidate -> 'career') = 'array'
    and jsonb_typeof(candidate -> 'workflow') = 'array'
    and (
      select count(*) = 1
      from jsonb_array_elements(candidate -> 'works') as work
      where coalesce((work ->> 'homeFeatured')::boolean, false)
    )
    and not exists (
      select 1 from jsonb_array_elements(candidate -> 'works') as work
      where coalesce(work ->> 'title', '') = ''
        or coalesce(work ->> 'alt', '') = ''
        or (coalesce((work ->> 'homeFeatured')::boolean, false) and not coalesce((work ->> 'showOnHome')::boolean, false))
    );
$$;

create or replace function public.save_portfolio_draft(candidate jsonb, note text default 'Draft saved')
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  next_revision bigint;
begin
  if not public.portfolio_snapshot_is_valid(candidate) then raise exception 'Draft validation failed'; end if;
  select coalesce(draft_revision, 0) + 1 into next_revision
  from public.portfolio_cms_state where id = 'portfolio' for update;
  if next_revision is null then next_revision := 1; end if;

  insert into public.portfolio_cms_state (id, draft_snapshot, draft_revision, updated_at)
  values ('portfolio', candidate, next_revision, now())
  on conflict (id) do update
    set draft_snapshot = excluded.draft_snapshot,
        draft_revision = excluded.draft_revision,
        updated_at = excluded.updated_at;

  insert into public.draft_revisions (draft_revision, snapshot, change_note)
  values (next_revision, candidate, note);
  return next_revision;
end;
$$;

alter table public.portfolio_cms_state add constraint valid_draft_snapshot check (public.portfolio_snapshot_is_valid(draft_snapshot));
alter table public.draft_revisions add constraint valid_revision_snapshot check (public.portfolio_snapshot_is_valid(snapshot));
alter table public.published_versions add constraint valid_published_snapshot check (public.portfolio_snapshot_is_valid(snapshot));

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

alter table public.portfolio_cms_state enable row level security;
alter table public.draft_revisions enable row level security;
alter table public.published_versions enable row level security;
alter table public.assets enable row level security;

create policy "public reads cms state" on public.portfolio_cms_state for select to anon, authenticated using (true);
create policy "public creates cms state" on public.portfolio_cms_state for insert to anon, authenticated with check (id = 'portfolio');
create policy "public updates cms state" on public.portfolio_cms_state for update to anon, authenticated using (id = 'portfolio') with check (id = 'portfolio');
create policy "public reads draft revisions" on public.draft_revisions for select to anon, authenticated using (true);
create policy "public appends draft revisions" on public.draft_revisions for insert to anon, authenticated with check (true);
create policy "public reads published versions" on public.published_versions for select to anon, authenticated using (true);
create policy "public reads assets" on public.assets for select to anon, authenticated using (true);
create policy "public creates assets" on public.assets for insert to anon, authenticated with check (true);
create policy "public updates assets" on public.assets for update to anon, authenticated using (true) with check (true);

revoke all on public.portfolio_cms_state, public.draft_revisions, public.published_versions, public.assets from anon, authenticated;
revoke all on function public.portfolio_snapshot_is_valid(jsonb) from public, anon, authenticated;
revoke all on function public.save_portfolio_draft(jsonb, text) from public, anon, authenticated;
revoke all on function public.publish_portfolio() from public, anon, authenticated;
revoke all on schema private from public, anon, authenticated;
revoke all on function private.publish_portfolio_impl() from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant usage on schema private to anon;
grant select, insert, update on public.portfolio_cms_state to anon, authenticated;
grant select, insert on public.draft_revisions to anon, authenticated;
grant select on public.published_versions to anon, authenticated;
grant select, insert, update on public.assets to anon, authenticated;
grant execute on function public.portfolio_snapshot_is_valid(jsonb) to anon, authenticated;
grant execute on function public.save_portfolio_draft(jsonb, text) to anon, authenticated;
grant execute on function public.publish_portfolio() to anon;
grant execute on function private.publish_portfolio_impl() to anon;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-assets', 'portfolio-assets', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads portfolio assets" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-assets');
create policy "public uploads portfolio assets" on storage.objects for insert to anon, authenticated with check (bucket_id = 'portfolio-assets');
create policy "public replaces portfolio assets" on storage.objects for update to anon, authenticated using (bucket_id = 'portfolio-assets') with check (bucket_id = 'portfolio-assets');
create policy "public removes failed portfolio uploads" on storage.objects for delete to anon, authenticated using (bucket_id = 'portfolio-assets');

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;
