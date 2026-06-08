import { InnerPage } from "@/components/InnerPage";
import { pageData } from "@/lib/pageData";

export const metadata = {
  title: "Accounts | Exness Global",
  description: "Starter, Pro, Elite and VIP account tiers for premium traders."
};

export default function AccountsPage() {
  return <InnerPage data={pageData.accounts} />;
}
