import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jasonsglasstint.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: '/',                               priority: 1.0,  changeFrequency: 'weekly'  as const },
    { path: '/automotive-window-tint',         priority: 0.9,  changeFrequency: 'monthly' as const },
    { path: '/residential-window-tint',        priority: 0.9,  changeFrequency: 'monthly' as const },
    { path: '/commercial-window-tint',         priority: 0.9,  changeFrequency: 'monthly' as const },
    { path: '/marine-window-tint',             priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/frost-film',                     priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/safety-film',                    priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/san-clemente-window-tint',       priority: 0.9,  changeFrequency: 'monthly' as const },
    { path: '/talega-window-tint',             priority: 0.8,  changeFrequency: 'monthly' as const },
    { path: '/dana-point-window-tint',         priority: 0.8,  changeFrequency: 'monthly' as const },
    { path: '/san-juan-capistrano-window-tint',priority: 0.8,  changeFrequency: 'monthly' as const },
    { path: '/ladera-ranch-window-tint',       priority: 0.8,  changeFrequency: 'monthly' as const },
    { path: '/camp-pendleton-window-tint',     priority: 0.8,  changeFrequency: 'monthly' as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url:              `${SITE_URL}${path}`,
    lastModified:     now,
    changeFrequency,
    priority,
  }));
}
