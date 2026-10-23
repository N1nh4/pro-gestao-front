import ConfigPageClient from "@/components/config/ConfigPageClient";

export const instant = false;

export default async function ConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  return <ConfigPageClient requestedTab={typeof tab === "string" ? tab : undefined} />;
}
