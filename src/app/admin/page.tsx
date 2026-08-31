import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminStudio } from "@/components/admin/AdminStudio";

export const metadata: Metadata = {
  title: "Portfolio Editor",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const foundationEnabled = process.env.NODE_ENV === "development" || process.env.ADMIN_FOUNDATION_ENABLED === "true";
  if (!foundationEnabled) notFound();

  return <AdminStudio />;
}
