# Portfolio Admin CMS specification

## Goal

포트폴리오의 실제 화면 구조를 따라가며 콘텐츠를 안전하게 편집하는 관리자 CMS를 만든다. 관리자는 DB table이 아니라 `Home → Hero`처럼 공개 화면의 위치를 선택한다. Preview가 편집기의 중심이며 Property Editor는 선택한 영역의 속성만 보여준다.

이 문서의 기준은 PR #2 `feat/portfolio-v1`의 commit `a6b7dba82f9ed0b30be454f64c6b2e892207a014`이다.

## Current portfolio audit

| Public area | Current source | Current shape / constraint |
| --- | --- | --- |
| Home Hero | `src/components/home/HomeSections.tsx` | hardcoded copy, intentional `<br>`, period, disciplines |
| About | `HomeSections.tsx` local `capabilities` | heading, local image, four ordered capability tuples |
| Featured Projects | `HomeSections.tsx` + `src/data/projects.ts` | all projects rendered, GPA/SellerChart note is separate copy |
| Selected Works | `HomeSections.tsx` + `src/data/works.ts` | one hardcoded featured id and seven hardcoded reel ids |
| Career | `src/data/career.ts` + `HomeSections.tsx` | company entries are data; LIVBEE Personal project is a separate hardcoded row |
| Workflow | `HomeSections.tsx` local `workflow` | four ordered tuples: title, description, tools |
| Contact | `HomeSections.tsx` | copy and `/works` CTA only; no approved public email/resume yet |
| Works | `src/app/works/page.tsx` + `src/data/works.ts` | five fixed categories; category determines preview frame |
| Project detail | `src/data/projects.ts` + `ProjectDetail.tsx` | typed overview, ordered story sections, gallery, optional live URL |
| Images | `public/images/**` + `next/image` | local paths, explicit alt, ratio/tone, top/center/bottom focal bias |

Typography, spacing, image frame and visual tokens remain canonical in `src/app/globals.css`. Admin styles never replace or import values back into the public renderer.

## Information architecture

```text
Portfolio
└─ Home
   ├─ 01 Hero
   ├─ 02 About
   ├─ 03 Featured Projects
   ├─ 04 Selected Works
   ├─ 05 Career
   ├─ 06 Workflow
   └─ 07 Contact
Works
└─ Works Archive
Projects
└─ Project Entries
Assets
└─ Asset Library
Settings
└─ Site Settings
```

`Projects`는 기존 상세 페이지 두 개를 관리한다. V1에서 임의 slug로 상세 페이지를 무한 생성하지 않는다. `Works` category 역시 현재 다섯 개를 기본값으로 두고, super admin만 추가·숨김을 허용한다.

## Screen structure

Desktop 1280/1440은 세 영역을 동시에 유지한다.

| Area | Responsibility |
| --- | --- |
| Left · Section Navigator | 공개 Portfolio 구조 탐색, 선택 상태, section 순서 이해 |
| Center · Property Editor | 선택한 section의 copy, media, ordered entries, validation |
| Right · Preview | Desktop 1440 / Tablet 768 / Mobile 390, section/page view |

상단 bar에는 문서 상태와 `Save Draft`, `Preview`, `Publish`를 둔다. Preview는 가장 넓은 영역을 차지하며 일반 SaaS 통계 dashboard는 만들지 않는다.

## Editor UX

### Hero

- `eyebrow`, `title_segments`, `description`, `period`, `disciplines`
- title은 HTML을 받지 않는다.
- `line_break_policy=auto`는 plain text 하나, `manual`은 안전한 text segment 배열로 저장한다.
- Desktop 2줄, Mobile 3줄을 넘으면 warning을 표시하고 Preview 확인을 요구한다.

### About

- heading copy, representative asset, alt, caption, object position
- capability item: number, title, description, sort order, visible
- capability 순서는 drag and drop으로 편집한다.

### Featured Projects

- 기존 project의 title, subtitle, summary, hero, tags, URL, published, show on home, order
- GPA/SellerChart 보조 사례는 project detail이 아니라 `home.projects.supporting_note`로 보존한다.

### Selected Works

- card grid에서 drag and drop; 숫자 `sort_order` 입력은 노출하지 않는다.
- 공개 여부와 홈 노출은 별도다.
- `home_featured`는 단일 선택이며 새 선택 시 기존 선택 해제를 확인한다.
- 현재 hardcoded featured/reel id는 초기 migration에서 이 상태로 변환한다.

### Career

- 회사 경력과 LIVBEE를 같은 `career_entries` entity로 저장한다.
- LIVBEE는 `entry_type=personal_project`로 구분한다. 화면 순서·visibility·공통 필드는 동일하므로 별도 table을 만들지 않는다.

### Workflow

- title, description, tools, order, visible
- tools는 자유 서술문이 아니라 tag input으로 저장하고 표시할 때 현재 구분자 규칙으로 join한다.

### Contact

- title, description, approved public email, external links, resume URL, CTA
- 공개 승인되지 않은 연락처는 빈 값으로 유지한다. mock 개인정보를 만들지 않는다.

## Image workflow

세 가지 진입점을 제공한다.

1. Upload: drag/drop 또는 file picker → format/size 검사 → Storage 업로드 → asset record 생성
2. Asset Library: 기존 asset 검색/필터 → usage 확인 → 선택
3. External URL: HTTPS와 allowlist 검사 → fetch 가능 여부/format 확인 → 게시 전 Storage 복사를 권장

외부 URL은 원본 변경, hotlink 차단, 만료, CORS 문제로 비권장이다. 예외적으로 유지할 때는 health 상태와 마지막 확인 시각을 저장한다.

이미지 Property Editor는 preview, filename, alt, caption, link, object fit, 3×3 object-position, replace, remove를 제공한다. CSS 숫자를 사용자에게 입력시키지 않는다. 사용 중인 asset은 삭제 대신 참조 위치를 보여주고 교체 또는 archive를 먼저 수행한다.

## Preview UX

Foundation의 iframe source는 같은 origin의 `/`, `/works`, `/projects/livbee`다. viewport container width만 1440/768/390으로 바꾼다. 현재 section view는 가능한 public anchor로 이동하지만, Hero와 Workflow에는 public identifier가 없어 안내 상태를 표시한다.

향후 데이터 흐름은 다음과 같다.

```text
Admin draft → Preview adapter → Preview renderer
             Publish action → immutable published_version → Public Portfolio
```

편집 중인 draft는 public renderer가 읽지 않는다. Preview는 draft snapshot을 명시적으로 전달받는 별도 read path를 사용한다.

## Bidirectional section selection

Canonical identifier는 dot notation을 사용한다.

| CMS id | Future public attribute | Current anchor |
| --- | --- | --- |
| `home.hero` | `data-cms-section="home.hero"` | none |
| `home.about` | `data-cms-section="home.about"` | `#about` |
| `home.projects` | `data-cms-section="home.projects"` | `#projects` |
| `home.works` | `data-cms-section="home.works"` | `#works` |
| `home.career` | `data-cms-section="home.career"` | `#experience` |
| `home.workflow` | `data-cms-section="home.workflow"` | none |
| `home.contact` | `data-cms-section="home.contact"` | `#contact` |

Integration phase에서만 public sections에 `data-cms-section`을 추가한다. Admin → iframe은 `postMessage({ type: "cms:focus", sectionId })`, iframe → Admin은 `postMessage({ type: "cms:select", sectionId })`를 사용한다. origin을 정확히 검증하고 wildcard target origin을 사용하지 않는다.

## Draft, preview and publish

| State | Meaning | Public effect |
| --- | --- | --- |
| Unsaved changes | 브라우저 local state가 draft와 다름 | 없음 |
| Draft saved | working entity/revision 저장 완료 | 없음 |
| Preview | draft snapshot을 preview renderer로 확인 | 없음 |
| Published | 검증된 snapshot을 immutable version으로 승격 | 다음 public read부터 반영 |
| Archived | editor 목록 기본 숨김 | 기존 published version에는 영향 없음 |

`Save Draft`와 `Publish`는 분리한다. Publish는 validation 결과, 마지막 preview viewport, 변경 summary를 보여준 뒤 확인한다. 동시에 두 명이 편집할 가능성은 작아도 `updated_at` 또는 revision id 기반 optimistic concurrency를 적용한다.

## Revision and restore

모든 mutation은 entity, entity id, before, after, actor, created_at을 `draft_revisions`에 append한다. Publish는 여러 entity revision을 하나의 `published_versions` snapshot으로 묶는다. Restore는 과거 JSON을 새 draft revision으로 복사하며 과거 row 자체를 수정하지 않는다.

## Authentication and access

Production `/admin`은 다음 상태를 가진다.

1. unauthenticated: sign-in으로 redirect하고 원래 admin path를 안전하게 보존
2. authenticated non-admin: 403, public Portfolio로 이동 가능
3. authenticated admin: role/active 확인 후 shell 렌더
4. expired/revoked: draft 충돌 방지를 위해 local changes warning 후 재인증
5. logout: server session/cookie 폐기, Supabase sign-out, `/admin/login` 이동

권장 구현은 Supabase Auth user + `admin_users(user_id, role, active)` allowlist다. 클라이언트의 role claim만 믿지 않고 server에서 allowlist와 session을 확인한다. service role key는 브라우저에 노출하지 않는다.

Foundation route는 개발 환경에서만 기본 활성화된다. production/preview는 `ADMIN_FOUNDATION_ENABLED=true`가 없으면 404다. 이 flag는 인증이 아니므로 Supabase Auth가 연결되기 전에는 Vercel Deployment Protection 같은 상위 접근제어가 있는 preview에서만 사용한다.

## Validation

| Rule | Editor response | Publish response |
| --- | --- | --- |
| required title empty | inline error | block |
| title line/length recommendation exceeded | warning + viewport shortcuts | confirm required or block by field contract |
| invalid URL / non-HTTPS external media | inline error | block |
| missing required image or alt | asset field error | block |
| unsupported format / oversized upload | reject before upload | n/a |
| duplicate `home_featured` | exclusive selection UI | database unique constraint |
| duplicate slug or section key | inline error | database unique constraint |
| referenced asset deletion | usage list | block until replaced |
| unpublished category/project referenced by home | dependency warning | block |

## Responsive admin

- 1280/1440: Navigator + Property + Preview 동시 표시
- 768: Navigator 유지, Editor/Preview tab 전환
- Mobile: 긴급 copy 수정 정도만 고려하며 full authoring은 V1 목표가 아니다.
- 각 pane은 독립 scroll을 사용하고 전체 브라우저 body scroll에 의존하지 않는다.

## Foundation scope

구현됨: `/admin` shell, section navigator, property editors, iframe preview, viewport/mode switch, asset picker, 3×3 position picker, work reorder interaction, draft/publish UI state, typed mock contract.

의도적으로 미연결: Supabase client, Storage upload, real mutations, real draft preview, real publish, revision restore, public renderer query, section marker, production auth. 이 항목은 `ADMIN_FRONTEND_CONTRACT.md` 순서대로 연결한다.
