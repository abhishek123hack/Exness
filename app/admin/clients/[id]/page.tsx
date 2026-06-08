import { AdminClientDetail } from "@/components/AdminClientDetail";

export default function AdminClientDetailPage({ params }: { params: { id: string } }) {
  return <AdminClientDetail clientId={params.id} />;
}
