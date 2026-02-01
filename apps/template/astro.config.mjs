import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://bundanghipublic.com', // 지역별 도메인으로 변경
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // 페이지별 SEO 우선순위 및 크롤링 빈도 설정
      serialize(item) {
        if (item.url.endsWith('/') || item.url.endsWith('.com')) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.match(/-guide\/?$/) && !item.url.includes('/faq') && !item.url.includes('/station/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.match(/\/station\/[^/]+\/?$/) && !item.url.includes('/karaoke') && !item.url.includes('/highpublic') && !item.url.includes('/nightlife')) {
          item.priority = 0.85;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/station/') && (item.url.includes('/karaoke') || item.url.includes('/highpublic') || item.url.includes('/nightlife'))) {
          item.priority = 0.75;
          item.changefreq = 'monthly';
        } else if (item.url.match(/-guide\/(price|how-to-use|etiquette|ranking|review)/)) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/faq')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/guide/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('-hub') || item.url.includes('-map')) {
          item.priority = 0.85;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/glossary')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else if (item.url.includes('-vs-') || item.url.includes('/compare/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/blog/') && !item.url.includes('/page/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog')) {
          item.priority = 0.6;
          item.changefreq = 'weekly';
        } else if (item.url.includes('-price-guide')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        return item;
      },
      // 제외할 페이지
      filter: (page) => !page.includes('/404') && !page.includes('/api/'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['lucide-astro'],
    },
    build: {
      cssMinify: true,
    },
  },
});
