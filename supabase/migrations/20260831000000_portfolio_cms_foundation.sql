-- Portfolio CMS foundation for Supabase/PostgreSQL.
-- Review in a non-production project before applying. This migration seeds no users or secrets.

create extension if not exists pgcrypto;

create type public.portfolio_publish_state as enum ('draft', 'published', 'archived');
create type public.portfolio_admin_role as enum ('editor', 'super_admin');
create type public.portfolio_asset_source as enum ('upload', 'library', 'external');
create type public.portfolio_asset_health as enum ('unknown', 'healthy', 'unavailable');
create type public.portfolio_media_ratio as enum ('wide', 'portrait', 'square', 'detail');
create type public.portfolio_media_tone as enum ('ink', 'paper', 'sage', 'stone', 'rose', 'sand');
create type public.portfolio_object_fit as enum ('cover', 'contain');
create type public.portfolio_object_position as enum (
  'top-left', 'top', 'top-right',
  'left', 'center', 'right',
  'bottom-left', 'bottom', 'bottom-right'
);
create type public.portfolio_career_type as enum ('career', 'personal_project');

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.portfolio_admin_role not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and active = true
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  source_type public.portfolio_asset_source not null,
  storage_path text,
  external_url text,
  filename text not null check (length(trim(filename)) > 0),
  mime_type text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  byte_size bigint not null check (byte_size >= 0),
  alt_text text,
  caption text,
  category text,
  health_state public.portfolio_asset_health not null default 'unknown',
  last_checked_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assets_source_location_check check (
    (source_type in ('upload', 'library') and storage_path is not null and external_url is null)
    or (source_type = 'external' and external_url is not null and storage_path is null)
  )
);

create unique index assets_storage_path_unique on public.assets (storage_path) where storage_path is not null;

create table public.portfolio_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) > 0),
  seo_title text,
  seo_description text,
  publish_state public.portfolio_publish_state not null default 'draft',
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.portfolio_pages (id) on delete cascade,
  section_key text not null check (section_key ~ '^[a-z0-9]+(?:[.-][a-z0-9]+)*$'),
  label text not null check (length(trim(label)) > 0),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  sort_order integer not null default 0 check (sort_order >= 0),
  visible boolean not null default true,
  publish_state public.portfolio_publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, section_key)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  number text not null,
  title text not null check (length(trim(title)) > 0),
  subtitle text not null,
  year_label text not null,
  project_type text not null,
  roles text[] not null default '{}',
  tools text[] not null default '{}',
  summary text not null,
  intro text not null,
  hero_asset_id uuid not null references public.assets (id) on delete restrict,
  hero_alt text not null check (length(trim(hero_alt)) > 0),
  hero_ratio public.portfolio_media_ratio not null,
  hero_tone public.portfolio_media_tone not null,
  hero_caption text,
  hero_object_position public.portfolio_object_position not null default 'center',
  external_url text,
  show_on_home boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  publish_state public.portfolio_publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  section_key text not null check (section_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  label text not null,
  title text not null,
  body text not null,
  items text[] not null default '{}',
  sort_order integer not null default 0 check (sort_order >= 0),
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, section_key)
);

create table public.work_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null unique check (length(trim(name)) > 0),
  preview_type public.portfolio_media_ratio not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.visual_works (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) > 0),
  category_id uuid not null references public.work_categories (id) on delete restrict,
  asset_id uuid not null references public.assets (id) on delete restrict,
  alt_text text not null check (length(trim(alt_text)) > 0),
  description text,
  caption text,
  external_link text,
  ratio public.portfolio_media_ratio not null,
  preview_type public.portfolio_media_ratio not null,
  object_fit public.portfolio_object_fit not null default 'cover',
  object_position public.portfolio_object_position not null default 'center',
  show_on_home boolean not null default false,
  home_featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  home_sort_order integer check (home_sort_order is null or home_sort_order >= 0),
  publish_state public.portfolio_publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint visual_works_featured_requires_home check (home_featured = false or show_on_home = true)
);

create unique index visual_works_single_home_featured on public.visual_works (home_featured) where home_featured = true;
create index visual_works_category_order on public.visual_works (category_id, sort_order);
create index visual_works_home_order on public.visual_works (home_sort_order) where show_on_home = true;

create table public.career_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type public.portfolio_career_type not null default 'career',
  period text not null,
  company text not null,
  team text not null,
  position text,
  role text not null,
  description text not null,
  highlights text[] not null default '{}',
  sort_order integer not null default 0 check (sort_order >= 0),
  visible boolean not null default true,
  publish_state public.portfolio_publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  description text not null,
  tools text[] not null default '{}',
  sort_order integer not null default 0 check (sort_order >= 0),
  visible boolean not null default true,
  publish_state public.portfolio_publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.draft_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  before_data jsonb not null,
  after_data jsonb not null,
  change_note text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index draft_revisions_entity_history on public.draft_revisions (entity_type, entity_id, created_at desc);

create table public.published_versions (
  id uuid primary key default gen_random_uuid(),
  version_number bigint generated always as identity unique,
  schema_version integer not null default 1 check (schema_version > 0),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  source_revision_ids uuid[] not null default '{}',
  published_by uuid not null references auth.users (id) on delete restrict,
  published_at timestamptz not null default now(),
  is_current boolean not null default false
);

create unique index published_versions_single_current on public.published_versions (is_current) where is_current = true;

create or replace function public.set_portfolio_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger admin_users_updated_at before update on public.admin_users for each row execute function public.set_portfolio_updated_at();
create trigger assets_updated_at before update on public.assets for each row execute function public.set_portfolio_updated_at();
create trigger portfolio_pages_updated_at before update on public.portfolio_pages for each row execute function public.set_portfolio_updated_at();
create trigger portfolio_sections_updated_at before update on public.portfolio_sections for each row execute function public.set_portfolio_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function public.set_portfolio_updated_at();
create trigger project_sections_updated_at before update on public.project_sections for each row execute function public.set_portfolio_updated_at();
create trigger work_categories_updated_at before update on public.work_categories for each row execute function public.set_portfolio_updated_at();
create trigger visual_works_updated_at before update on public.visual_works for each row execute function public.set_portfolio_updated_at();
create trigger career_entries_updated_at before update on public.career_entries for each row execute function public.set_portfolio_updated_at();
create trigger workflow_entries_updated_at before update on public.workflow_entries for each row execute function public.set_portfolio_updated_at();

alter table public.admin_users enable row level security;
alter table public.assets enable row level security;
alter table public.portfolio_pages enable row level security;
alter table public.portfolio_sections enable row level security;
alter table public.projects enable row level security;
alter table public.project_sections enable row level security;
alter table public.work_categories enable row level security;
alter table public.visual_works enable row level security;
alter table public.career_entries enable row level security;
alter table public.workflow_entries enable row level security;
alter table public.draft_revisions enable row level security;
alter table public.published_versions enable row level security;

create policy "admin reads own allowlist row" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create policy "admins manage assets" on public.assets for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage pages" on public.portfolio_pages for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage sections" on public.portfolio_sections for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage projects" on public.projects for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage project sections" on public.project_sections for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage work categories" on public.work_categories for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage visual works" on public.visual_works for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage career entries" on public.career_entries for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage workflow entries" on public.workflow_entries for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage draft revisions" on public.draft_revisions for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));
create policy "admins manage published versions" on public.published_versions for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));

create policy "public reads current portfolio snapshot" on public.published_versions
  for select to anon, authenticated using (is_current = true);

insert into public.portfolio_pages (slug, title, sort_order)
values ('home', 'Home', 0), ('works', 'Works', 1)
on conflict (slug) do nothing;

insert into public.work_categories (slug, name, preview_type, sort_order)
values
  ('youtube-thumbnail', '유튜브 썸네일', 'wide', 0),
  ('caption-title', '자막·타이틀 디자인', 'wide', 1),
  ('event-banner', '이벤트 배너', 'square', 2),
  ('shopping-live', '쇼핑라이브 콘텐츠', 'wide', 3),
  ('detail-page', '상세페이지', 'detail', 4)
on conflict (slug) do nothing;
