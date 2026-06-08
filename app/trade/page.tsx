import { InnerPage } from "@/components/InnerPage";
import { pageData } from "@/lib/pageData";

export const metadata = {
  title: "Trade | Exness Global",
  description: "Advanced trading execution, order types, AI tools and risk controls."
};

export default function TradePage() {
  return <InnerPage data={pageData.trade} />;
}
