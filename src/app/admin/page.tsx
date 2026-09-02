import type { Metadata } from "next";
import { AdminStudio } from "@/components/admin/AdminStudio";

export const metadata: Metadata = {
  title: "Portfolio Editor",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminStudio />;
}
