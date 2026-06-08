import { CrmShell } from "@/components/CrmShell";

export const metadata = { title: "Admin Panel | Exness Global CRM" };

export default function AdminDashboardPage() {
  return <CrmShell mode="admin" page="dashboard" />;
}
