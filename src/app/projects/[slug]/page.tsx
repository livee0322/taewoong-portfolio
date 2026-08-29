import type { Metadata } from "next";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { projects, projectBySlug } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return {
    title: project ? project.title : "Project not found",
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} />;
}
