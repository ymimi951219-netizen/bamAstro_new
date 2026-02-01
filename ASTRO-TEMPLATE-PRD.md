# Astro 지역 랜딩 페이지 템플릿 PRD

> **목적**: 신규 지역 사이트를 SEO 최적화된 Astro 기반으로 빠르게 생성하기 위한 템플릿 명세서

---

## 1. 개요

### 1.1 현재 문제점 (React/Vite)

| 항목 | 현재 상태 | 문제점 |
|------|-----------|--------|
| 렌더링 방식 | CSR (Client Side Rendering) | 초기 HTML이 비어있음, 크롤러 의존성 |
| Core Web Vitals | LCP 2.5s+, FID 높음 | JS 로딩 후 콘텐츠 표시 |
| Sitemap | 수동 작성 | 페이지 추가 시 누락 가능 |
| 이미지 최적화 | 수동 webp 변환 | 반응형 이미지 미지원 |
| 빌드 결과 | SPA 번들 | 단일 JS 파일, 코드 스플리팅 제한적 |

### 1.2 Astro 전환 이점

| 항목 | Astro 적용 후 |
|------|---------------|
| 렌더링 방식 | SSG (Static Site Generation) - 100% 정적 HTML |
| Core Web Vitals | LCP < 1.5s, FID 거의 0 |
| JavaScript | 0KB 기본, 필요시만 Island Architecture |
| Sitemap | `@astrojs/sitemap`으로 자동 생성 |
| 이미지 | `astro:assets`로 자동 최적화, WebP/AVIF 변환 |
| SEO | 페이지별 완전한 HTML, 메타태그 SSG |

---

## 2. 기술 스택

```yaml
Framework: Astro 5.x
Styling: Tailwind CSS 3.x
Icons: Lucide (astro-icon)
Deployment: Vercel (Static)
Image Optimization: astro:assets (Sharp)

Integrations:
  - @astrojs/tailwind
  - @astrojs/sitemap
  - astro-seo
  - astro-robots-txt
```

### 2.1 의존성

```json
{
  "dependencies": {
    "astro": "^5.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "astro-seo": "^0.8.0",
    "astro-robots-txt": "^1.0.0",
    "sharp": "^0.33.0"
  }
}
```

---

## 3. 프로젝트 구조

```
apps/{region}/
├── astro.config.mjs          # Astro 설정
├── tailwind.config.mjs       # Tailwind 설정
├── tsconfig.json
├── package.json
│
├── public/
│   ├── favicon.ico
│   ├── favicon.png
│   ├── og-*.jpg              # OG 이미지들
│   ├── robots.txt            # (자동 생성 가능)
│   └── images/
│       ├── gallery/          # 갤러리 이미지
│       ├── venues/           # 업소별 메인 이미지
│       └── partners/         # 제휴 업체 이미지
│
├── src/
│   ├── config/
│   │   └── region.ts         # ⭐ 지역별 설정 (핵심)
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro  # 기본 레이아웃 (Head, Header, Footer)
│   │   └── PageLayout.astro  # 페이지 레이아웃 (Breadcrumb 포함)
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Breadcrumbs.astro
│   │   │   ├── StickyContact.astro
│   │   │   └── SEO.astro     # 메타태그 + Schema.org
│   │   │
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── Features.astro
│   │   │   ├── Gallery.astro
│   │   │   ├── VenuePreview.astro
│   │   │   └── ContactSection.astro
│   │   │
│   │   ├── venue/
│   │   │   ├── VenueHero.astro
│   │   │   ├── VenueInfo.astro
│   │   │   ├── PriceTable.astro
│   │   │   └── FAQ.astro
│   │   │
│   │   └── schema/
│   │       ├── LocalBusinessSchema.astro
│   │       ├── ServiceSchema.astro
│   │       ├── FAQSchema.astro
│   │       ├── BreadcrumbSchema.astro
│   │       └── OrganizationSchema.astro
│   │
│   ├── pages/
│   │   ├── index.astro                           # 홈
│   │   ├── [region]-hyperpub-guide.astro         # 하이퍼블릭
│   │   ├── [region]-karaoke-guide.astro          # 가라오케
│   │   ├── [region]-shirtsroom-guide.astro       # 셔츠룸
│   │   ├── [region]-kimono-room-guide.astro      # 기모노룸
│   │   ├── [region]-room-salon-guide.astro       # 룸살롱
│   │   ├── [region]-hostbar-guide.astro          # 호빠
│   │   ├── [region]-hyperpub-guide/
│   │   │   └── faq.astro                         # 하이퍼블릭 FAQ
│   │   ├── [region]-karaoke-guide/
│   │   │   └── faq.astro                         # 가라오케 FAQ
│   │   ├── [region]-room-salon-guide/
│   │   │   └── faq.astro                         # 룸살롱 FAQ
│   │   ├── [region]-entertainment-price-guide.astro    # 가격 가이드
│   │   ├── [region]-entertainment-beginner-guide.astro # 초보자 가이드
│   │   ├── contact.astro                         # 연락처
│   │   ├── terms.astro                           # 이용약관
│   │   ├── privacy.astro                         # 개인정보처리방침
│   │   └── 404.astro                             # 404 페이지
│   │
│   ├── styles/
│   │   └── global.css                            # 전역 스타일
│   │
│   └── utils/
│       └── seo.ts                                # SEO 유틸리티
│
└── vercel.json                                   # Vercel 설정
```

---

## 4. 지역 설정 파일 (핵심)

### 4.1 `src/config/region.ts`

```typescript
export interface RegionConfig {
  // 기본 정보
  id: string;                    // bundang, dongtan, gwanggyo
  name: string;                  // 분당, 동탄, 광교
  nameEn: string;                // Bundang, Dongtan, Gwanggyo
  domain: string;                // bundanghipublic.com

  // 연락처
  phone: string;                 // 010-2626-4833
  phoneFormatted: string;        // 010-2626-4833
  kakaoId: string;               // @pbsewoo
  kakaoLink: string;             // http://qr.kakao.com/...
  telegramId: string;            // @pbsewoo
  telegramLink: string;          // https://t.me/pbsewoo
  email: string;                 // ymimi9512@gmail.com

  // 위치 정보
  address: {
    street: string;              // 서현역·야탑역 일대
    city: string;                // 성남시
    cityEn: string;              // Seongnam-si
    region: string;              // 경기도
    regionEn: string;            // Gyeonggi-do
  };
  geo: {
    lat: number;                 // 37.3827
    lng: number;                 // 127.1189
  };

  // 랜드마크 (SEO 키워드)
  landmarks: string[];           // ['서현역 로데오거리', '야탑역 먹자골목', '판교테크노밸리']
  nearbyStations: string[];      // ['서현역', '야탑역', '미금역', '판교역']

  // SEO
  seo: {
    titleSuffix: string;         // 서우실장
    mainKeywords: string[];      // ['분당 가라오케', '분당 하이퍼블릭', ...]
    description: string;         // 메인 설명
  };

  // 가격 정보
  pricing: {
    minRoomCharge: number;       // 180000
    minTC: number;               // 100000
    currency: string;            // KRW
  };

  // 영업시간
  businessHours: {
    open: string;                // 18:00
    close: string;               // 06:00
  };

  // 업소 타입 (지역마다 다를 수 있음)
  venueTypes: VenueType[];
}

export interface VenueType {
  id: string;                    // hyperpub, karaoke, shirtsroom, ...
  name: string;                  // 하이퍼블릭, 가라오케, ...
  slug: string;                  // {region}-hyperpub-guide
  subtitle: string;              // 프라이빗 / 시크릿
  description: string;           // 짧은 설명
  image: string;                 // /images/venues/hyperpublic_main.webp
  minPrice: number;              // 180000
  keywords: string[];            // ['분당 하이퍼블릭', ...]
}

// 예시: 분당 설정
export const region: RegionConfig = {
  id: 'bundang',
  name: '분당',
  nameEn: 'Bundang',
  domain: 'bundanghipublic.com',

  phone: '010-2626-4833',
  phoneFormatted: '010-2626-4833',
  kakaoId: '@pbsewoo',
  kakaoLink: 'http://qr.kakao.com/talk/jMlvTnRecn1PgP4S9gqME2itU7g-',
  telegramId: '@pbsewoo',
  telegramLink: 'https://t.me/pbsewoo',
  email: 'ymimi9512@gmail.com',

  address: {
    street: '서현역·야탑역 일대',
    city: '성남시',
    cityEn: 'Seongnam-si',
    region: '경기도',
    regionEn: 'Gyeonggi-do',
  },
  geo: {
    lat: 37.3827,
    lng: 127.1189,
  },

  landmarks: ['서현역 로데오거리', '야탑역 먹자골목', '판교테크노밸리'],
  nearbyStations: ['서현역', '야탑역', '미금역', '판교역'],

  seo: {
    titleSuffix: '서우실장',
    mainKeywords: [
      '분당 가라오케', '분당 하이퍼블릭', '분당 셔츠룸',
      '분당 호빠', '분당 기모노룸', '분당 룸살롱'
    ],
    description: '분당 가라오케·하이퍼블릭 메인 가이드. 서현역 로데오거리·야탑역 먹자골목 중심 상권에서 판교·서현 직장인 맞춤 코스를 안내합니다.',
  },

  pricing: {
    minRoomCharge: 180000,
    minTC: 100000,
    currency: 'KRW',
  },

  businessHours: {
    open: '18:00',
    close: '06:00',
  },

  venueTypes: [
    {
      id: 'hyperpub',
      name: '하이퍼블릭',
      slug: 'bundang-hyperpub-guide',
      subtitle: '프라이빗 / 시크릿',
      description: '서현역 로데오거리 중심 프라이빗 라운지',
      image: '/images/venues/hyperpublic_main.webp',
      minPrice: 180000,
      keywords: ['분당 하이퍼블릭', '서현역 하이퍼블릭'],
    },
    // ... 나머지 업소 타입
  ],
};
```

---

## 5. SEO 최적화 체크리스트

### 5.1 기술적 SEO

| 항목 | 구현 방법 | 우선순위 |
|------|-----------|----------|
| 정적 HTML 생성 | Astro SSG (기본) | 필수 |
| sitemap.xml 자동 생성 | `@astrojs/sitemap` | 필수 |
| robots.txt | `astro-robots-txt` 또는 정적 파일 | 필수 |
| canonical URL | 모든 페이지에 설정 | 필수 |
| Open Graph 태그 | 모든 페이지에 설정 | 필수 |
| Twitter Card | summary_large_image | 필수 |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1 | 높음 |
| 모바일 친화성 | 반응형 디자인 | 필수 |
| HTTPS | Vercel 기본 제공 | 필수 |
| 페이지 속도 | 이미지 최적화, JS 최소화 | 높음 |

### 5.2 온페이지 SEO

| 항목 | 구현 방법 | 체크 |
|------|-----------|------|
| title 태그 | 60자 이내, 키워드 포함 | ☐ |
| meta description | 160자 이내, CTA 포함 | ☐ |
| H1 태그 | 페이지당 1개, 키워드 포함 | ☐ |
| H2-H6 구조화 | 논리적 계층 구조 | ☐ |
| 이미지 alt 태그 | 모든 이미지에 키워드 포함 설명 | ☐ |
| 내부 링크 | 관련 페이지 상호 연결 | ☐ |
| 외부 링크 | nofollow 적절히 사용 | ☐ |
| URL 구조 | 키워드 포함, 짧고 명확 | ☐ |

### 5.3 Schema.org 구조화 데이터

| 스키마 타입 | 적용 페이지 | 구현 |
|-------------|-------------|------|
| LocalBusiness | 전체 | ☐ |
| Organization | 홈페이지 | ☐ |
| Service | 업소별 페이지 | ☐ |
| FAQPage | FAQ 페이지 | ☐ |
| BreadcrumbList | 전체 | ☐ |
| WebSite | 홈페이지 | ☐ |

### 5.4 콘텐츠 SEO

| 항목 | 권장사항 |
|------|----------|
| 키워드 밀도 | 1-3% |
| 콘텐츠 길이 | 최소 500자, 권장 1500자+ |
| 키워드 배치 | 첫 100자 내 주요 키워드 |
| LSI 키워드 | 관련 키워드 자연스럽게 포함 |
| 업데이트 빈도 | 월 1회 이상 콘텐츠 갱신 |

---

## 6. 컴포넌트 명세

### 6.1 SEO 컴포넌트

```astro
---
// src/components/common/SEO.astro
import { region } from '@/config/region';

interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string[];
  noindex?: boolean;
}

const {
  title,
  description,
  canonical = Astro.url.href,
  ogImage = `/og-home.jpg`,
  ogType = 'website',
  keywords = region.seo.mainKeywords,
  noindex = false,
} = Astro.props;

const fullTitle = `${title} | ${region.seo.titleSuffix}`;
const fullOgImage = `https://${region.domain}${ogImage}`;
---

<!-- Primary Meta Tags -->
<title>{fullTitle}</title>
<meta name="title" content={fullTitle} />
<meta name="description" content={description} />
<meta name="keywords" content={keywords.join(', ')} />
<meta name="author" content={region.seo.titleSuffix} />
<meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
<link rel="canonical" href={canonical} />

<!-- Open Graph -->
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={fullOgImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:site_name" content={`${region.name} ${region.seo.titleSuffix}`} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={fullOgImage} />
```

### 6.2 Schema 컴포넌트

```astro
---
// src/components/schema/LocalBusinessSchema.astro
import { region } from '@/config/region';

const schema = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": `${region.name} 하이퍼블릭·가라오케 ${region.seo.titleSuffix}`,
  "image": `https://${region.domain}/og-home.jpg`,
  "telephone": region.phone,
  "url": `https://${region.domain}/`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": region.address.street,
    "addressLocality": region.address.cityEn,
    "addressRegion": region.address.regionEn,
    "addressCountry": "KR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": region.geo.lat,
    "longitude": region.geo.lng
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": region.businessHours.open,
      "closes": "23:59"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": region.businessHours.close
    }
  ],
  "priceRange": "$$",
  "areaServed": region.nearbyStations.map(station => ({
    "@type": "Place",
    "name": station
  }))
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

## 7. 페이지별 SEO 설정

| 페이지 | title 패턴 | description 패턴 |
|--------|------------|------------------|
| 홈 | {지역} 가라오케·하이퍼블릭 예약 \| {랜드마크} {실장명} | {지역} 가라오케·하이퍼블릭 메인 가이드. {랜드마크} 중심 상권에서... |
| 하이퍼블릭 | {지역} 하이퍼블릭 가이드 \| 프리미엄 라운지 예약 | {지역} 하이퍼블릭 완벽 가이드. {랜드마크} 프라이빗 라운지... |
| 가라오케 | {지역} 가라오케 가이드 \| VIP룸 예약 안내 | {지역} 가라오케 정보. 노래방 스타일부터 풀서비스까지... |
| 셔츠룸 | {지역} 셔츠룸 가이드 \| 화이트셔츠 초이스 | {지역} 셔츠룸 완벽 가이드. 빠른 초이스와 편안한 분위기... |
| 기모노룸 | {지역} 기모노룸 가이드 \| 이색 테마 체험 | {지역} 기모노룸 안내. 일본식 테마 코스프레 서비스... |
| 룸살롱 | {지역} 룸살롱 가이드 \| 비즈니스 접대 | {지역} 룸살롱 정통 가이드. 격조 높은 비즈니스 접대... |
| 호빠 | {지역} 호빠 가이드 \| 여성전용 라운지 | {지역} 호빠 완벽 가이드. 프리미엄 여성전용 라운지... |
| 가격가이드 | {지역} 유흥 가격 가이드 \| 주대·TC 안내 | {지역} 가라오케·하이퍼블릭 가격 총정리. 주대 {최소가격}원 이상... |
| 초보가이드 | {지역} 유흥 초보 가이드 \| 처음 방문 안내 | {지역} 유흥 처음이신 분을 위한 완벽 가이드... |

---

## 8. Astro 설정

### 8.1 `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bundanghipublic.com', // 지역별 도메인으로 변경
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // 특정 페이지 priority 설정
      serialize(item) {
        if (item.url === '/') {
          item.priority = 1.0;
        }
        if (item.url.includes('-guide')) {
          item.priority = 0.9;
        }
        if (item.url.includes('/faq')) {
          item.priority = 0.7;
        }
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
```

### 8.2 `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/blog",
      "destination": "https://promotion-blog.vercel.app/{region}"
    },
    {
      "source": "/blog/:path*",
      "destination": "https://promotion-blog.vercel.app/{region}/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 9. 신규 지역 생성 가이드

### 9.1 사전 준비물

- [ ] 지역명 (한글/영문)
- [ ] 도메인
- [ ] 연락처 (전화, 카카오, 텔레그램)
- [ ] 주요 랜드마크/역 목록
- [ ] 좌표 (위도, 경도)
- [ ] OG 이미지 (1200x630)
- [ ] Favicon
- [ ] 업소별 대표 이미지

### 9.2 생성 단계

```bash
# 1. 템플릿 복사
cp -r apps/template-astro apps/{new-region}

# 2. 지역 설정 수정
# apps/{new-region}/src/config/region.ts 편집

# 3. 의존성 설치
cd apps/{new-region}
pnpm install

# 4. 개발 서버 실행
pnpm dev

# 5. 빌드 테스트
pnpm build

# 6. 배포
vercel --prod
```

### 9.3 체크리스트

- [ ] `region.ts` 모든 필드 작성
- [ ] 모든 페이지 title/description 확인
- [ ] OG 이미지 교체
- [ ] Favicon 교체
- [ ] 업소 이미지 교체
- [ ] 갤러리 이미지 교체
- [ ] sitemap.xml 생성 확인
- [ ] robots.txt 확인
- [ ] Schema.org 테스트 (Google Rich Results Test)
- [ ] PageSpeed Insights 점수 확인 (목표: 90+)
- [ ] 모바일 반응형 확인
- [ ] 블로그 연동 확인

---

## 10. 성능 목표

| 지표 | 목표 | 측정 도구 |
|------|------|-----------|
| Lighthouse Performance | 90+ | Chrome DevTools |
| Lighthouse SEO | 100 | Chrome DevTools |
| LCP | < 2.5s | PageSpeed Insights |
| FID | < 100ms | PageSpeed Insights |
| CLS | < 0.1 | PageSpeed Insights |
| TTI | < 3.8s | PageSpeed Insights |

---

## 11. 블로그 연동

기존 Astro 블로그 시스템 (`packages/blog`)과 연동:

1. `vercel.json`의 rewrite 규칙으로 `/blog` 경로 연결
2. `packages/blog/src/lib/regions.ts`에 새 지역 추가
3. `packages/blog/src/components/PostFooterCTA.astro`에 연락처 추가
4. `packages/blog/src/components/LocalBusinessSchema.astro`에 위치 정보 추가

---

## 12. 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-22 | 초기 PRD 작성 |

---

## 부록: React → Astro 마이그레이션 참고

기존 React 컴포넌트를 Astro로 변환 시 참고:

| React | Astro |
|-------|-------|
| `useState`, `useEffect` | Island Architecture (필요시만) |
| React Helmet | Astro `<head>` 직접 작성 |
| React Router | 파일 기반 라우팅 (`src/pages/`) |
| CSS-in-JS | Tailwind 또는 `<style>` 태그 |
| JSX 조건부 렌더링 | Astro 템플릿 문법 |

```astro
---
// Astro 컴포넌트 기본 구조
import { region } from '@/config/region';

const { title } = Astro.props;
const isHome = Astro.url.pathname === '/';
---

<div class="container">
  {isHome && <h1>{region.name}</h1>}
  <p>{title}</p>
</div>

<style>
  .container {
    @apply max-w-6xl mx-auto px-4;
  }
</style>
```
