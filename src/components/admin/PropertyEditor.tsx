"use client";

import Image from "next/image";
import { useState } from "react";
import { mockAssets } from "@/admin/mock-data";
import type { AdminNavItem, AssetRecord } from "@/admin/types";
import { AssetPicker } from "./AssetPicker";
import { WorksReorder } from "./WorksReorder";
import styles from "./admin.module.css";

type PropertyEditorProps = {
  selectedItem: AdminNavItem;
  onDirty: () => void;
};

const sectionCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  "home.projects": {
    eyebrow: "대표 프로젝트",
    title: "서비스와 커머스에서 맡은 과정을 두 프로젝트로 정리했습니다.",
    description: "프로젝트 노출, 카드 순서와 별도 GPA KOREA 보조 사례를 관리합니다.",
  },
  "home.career": {
    eyebrow: "경력",
    title: "2019년 제품 디자인부터 지금의 서비스 기획까지.",
    description: "회사 경력과 Personal project를 같은 timeline entry로 관리합니다.",
  },
  "home.workflow": {
    eyebrow: "작업 방식",
    title: "목적을 정리하고, 만든 뒤에는 실제 화면에서 확인합니다.",
    description: "Design, Content, Commerce, Product 항목과 도구 태그를 편집합니다.",
  },
  "home.contact": {
    eyebrow: "Contact",
    title: "디자인부터 운영까지, 해온 일을 더 보여드리겠습니다.",
    description: "공개 승인된 연락처와 외부 링크만 게시합니다.",
  },
};

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
      {help ? <small>{help}</small> : null}
    </label>
  );
}

function HeroEditor({ onDirty }: { onDirty: () => void }) {
  const [title, setTitle] = useState("디자인과 콘텐츠를 만들고,\n서비스 화면까지 직접 확인합니다.");
  const [breakMode, setBreakMode] = useState("manual");

  return (
    <div className={styles.editorForm}>
      <Field label="Eyebrow"><input defaultValue="이태웅 · 디자이너" onChange={onDirty} /></Field>
      <Field label="Main title" help="Desktop 2줄 이하, Mobile 3줄 이하를 권장합니다.">
        <textarea rows={4} value={title} onChange={(event) => { setTitle(event.target.value); onDirty(); }} />
      </Field>
      <fieldset className={styles.fieldset}>
        <legend>Line break policy</legend>
        <div className={styles.radioGroup}>
          <label><input type="radio" name="line-break" checked={breakMode === "auto"} onChange={() => { setBreakMode("auto"); onDirty(); }} /> 자동 줄바꿈</label>
          <label><input type="radio" name="line-break" checked={breakMode === "manual"} onChange={() => { setBreakMode("manual"); onDirty(); }} /> 줄바꿈 위치 유지</label>
        </div>
        <small>HTML은 입력하지 않습니다. 제목 입력창의 줄바꿈을 안전한 text segment로 저장합니다.</small>
      </fieldset>
      <Field label="Description" help="2~4문장, 180자 이내를 권장합니다.">
        <textarea rows={5} defaultValue="상세페이지와 배너, 유튜브 썸네일·타이틀·자막을 만들었습니다. 제품 촬영과 영상, 쇼핑라이브 현장을 거쳐 최근에는 서비스 기획과 UI/UX, QA, 개발 협업을 맡고 있습니다." onChange={onDirty} />
      </Field>
      <div className={styles.twoFields}>
        <Field label="Period"><input defaultValue="2019 — NOW" onChange={onDirty} /></Field>
        <Field label="Disciplines"><input defaultValue="Design · Content · Commerce · Product" onChange={onDirty} /></Field>
      </div>
    </div>
  );
}

function AboutEditor({ onDirty }: { onDirty: () => void }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [asset, setAsset] = useState<AssetRecord>(mockAssets[0]);
  const [position, setPosition] = useState("center");
  const positions = ["top-left", "top", "top-right", "left", "center", "right", "bottom-left", "bottom", "bottom-right"];

  return (
    <div className={styles.editorForm}>
      <Field label="Eyebrow"><input defaultValue="About" onChange={onDirty} /></Field>
      <Field label="Title" help="Desktop 2줄 이하를 권장합니다."><textarea rows={3} defaultValue="화면 안의 디자인과 촬영 현장의 일을 함께 해봤습니다." onChange={onDirty} /></Field>
      <Field label="Description"><textarea rows={5} defaultValue="제품을 촬영하고 상세페이지와 배너를 만들었습니다. 영상에서는 썸네일·타이틀·자막을 제작했고, 쇼핑라이브에서는 방송 준비와 현장 운영을 맡았습니다." onChange={onDirty} /></Field>

      <section className={styles.imageProperty}>
        <div className={styles.blockHeading}>
          <div><p className={styles.kicker}>Representative image</p><h3>이미지 속성</h3></div>
          <button className={styles.textButton} type="button" onClick={() => setPickerOpen(true)}>Replace</button>
        </div>
        <div className={styles.imagePreview}><Image src={asset.src} alt="" fill sizes="300px" /></div>
        <dl className={styles.assetDetails}>
          <div><dt>File</dt><dd>{asset.filename}</dd></div>
          <div><dt>Size</dt><dd>{asset.width} × {asset.height}</dd></div>
          <div><dt>Usage</dt><dd>{asset.usageCount} section</dd></div>
        </dl>
        <Field label="Alt text"><textarea rows={3} value={asset.alt} onChange={(event) => { setAsset((current) => ({ ...current, alt: event.target.value })); onDirty(); }} /></Field>
        <Field label="Caption"><input defaultValue="Design · Photo · Video" onChange={onDirty} /></Field>
        <fieldset className={styles.fieldset}>
          <legend>Object position</legend>
          <div className={styles.positionPicker}>
            {positions.map((item) => <button key={item} className={position === item ? styles.positionActive : ""} type="button" aria-label={item} onClick={() => { setPosition(item); onDirty(); }} />)}
          </div>
          <small>숫자 대신 이미지의 기준점을 선택합니다.</small>
        </fieldset>
      </section>

      <section className={styles.editorBlock}>
        <div className={styles.blockHeading}><div><p className={styles.kicker}>Repeater</p><h3>Capability items</h3></div><button className={styles.textButton} type="button">＋ Add</button></div>
        {["Design", "Content", "Commerce", "Product"].map((item, index) => (
          <div className={styles.compactRow} key={item}>
            <span className={styles.dragHandle}>⠿</span><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><button type="button" aria-label={`${item} 편집`}>Edit</button>
          </div>
        ))}
      </section>

      <AssetPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(nextAsset) => { setAsset(nextAsset); setPickerOpen(false); onDirty(); }} />
    </div>
  );
}

function AssetLibraryEditor() {
  return (
    <section className={styles.editorBlock}>
      <div className={styles.blockHeading}><div><p className={styles.kicker}>4 files</p><h3>Asset Library</h3></div><button className={styles.secondaryButton} type="button">Upload</button></div>
      <div className={styles.libraryList}>
        {mockAssets.map((asset) => (
          <article key={asset.id}>
            <div className={styles.libraryThumb}><Image src={asset.src} alt="" fill sizes="72px" /></div>
            <div><h4>{asset.filename}</h4><p>{asset.category} · {asset.width} × {asset.height}</p><span>{asset.fileSize} · {asset.usageCount}곳 사용</span></div>
            <button className={styles.iconButton} type="button" aria-label={`${asset.filename} 메뉴`}>•••</button>
          </article>
        ))}
      </div>
      <div className={styles.validationNote}><span aria-hidden="true">◆</span><p>사용 중인 asset은 바로 삭제하지 않고 참조 위치를 먼저 보여준 뒤 교체 또는 보관 처리합니다.</p></div>
    </section>
  );
}

function GenericSectionEditor({ selectedItem, onDirty }: PropertyEditorProps) {
  const copy = sectionCopy[selectedItem.id] ?? {
    eyebrow: selectedItem.label,
    title: selectedItem.id === "works.archive" ? "실무에서 만든 작업을 모았습니다." : "기존 프로젝트를 편집합니다.",
    description: selectedItem.id === "works.archive" ? "카테고리, 공개 상태와 카드 순서를 관리합니다." : "상세 콘텐츠와 노출 상태를 프로젝트 단위로 관리합니다.",
  };

  return (
    <div className={styles.editorForm}>
      <Field label="Eyebrow"><input defaultValue={copy.eyebrow} onChange={onDirty} /></Field>
      <Field label="Title"><textarea rows={3} defaultValue={copy.title} onChange={onDirty} /></Field>
      <Field label="Description"><textarea rows={4} defaultValue={copy.description} onChange={onDirty} /></Field>
      {selectedItem.id === "home.contact" ? (
        <>
          <Field label="Public email"><input type="email" placeholder="공개 승인 후 입력" onChange={onDirty} /></Field>
          <Field label="Resume URL"><input type="url" placeholder="https://" onChange={onDirty} /></Field>
          <Field label="CTA label"><input defaultValue="작업 모음 보기" onChange={onDirty} /></Field>
        </>
      ) : null}
      {selectedItem.id === "home.career" || selectedItem.id === "home.workflow" || selectedItem.id === "home.projects" || selectedItem.id === "projects.index" ? (
        <section className={styles.editorBlock}>
          <div className={styles.blockHeading}><div><p className={styles.kicker}>Ordered entries</p><h3>{selectedItem.label}</h3></div><button className={styles.textButton} type="button">＋ Add</button></div>
          {["01", "02", "03"].map((number) => <div className={styles.compactRow} key={number}><span className={styles.dragHandle}>⠿</span><span>{number}</span><strong>{selectedItem.id === "home.workflow" ? ["Design", "Content", "Commerce"][Number(number) - 1] : `${selectedItem.label} item`}</strong><button type="button">Edit</button></div>)}
        </section>
      ) : null}
      <div className={styles.validationNote}><span aria-hidden="true">◆</span><p>실제 entity editor는 data adapter 연결 단계에서 이 field contract를 그대로 사용합니다.</p></div>
    </div>
  );
}

export function PropertyEditor({ selectedItem, onDirty }: PropertyEditorProps) {
  return (
    <section className={styles.propertyPane} aria-labelledby="property-heading">
      <header className={styles.propertyHeader}>
        <p className={styles.breadcrumb}>Portfolio / {selectedItem.id.startsWith("home.") ? "Home / " : ""}{selectedItem.label}</p>
        <h2 id="property-heading">{selectedItem.label}</h2>
        <p>이 영역에 실제로 노출되는 콘텐츠만 편집합니다.</p>
      </header>
      <div className={styles.propertyScroll}>
        {selectedItem.id === "home.hero" ? <HeroEditor onDirty={onDirty} /> : null}
        {selectedItem.id === "home.about" ? <AboutEditor onDirty={onDirty} /> : null}
        {selectedItem.id === "home.works" ? <WorksReorder /> : null}
        {selectedItem.id === "assets.library" ? <AssetLibraryEditor /> : null}
        {!(["home.hero", "home.about", "home.works", "assets.library"] as string[]).includes(selectedItem.id) ? <GenericSectionEditor selectedItem={selectedItem} onDirty={onDirty} /> : null}
      </div>
    </section>
  );
}
