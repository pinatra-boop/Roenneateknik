import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin – Rønne Autoteknik" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex bg-surface">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-6 pt-20 lg:pt-6">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
