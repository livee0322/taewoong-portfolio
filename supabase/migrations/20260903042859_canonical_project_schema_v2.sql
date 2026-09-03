-- Allow existing v1 snapshots to remain readable while all new CMS writes use
-- the canonical v2 Project contract shared by Home, detail routes and Admin.

alter table public.portfolio_cms_state
  drop constraint if exists portfolio_cms_state_schema_version_check;
alter table public.portfolio_cms_state
  add constraint portfolio_cms_state_schema_version_check check (schema_version in (1, 2));

alter table public.published_versions
  drop constraint if exists published_versions_schema_version_check;
alter table public.published_versions
  add constraint published_versions_schema_version_check check (schema_version in (1, 2));

create or replace function public.portfolio_snapshot_is_valid(candidate jsonb)
returns boolean
language sql
immutable
security invoker
set search_path = ''
as $$
  select
    jsonb_typeof(candidate) = 'object'
    and candidate ->> 'schemaVersion' in ('1', '2')
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
    )
    and (
      candidate ->> 'schemaVersion' = '1'
      or (
        jsonb_array_length(candidate -> 'projects') = 4
        and (
          select count(distinct project ->> 'id') = 4
            and count(distinct (project ->> 'sortOrder')::integer) = 4
          from jsonb_array_elements(candidate -> 'projects') as project
        )
        and not exists (
          select 1 from jsonb_array_elements(candidate -> 'projects') as project
          where length(trim(coalesce(project ->> 'id', ''))) = 0
            or length(trim(coalesce(project ->> 'slug', ''))) = 0
            or length(trim(coalesce(project ->> 'category', ''))) = 0
            or length(trim(coalesce(project ->> 'title', ''))) = 0
            or length(trim(coalesce(project ->> 'summary', ''))) = 0
            or length(trim(coalesce(project #>> '{thumbnail,alt}', ''))) = 0
            or coalesce(project ->> 'detailPageUrl', '') !~ '^/projects/[a-z0-9-]+$'
            or jsonb_typeof(project -> 'visible') <> 'boolean'
            or jsonb_typeof(project -> 'showOnHome') <> 'boolean'
        )
      )
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
  candidate_schema_version integer;
begin
  if not public.portfolio_snapshot_is_valid(candidate) then raise exception 'Draft validation failed'; end if;
  candidate_schema_version := (candidate ->> 'schemaVersion')::integer;

  select coalesce(draft_revision, 0) + 1 into next_revision
  from public.portfolio_cms_state where id = 'portfolio' for update;
  if next_revision is null then next_revision := 1; end if;

  insert into public.portfolio_cms_state (id, schema_version, draft_snapshot, draft_revision, updated_at)
  values ('portfolio', candidate_schema_version, candidate, next_revision, now())
  on conflict (id) do update
    set schema_version = excluded.schema_version,
        draft_snapshot = excluded.draft_snapshot,
        draft_revision = excluded.draft_revision,
        updated_at = excluded.updated_at;

  insert into public.draft_revisions (draft_revision, snapshot, change_note)
  values (next_revision, candidate, note);
  return next_revision;
end;
$$;
