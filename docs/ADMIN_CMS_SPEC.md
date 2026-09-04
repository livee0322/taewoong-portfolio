# Portfolio Admin CMS

## Goal

`/admin`은 현재 Portfolio 디자인을 그대로 편집하는 공개 시각 편집기다. 로그인, 비밀번호, admin token, Supabase Auth, allowlist, feature gate는 사용하지 않는다. 개인 포트폴리오 운영 편의를 위해 누구나 읽고 쓸 수 있는 public write CMS로 운영하며, URL을 아는 제3자가 콘텐츠를 변경할 수 있다는 위험을 의도적으로 수용한다.

## Editing experience

- Navigator: Home 7개 section, Works, Projects, Assets
- Property Editor: 선택한 공개 화면의 실제 필드만 편집
- Preview: Published와 같은 renderer에 Draft snapshot을 주입
- Desktop: Navigator / Property / Preview 3-pane
- Tablet: Navigator + Editor/Preview tab
- Mobile: Section selector + Editor/Preview tab
- 상태: Connected / Saving / Error + Unsaved changes → Save Draft → Preview → Publish

입력 중 local state는 Preview에 즉시 반영된다. Save Draft는 작업본만 보존하고 공개 화면은 바꾸지 않는다. Publish가 완료되어야 일반 `/`, `/works`, project detail이 새 snapshot을 읽는다. 페이지 이탈 시 unsaved warning을 표시한다.

## Editable scope

- Hero: eyebrow, title, line breaks, description, period, disciplines
- About: heading, image, alt, caption, 3×3 object position, capability order/copy
- Featured Projects: four canonical Project records, Home visibility and keyboard reorder
- Project entry: category, title, summary, thumbnail/alt/focal position, roles/tools, detail URL, external URL, visibility and Home exposure
- Selected Works: search/filter, title, category, description, Asset Replace, alt, published, Home reel, single featured, drag/keyboard order
- Category: fixed five labels, visibility, order
- Career: company/personal project copy, visibility, order
- Workflow: copy, tools, visibility, order
- Contact: copy, CTA, approved public email/resume URL
- Assets: library, image upload, external HTTPS URL, metadata, selection
- Revision: recent published versions and restore-to-Draft

새 Project/category를 무한 생성하거나 Portfolio visual을 재설계하는 기능은 범위 밖이다.

## Preview selection

공개 renderer section은 `data-cms-section`을 가진다. Admin은 same-origin `postMessage`로 section focus를 보내고, Preview 클릭은 `cms:select`를 돌려준다. origin은 현재 origin과 정확히 일치해야 한다.

## Validation

저장과 Publish 전에 required Hero copy, image/alt, Work title/image/alt, 정확히 4개의 unique Project ID/order, Project 필수 필드/detail URL, HTTPS external URL, 정확히 한 개의 Home featured, featured의 Home 노출 상태를 검사한다. Published version은 삭제하지 않고 restore가 새 Draft를 만든다.

## Runtime modes

1. Supabase configured: `portfolio_cms_state`, `draft_revisions`, `published_versions`, `assets`, public Storage bucket를 유일한 persistence source로 사용
2. Supabase not configured: 같은 브라우저의 localStorage fallback 사용

Supabase 환경값이 존재하면 query/RLS/network/Storage 오류를 localStorage fallback으로 숨기지 않고 CMS Error로 표시한다. Fallback은 환경값 자체가 없는 로컬 개발에만 사용한다.
