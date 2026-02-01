import { defineMiddleware } from 'astro:middleware';
// import { BLOG_REDIRECTS } from './lib/blog-redirects';

// 리다이렉트 비활성화 - DB 슬러그 업데이트 후 활성화
// SEO 슬러그 업데이트가 완료되면 주석 해제
export const onRequest = defineMiddleware(async (context, next) => {
  // const { pathname } = context.url;

  // // Check if this is a blog post URL that needs redirect
  // if (pathname.startsWith('/blog/')) {
  //   const slug = pathname.replace('/blog/', '').replace(/\/$/, '');

  //   // Skip pagination and index
  //   if (slug === '' || slug.startsWith('page/')) {
  //     return next();
  //   }

  //   // Check if old slug needs redirect
  //   const newSlug = BLOG_REDIRECTS[slug];
  //   if (newSlug) {
  //     return context.redirect(`/blog/${newSlug}`, 301);
  //   }
  // }

  return next();
});
