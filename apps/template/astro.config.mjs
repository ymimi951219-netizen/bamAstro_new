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
        // 홈페이지 - 최우선
        if (item.url.endsWith('/') || item.url.endsWith('.com')) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        // 메인 가이드 페이지 (Pillar) - 높은 우선순위
        else if (item.url.includes('-guide') && !item.url.includes('/faq')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // FAQ 페이지 - 중간 우선순위
        else if (item.url.includes('/faq')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        // 블로그 페이지 - 높은 우선순위
        else if (item.url.includes('/blog/') && !item.url.includes('/page/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        // 블로그 목록/페이지네이션
        else if (item.url.includes('/blog')) {
          item.priority = 0.6;
          item.changefreq = 'weekly';
        }
        // 비교 페이지 (vs 페이지)
        else if (item.url.includes('-vs-')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        }
        // 지역 가이드 페이지
        else if (item.url.includes('-seohyeon') || item.url.includes('-yatap') || item.url.includes('-pangyo')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        }
        // 연락처 페이지
        else if (item.url.includes('/contact')) {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        // 법적 페이지 (개인정보, 이용약관)
        else if (item.url.includes('/privacy') || item.url.includes('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
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
