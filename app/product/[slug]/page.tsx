import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log('🔍 Server component slug:', slug);
  
  return <ProductPageClient slug={slug} />;
}
