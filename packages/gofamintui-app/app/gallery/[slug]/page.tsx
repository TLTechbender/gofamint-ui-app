import GalleryClient from "@/components/galleryClient";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <GalleryClient slug={slug} />
    </div>
  );
}
