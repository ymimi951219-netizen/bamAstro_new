# 스키마 마크업 구현 코드 가이드

분당 유흥 정보 블로그 SEO 최적화를 위한 JSON-LD 스키마 마크업 구현 예제

---

## 1. BlogPosting Schema (모든 블로그/가이드 글)

### 위치
- `/blog/[slug].astro`
- `/guides/[category]/[slug].astro`

### 구현 예제

```astro
---
// /blog/[slug].astro
import { BlogPostSchema } from '@/lib/schemas';

const { slug } = Astro.params;
const post = await getBlogPostBySlug(slug as string);

const schema = new BlogPostSchema({
  title: post.title,
  excerpt: post.excerpt,
  image: post.featured_image,
  publishedDate: post.published_at,
  modifiedDate: post.updated_at,
  author: {
    name: '서우실장',
    url: 'https://bundanghipublic.com',
    logo: 'https://bundanghipublic.com/logo.png'
  },
  keywords: post.category,
  content: post.content
});
---

<html>
  <head>
    <Fragment set:html={schema.render()} />
  </head>
  <body>
    <!-- 페이지 콘텐츠 -->
  </body>
</html>
```

### 스키마 클래스 구현

```typescript
// src/lib/schemas.ts
export class BlogPostSchema {
  private data: any;

  constructor(config: {
    title: string;
    excerpt: string;
    image?: string;
    publishedDate: string;
    modifiedDate: string;
    author: {
      name: string;
      url: string;
      logo: string;
    };
    keywords: string;
    content: string;
  }) {
    this.data = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': config.title,
      'description': config.excerpt,
      'image': config.image || 'https://bundanghipublic.com/default-image.jpg',
      'datePublished': new Date(config.publishedDate).toISOString(),
      'dateModified': new Date(config.modifiedDate).toISOString(),
      'author': {
        '@type': 'Organization',
        'name': config.author.name,
        'url': config.author.url,
        'logo': {
          '@type': 'ImageObject',
          'url': config.author.logo,
          'width': 200,
          'height': 60
        }
      },
      'inLanguage': 'ko',
      'keywords': config.keywords,
      'wordCount': this.countWords(config.content),
      'articleBody': config.content.substring(0, 500) + '...'
    };
  }

  private countWords(text: string): number {
    return text.split(/\s+/).length;
  }

  render(): string {
    return `<script type="application/ld+json">${JSON.stringify(this.data, null, 2)}</script>`;
  }

  getJSON(): any {
    return this.data;
  }
}
```

### 출력 예

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "분당 가라오케 78곳 완벽 가이드",
  "description": "서현역·야탑역 중심 프리미엄 가라오케 78곳 정리",
  "image": "https://bundanghipublic.com/images/karaoke-guide.jpg",
  "datePublished": "2026-01-23T00:00:00.000Z",
  "dateModified": "2026-01-23T10:00:00.000Z",
  "author": {
    "@type": "Organization",
    "name": "서우실장",
    "url": "https://bundanghipublic.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bundanghipublic.com/logo.png",
      "width": 200,
      "height": 60
    }
  },
  "inLanguage": "ko",
  "keywords": "karaoke",
  "wordCount": 3245,
  "articleBody": "분당 가라오케 시장에서 가장 인기 있는 78곳을 소개합니다..."
}
```

---

## 2. BreadcrumbList Schema (모든 페이지)

### 위치
- 모든 `/blog` 페이지
- 모든 `/guides` 페이지

### 구현 예제

```astro
---
// src/components/BreadcrumbSchema.astro
import { BreadcrumbSchema } from '@/lib/schemas';

export interface Props {
  items: Array<{
    name: string;
    url: string;
  }>;
}

const { items } = Astro.props;

const schema = new BreadcrumbSchema(
  [
    { name: '홈', url: 'https://bundanghipublic.com' },
    ...items
  ]
);
---

<Fragment set:html={schema.render()} />
```

### 스키마 클래스 구현

```typescript
// src/lib/schemas.ts 추가
export class BreadcrumbSchema {
  private items: Array<{ name: string; url: string }>;

  constructor(items: Array<{ name: string; url: string }>) {
    this.items = items;
  }

  render(): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': this.items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    };

    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
  }
}
```

### 사용 예

```astro
---
// /guides/karaoke/best-places.astro

import BreadcrumbSchema from '@/components/BreadcrumbSchema.astro';

const breadcrumbItems = [
  { name: '가이드', url: 'https://bundanghipublic.com/guides' },
  { name: '가라오케', url: 'https://bundanghipublic.com/guides/karaoke' },
  { name: '가라오케 명소', url: Astro.url.href }
];
---

<BreadcrumbSchema items={breadcrumbItems} />
```

### 출력 예

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "홈",
      "item": "https://bundanghipublic.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "가이드",
      "item": "https://bundanghipublic.com/guides"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "가라오케",
      "item": "https://bundanghipublic.com/guides/karaoke"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "가라오케 명소",
      "item": "https://bundanghipublic.com/guides/karaoke/best-places"
    }
  ]
}
```

---

## 3. LocalBusiness Schema (카테고리 Pillar 페이지)

### 위치
- `/guides/karaoke`
- `/guides/hyperpublic`
- 기타 모든 카테고리 메인 페이지

### 구현 예제

```astro
---
// /guides/[category].astro

import { LocalBusinessSchema } from '@/lib/schemas';
import { region } from '@/config/region';

const { category } = Astro.params;
const categoryData = region.venueTypes.find(v => v.id === category);

const schema = new LocalBusinessSchema({
  name: `분당 ${categoryData.name} 가이드`,
  description: categoryData.description,
  url: `https://bundanghipublic.com/guides/${category}`,
  image: categoryData.image,
  address: region.address,
  geo: region.geo,
  phone: region.phone,
  priceRange: `₩${region.pricing.minTC.toLocaleString('ko-KR')} - ₩${(region.pricing.minTC * 3).toLocaleString('ko-KR')}`
});
---

<Fragment set:html={schema.render()} />
```

### 스키마 클래스 구현

```typescript
// src/lib/schemas.ts 추가
export class LocalBusinessSchema {
  private data: any;

  constructor(config: {
    name: string;
    description: string;
    url: string;
    image: string;
    address: {
      street: string;
      city: string;
      region: string;
    };
    geo: {
      lat: number;
      lng: number;
    };
    phone: string;
    priceRange: string;
  }) {
    this.data = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': config.name,
      'description': config.description,
      'url': config.url,
      'image': config.image,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': config.address.street,
        'addressLocality': config.address.city,
        'addressRegion': config.address.region,
        'addressCountry': 'KR'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': config.geo.lat,
        'longitude': config.geo.lng
      },
      'telephone': config.phone,
      'priceRange': config.priceRange,
      'areaServed': {
        '@type': 'City',
        'name': config.address.city
      },
      'inLanguage': 'ko'
    };
  }

  render(): string {
    return `<script type="application/ld+json">${JSON.stringify(this.data, null, 2)}</script>`;
  }
}
```

### 출력 예

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "분당 가라오케 가이드",
  "description": "최신 음향 시설과 럭셔리 룸에서 즐기는 파티",
  "url": "https://bundanghipublic.com/guides/karaoke",
  "image": "/images/venues/karaoke_main.webp",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "서현역·야탑역 일대",
    "addressLocality": "성남시",
    "addressRegion": "경기도",
    "addressCountry": "KR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.3827,
    "longitude": 127.1189
  },
  "telephone": "+82-10-2626-4833",
  "priceRange": "₩100,000 - ₩300,000",
  "areaServed": {
    "@type": "City",
    "name": "성남시"
  },
  "inLanguage": "ko"
}
```

---

## 4. FAQPage Schema (FAQ 섹션 포함 페이지)

### 위치
- Pillar 페이지 (각 카테고리 메인)
- 가이드 페이지

### Astro 컴포넌트

```astro
---
// src/components/FAQSchema.astro
import { FAQSchema } from '@/lib/schemas';

export interface Props {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const { faqs } = Astro.props;
const schema = new FAQSchema(faqs);
---

<Fragment set:html={schema.render()} />
```

### 스키마 클래스 구현

```typescript
// src/lib/schemas.ts 추가
export class FAQSchema {
  private faqs: Array<{ question: string; answer: string }>;

  constructor(faqs: Array<{ question: string; answer: string }>) {
    this.faqs = faqs;
  }

  render(): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': this.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
  }
}
```

### 사용 예

```astro
---
// /guides/karaoke.astro

import FAQSchema from '@/components/FAQSchema.astro';

const faqs = [
  {
    question: "분당 가라오케의 평균 가격은?",
    answer: "분당 가라오케의 평균 룸료는 180,000원부터 250,000원 사이입니다. 시간대와 요일에 따라 변동될 수 있습니다."
  },
  {
    question: "예약 없이 방문 가능한가?",
    answer: "대부분의 프리미엄 가라오케는 예약 필수입니다. 토요일이나 공휴일은 미리 2-3일 전에 예약하시기 바랍니다."
  },
  {
    question: "첫 방문할 때 주의할 점은?",
    answer: "예약은 필수이며, 최소 2시간 이상 이용해야 합니다. 복장은 자유이지만 너무 캐주얼하지 않은 것이 좋습니다."
  }
];
---

<FAQSchema faqs={faqs} />
```

### 출력 예

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "분당 가라오케의 평균 가격은?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "분당 가라오케의 평균 룸료는 180,000원부터 250,000원 사이입니다."
      }
    },
    {
      "@type": "Question",
      "name": "예약 없이 방문 가능한가?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "대부분의 프리미엄 가라오케는 예약 필수입니다."
      }
    }
  ]
}
```

---

## 5. HowTo Schema (가이드/팁 페이지)

### 위치
- `/guides/{category}/{topic}` (초보자 팁, 예약 팁 등)
- `/blog/{how-to-article}` 글

### Astro 컴포넌트

```astro
---
// src/components/HowToSchema.astro
import { HowToSchema } from '@/lib/schemas';

export interface Props {
  name: string;
  description: string;
  image: string;
  steps: Array<{
    position: number;
    name: string;
    description: string;
    image?: string;
  }>;
}

const { name, description, image, steps } = Astro.props;
const schema = new HowToSchema({ name, description, image, steps });
---

<Fragment set:html={schema.render()} />
```

### 스키마 클래스 구현

```typescript
// src/lib/schemas.ts 추가
export class HowToSchema {
  private data: any;

  constructor(config: {
    name: string;
    description: string;
    image: string;
    steps: Array<{
      position: number;
      name: string;
      description: string;
      image?: string;
    }>;
  }) {
    this.data = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': config.name,
      'description': config.description,
      'image': config.image,
      'step': config.steps.map(step => {
        const stepData: any = {
          '@type': 'HowToStep',
          'position': step.position,
          'name': step.name,
          'text': step.description
        };

        if (step.image) {
          stepData.image = step.image;
        }

        return stepData;
      }),
      'totalTime': 'PT15M',
      'inLanguage': 'ko'
    };
  }

  render(): string {
    return `<script type="application/ld+json">${JSON.stringify(this.data, null, 2)}</script>`;
  }
}
```

### 사용 예

```astro
---
// /guides/karaoke/first-timer-tips.astro

import HowToSchema from '@/components/HowToSchema.astro';

const steps = [
  {
    position: 1,
    name: "예약하기",
    description: "인스타그램이나 전화로 미리 예약합니다. 토요일은 3일 전 예약 권장.",
    image: "https://bundanghipublic.com/images/step1-booking.jpg"
  },
  {
    position: 2,
    name: "입장하기",
    description: "미리 약속한 시간에 도착하여 예약명을 말합니다.",
    image: "https://bundanghipublic.com/images/step2-entrance.jpg"
  },
  {
    position: 3,
    name: "메뉴 선택하기",
    description: "음료와 안주 메뉴를 선택합니다. 점원이 도움을 줍니다.",
    image: "https://bundanghipublic.com/images/step3-menu.jpg"
  },
  {
    position: 4,
    name: "즐기기",
    description: "편안하게 시간을 보냅니다. 분위기를 해치지 않도록 주의하세요.",
    image: "https://bundanghipublic.com/images/step4-enjoy.jpg"
  },
  {
    position: 5,
    name: "결제하기",
    description: "시간이 끝나면 결제하고 퇴장합니다.",
    image: "https://bundanghipublic.com/images/step5-payment.jpg"
  }
];
---

<HowToSchema
  name="분당 가라오케 첫 방문 완벽 가이드"
  description="가라오케 초보자를 위한 단계별 이용 안내"
  image="https://bundanghipublic.com/images/karaoke-howto.jpg"
  steps={steps}
/>
```

### 출력 예

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "분당 가라오케 첫 방문 완벽 가이드",
  "description": "가라오케 초보자를 위한 단계별 이용 안내",
  "image": "https://bundanghipublic.com/images/karaoke-howto.jpg",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "예약하기",
      "text": "인스타그램이나 전화로 미리 예약합니다.",
      "image": "https://bundanghipublic.com/images/step1-booking.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "입장하기",
      "text": "미리 약속한 시간에 도착하여 예약명을 말합니다."
    }
  ],
  "totalTime": "PT15M",
  "inLanguage": "ko"
}
```

---

## 6. 레이아웃 통합 예제

### 모든 스키마를 통합하는 기본 레이아웃

```astro
---
// src/layouts/BlogLayout.astro

import { BlogPostSchema, BreadcrumbSchema } from '@/lib/schemas';
import BreadcrumbSchema from '@/components/BreadcrumbSchema.astro';
import FAQSchema from '@/components/FAQSchema.astro';

export interface Props {
  title: string;
  description: string;
  image: string;
  publishedDate: string;
  modifiedDate: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  contentType: 'BlogPosting' | 'Article' | 'HowTo' | 'Guide';
}

const {
  title,
  description,
  image,
  publishedDate,
  modifiedDate,
  breadcrumbs,
  faqs,
  contentType
} = Astro.props;
---

<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title} | 분당 가라오케 가이드</title>

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="article" />

    <!-- Structured Data -->
    <BlogPostSchema
      title={title}
      description={description}
      image={image}
      publishedDate={publishedDate}
      modifiedDate={modifiedDate}
      author={{
        name: '서우실장',
        url: 'https://bundanghipublic.com',
        logo: 'https://bundanghipublic.com/logo.png'
      }}
      keywords="분당"
      content=""
    />

    <BreadcrumbSchema items={breadcrumbs} />

    {faqs && <FAQSchema faqs={faqs} />}
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## 7. 검증 도구

### Google Rich Results Test 확인 방법

```bash
# 1. 로컬 개발 서버에서 페이지 접속
http://localhost:3000/guides/karaoke

# 2. Google Rich Results Test에 URL 입력
https://search.google.com/test/rich-results

# 3. 검증 결과 확인
- "Errors" 없음
- "Warnings" 최소화
- "Passed tests" 확인
```

### 스키마 검증 자동화

```typescript
// src/lib/schema-validator.ts
import fetch from 'node-fetch';

export async function validateSchema(pageUrl: string): Promise<any> {
  const response = await fetch('https://search.google.com/test/rich-results/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: pageUrl
    })
  });

  return await response.json();
}
```

---

## 8. 스키마 마크업 체크리스트

### Phase 1: 필수 스키마 (즉시)

- [ ] BlogPosting Schema (모든 글)
- [ ] BreadcrumbList Schema (모든 페이지)
- [ ] LocalBusiness Schema (카테고리 메인)

### Phase 2: 권장 스키마 (1개월)

- [ ] FAQPage Schema (FAQ 포함 페이지)
- [ ] HowTo Schema (가이드/팁)
- [ ] Review Schema (리뷰 글)

### Phase 3: 고급 스키마 (3개월+)

- [ ] VideoObject Schema (비디오 가이드)
- [ ] NewsArticle Schema (뉴스 글)
- [ ] Event Schema (이벤트/팝업)

---

## 9. 최적화 팁

### 이미지 최적화

```typescript
export function optimizeSchemaImage(url: string, width = 1200, height = 630): string {
  // 이미지 URL에 크기 파라미터 추가
  return `${url}?w=${width}&h=${height}&format=webp`;
}
```

### 텍스트 길이 최적화

```typescript
export function truncateForSchema(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
```

### 날짜 형식

```typescript
export function formatDateForSchema(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString(); // ISO 8601 형식
}
```

---

**구현 완료 체크리스트**

```
[ ] BlogPostSchema 클래스 생성
[ ] BreadcrumbSchema 컴포넌트 생성
[ ] LocalBusinessSchema 클래스 생성
[ ] FAQSchema 컴포넌트 생성
[ ] HowToSchema 컴포넌트 생성
[ ] 모든 Astro 파일에 스키마 추가
[ ] Google Rich Results Test로 검증
[ ] Search Console에 사이트맵 제출
[ ] 1주일 후 검색 결과 모니터링
```
