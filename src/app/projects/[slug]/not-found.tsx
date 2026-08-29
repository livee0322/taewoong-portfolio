import { TextLink } from "@/components/ui/TextLink";

export default function ProjectNotFound() {
  return (
    <main className="not-found page-shell">
      <p className="eyebrow">404</p>
      <h1>프로젝트를 찾을 수 없습니다.</h1>
      <p>선택한 주소가 바뀌었거나 아직 공개되지 않은 프로젝트입니다.</p>
      <TextLink href="/" arrow="←">홈으로 돌아가기</TextLink>
    </main>
  );
}
