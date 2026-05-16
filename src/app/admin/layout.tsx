import prisma from "@/lib/prisma";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.systemSettings.findFirst();

  return (
    <AdminLayoutClient settings={settings}>
      {children}
    </AdminLayoutClient>
  );
}
