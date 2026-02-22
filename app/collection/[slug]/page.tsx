import { redirect } from "next/navigation";

const legacyMap: Record<string, string> = {
  "dark-mysterious": "bodysocks",
  "dentelle-sensual": "set",
  "sultry-suspicious": "bodysuit",
};

export default async function LegacyCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mapped = legacyMap[slug] || "all";
  redirect(`/collection?legacy=${slug}&type=${mapped}`);
}

