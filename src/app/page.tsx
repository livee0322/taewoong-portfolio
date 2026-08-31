import { HomeSections } from "@/components/home/HomeSections";
import { ContentProvider } from "@/content/ContentProvider";
import { getInitialPublishedSnapshot } from "@/content/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialContent = await getInitialPublishedSnapshot();
  return <ContentProvider initialContent={initialContent}><HomeSections /></ContentProvider>;
}
