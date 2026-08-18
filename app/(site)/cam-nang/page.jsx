function mapGuide(g) {
  if (!g) return null;
  return {
    slug: g.slug,
    title: g.title,
    excerpt: g.excerpt,
    image: g.cover_image,
    category: g.category,
    author: g.author_name ?? null,
    views: g.view_count ?? 0,
    date: g.published_at ? g.published_at.split("-").reverse().join("/") : null, // yyyy-mm-dd → dd/mm/yyyy
    content: g.content ?? null,
    metaTitle: g.meta_title ?? g.title,
    metaDescription: g.meta_description ?? g.excerpt,
  };
}

export async function getGuides({ category } = {}) {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  q.set("per_page", "30");
  const json = await layJSON(`/guides?${q.toString()}`);
  return (json?.data ?? []).map(mapGuide);
}

export async function getGuideBySlug(slug) {
  const json = await layJSON(`/guides/${slug}`);
  return mapGuide(json?.data ?? json);
}

export async function getGuideSlugs() {
  const json = await layJSON(`/guides-slugs`);
  return json ?? [];
}