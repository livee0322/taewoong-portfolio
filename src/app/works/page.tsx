import { WorksArchive } from "@/components/works/WorksArchive";
import { ContentProvider } from "@/content/ContentProvider";
import { getInitialPublishedSnapshot } from "@/content/server";

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const initialContent = await getInitialPublishedSnapshot();
  return <ContentProvider initialContent={initialContent}><WorksArchive /></ContentProvider>;
}
