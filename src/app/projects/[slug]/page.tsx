import type { Metadata } from "next";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { projects } from "@/data/projects";
import { ContentProvider } from "@/content/ContentProvider";
import { getInitialPublishedSnapshot } from "@/content/server";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getInitialPublishedSnapshot()).projects.find((item) => item.slug === slug && item.visible);
  return {
    title: project ? project.title : "Project not found",
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const initialContent = await getInitialPublishedSnapshot();
  return <ContentProvider initialContent={initialContent}><ProjectDetail slug={slug} /></ContentProvider>;
}
