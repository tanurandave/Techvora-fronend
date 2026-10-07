import { MetadataRoute } from 'next'
import { fetchPublishedArticles } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techvora.com'
  
  // Static Routes
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/roadmaps`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/interview-prep`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ]
  
  try {
    // Dynamic Blog Routes
    const res = await fetchPublishedArticles(0, 1000);
    const dynamicRoutes = res.content.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
    return [...staticRoutes, ...dynamicRoutes];
  } catch (e) {
    console.error("Sitemap generation failed", e)
    return staticRoutes;
  }
}
