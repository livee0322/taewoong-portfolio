# Portfolio Admin data model

Canonical frontend contract는 `src/content/schema.ts`의 `PortfolioSnapshot`이며, 초기 V1 콘텐츠는 `src/content/seed.ts` 한 곳에서 구성한다. Admin과 Public renderer가 같은 snapshot type과 ordering을 사용한다.

## Snapshot shape

- `home`: Hero, About, Featured Projects, Selected Works, Career, Workflow, Contact copy/config
- `categories`: 현재 다섯 category의 label/frame/visible/order
- `works`: public Works와 Home reel/featured가 공유하는 ordered records
- `projects`: 기존 LIVBEE/Shopping Live detail과 Home exposure
- `career`: 회사 경력과 `personal-project` LIVBEE ordered records
- `workflow`: Design/Content/Commerce/Product ordered records
- `assets`: library/upload/external metadata and 3×3 focal position

별도 Admin/Public 복제본을 만들지 않는다. Array order 자체가 UI order이며 Publish snapshot에 원자적으로 보존된다.

## PostgreSQL

Migrations:

- `supabase/migrations/20260831105927_production_reconciliation.sql`
- `supabase/migrations/20260831110257_publish_rpc_least_privilege.sql`
- `supabase/migrations/20260831112754_harden_publish_rpc.sql`

| Object | Operation |
| --- | --- |
| `portfolio_cms_state` | singleton Draft read/insert/update |
| `draft_revisions` | append/read only |
| `published_versions` | public read only; insert/current marker 변경은 Publish RPC 내부에서만 수행 |
| `assets` | cross-device canonical metadata read/insert/update |
| `portfolio-assets` bucket | public image read/upload/replace; metadata 실패 orphan에 한해 cleanup delete |

`public.publish_portfolio()`는 SECURITY INVOKER wrapper다. Data API에 노출되지 않는 `private.publish_portfolio_impl()`이 Draft row를 잠그고 기존 current marker를 내린 뒤 새 Published snapshot을 한 transaction에서 insert한다. 완료 전에는 이전 current snapshot이 계속 유효하다.

## Public write policy

Auth를 사용하지 않으므로 RLS 대상은 `anon, authenticated`다. 모든 exposed table은 RLS를 활성화하고 2026 Data API exposure 변경에 대비해 필요한 table/sequence/function 권한을 명시적으로 grant한다. Service role/secret key는 브라우저에 절대 노출하지 않는다.

Public write는 의도된 제품 요구사항이지만 보안 경계가 아니다. 데이터 무결성은 다음으로 유지한다.

- JSON object/schema version checks
- non-empty Hero/Work fields
- Work image alt requirement
- featured 정확히 1개 및 Home exposure dependency
- HTTPS + actual image load + alt external URL validation
- 10MB image limit and image MIME allowlist
- append-only revision history
- atomic current publication pointer

## Environment

`NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 사용한다. legacy project는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`도 지원한다. 값이 없을 때만 localStorage fallback을 사용하며, 값이 있으면 Supabase 오류를 그대로 실패로 처리한다.
