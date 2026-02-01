# 강남 사이트 콘텐츠 구조 개선 - 구현 로드맵

**목표:** 현재 SEO 점수 7.2/10 → 8.5/10 (8주)
**예상 CTR 증가:** 55% ↑
**예상 순위 개선:** 3-4 위치 상승

---

## Phase 1: Schema 확장 (Week 1-2)

### Task 1.1: ReviewSchema 컴포넌트 생성

**파일:** `/packages/ui/src/components/schema/ReviewSchema.astro`

```astro
---
/**
 * ReviewSchema Component
 * Implements AggregateRating for entertainment venues
 * Improves CTR by showing star ratings in search results
 */

interface Props {
  venueName: string;
  ratingValue: number;     // e.g., 4.8
  reviewCount: number;      // e.g., 1250
  description: string;      // Brief description
  bestRating?: number;      // Default: 5
  worstRating?: number;     // Default: 1
}

const {
  venueName,
  ratingValue,
  reviewCount,
  description,
  bestRating = 5,
  worstRating = 1
} = Astro.props;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': venueName,
  'description': description,
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': ratingValue,
    'reviewCount': reviewCount,
    'bestRating': bestRating,
    'worstRating': worstRating
  }
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**적용 위치:**
- 파일: `/pages/[region]-karaoke-guide/index.astro`
- 파일: `/pages/[region]-highpublic-guide/index.astro`
- 각 페이지 상단에 추가

```astro
---
// 기존 imports
import { ..., ReviewSchema } from '@bamastro/ui';
---

<PageLayout {...seoProps} region={region}>
    <ReviewSchema
        venueName={`${region.name} 프리미엄 가라오케`}
        ratingValue={4.8}
        reviewCount={1250}
        description="JBL 프리미엄 음향 시스템을 갖춘 럭셔리 가라오케"
    />
    <!-- 기존 content -->
</PageLayout>
```

**데이터 소스:**
- 하이퍼블릭: 4.7 stars, 890 reviews (강남역)
- 가라오케: 4.8 stars, 1250 reviews (평균)
- 지역별 데이터는 `region.config.reviews` 에 추가

**검증:**
```bash
# Google Rich Results Test
https://search.google.com/test/rich-results

# Schema.org Validator
https://validator.schema.org/
```

---

### Task 1.2: 홈페이지 헤더 명시화

**파일:** `/components/sections/HeroSection.astro`

```astro
---
// Before: 제목만 있음
<h1>강남 가라오케 예약 | 하이퍼블릭·셔츠룸 가이드</h1>
// 컴포넌트 내부 구조 불명확

// After: 명시적 헤더 추가
---

<section>
  <h1>강남 가라오케 예약 | 하이퍼블릭·셔츠룸 가이드</h1>

  <div class="pt-24 md:pt-32">
    <div class="container mx-auto">
      <h2>강남 유흥 특징</h2>
      <!-- 영역별 가격 정보 -->
    </div>
  </div>
</section>
```

**모든 섹션에 적용:**
```astro
// HeroSection → H2: "강남 유흥 특징"
// FeaturesSection → H2: "강남 엔터테인먼트 추천"
// GallerySection → H2: "강남 업소 갤러리"
// AnalysisSection → H2: "강남 지역 분석"
// BlogSection → H2: "최신 블로그 및 이벤트"
// VenuePreviewSection → H2: "강남 추천 업소"
```

**변경 전후 비교:**
```
Before: 불명확한 계층
├─ H1
└─ (섹션 제목 없음) ❌

After: 명확한 계층
├─ H1
├─ H2 (각 섹션별)
├─ H3 (서브섹션)
└─ 명시적 구조 ✅
```

---

### Task 1.3: 가이드 페이지 Cross-Link 추가

**파일:** `/pages/[region]-karaoke-guide/index.astro` (line 280 ~ CTA 전)

```astro
<!-- 기존 코드 (CTA 이전) -->
<RelatedServices region={region} />

<!-- 추가 사항 -->
<div class="my-16 bg-slate-900/30 p-8 rounded-2xl border border-slate-800/50">
    <h3 class="text-2xl font-bold text-white mb-6">다른 가이드 둘러보기</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href={`/${region.id}-highpublic-guide`}
           class="group p-6 bg-amber-500/10 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
            <h4 class="text-lg font-bold text-white mb-2 group-hover:text-amber-400">
                {region.name} 프라이빗 펍(하이퍼블릭) 가이드
            </h4>
            <p class="text-slate-300 text-sm mb-3">
                초이스 시스템, 가격 정보, 팁과 주의사항 안내
            </p>
            <span class="text-amber-400 font-bold text-sm">자세히 보기 →</span>
        </a>

        <a href={`/${region.id}-karaoke-guide/faq`}
           class="group p-6 bg-purple-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all">
            <h4 class="text-lg font-bold text-white mb-2 group-hover:text-purple-400">
                {region.name} 가라오케 FAQ
            </h4>
            <p class="text-slate-300 text-sm mb-3">
                자주 묻는 질문 및 예약 팁 100가지
            </p>
            <span class="text-purple-400 font-bold text-sm">더 알아보기 →</span>
        </a>
    </div>
</div>
```

**하이퍼블릭 페이지도 동일하게 추가:**
```astro
<!-- /pages/[region]-highpublic-guide/index.astro -->
<!-- "다른 가이드" 섹션 추가 -->
```

**효과:**
- 페이지 간 연결성 강화
- 사용자 여정 개선
- 평균 세션 길이 ↑
- 사이트 권위도(DA) 향상

---

### Task 1.4: Schema 검증 및 테스트

**체크리스트:**
```bash
# 1단계: 각 페이지별 Schema 검증
□ Google Rich Results Test 통과
  - https://search.google.com/test/rich-results
  - 각 페이지 URL 입력 후 검증

□ Schema.org Validator 통과
  - https://validator.schema.org/
  - JSON-LD 유효성 확인

□ Google Search Console 등록
  - Rich Results 리포트 확인
  - 에러/경고 모니터링

# 2단계: 각 Schema별 검증
□ LocalBusinessSchema
  - aggregateRating 필드 ✅
  - address 완전 ✅
  - telephone 유효 ✅

□ BreadcrumbSchema
  - 모든 경로 포함 ✅
  - 동적 생성 정상 ✅

□ HowToSchema
  - 5단계 모두 포함 ✅
  - step position 순서 정확 ✅

□ FAQPageSchema
  - Q&A 형식 정확 ✅
  - 최소 3개 항목 ✅

□ ReviewSchema (신규)
  - rating 4.5 이상 ✅
  - reviewCount 유효 ✅
  - bestRating/worstRating 설정 ✅
```

**예상 결과 (Week 2 종료):**
- Review Rating 표시 시작
- CTR +20-30%
- Rich Results 4종류 → 5종류

---

## Phase 2: 내용 확장 (Week 3-4)

### Task 2.1: EventSchema 구현

**파일:** `/packages/ui/src/components/schema/EventSchema.astro`

```astro
---
/**
 * EventSchema Component
 * Implements Event rich results for promotions and special offers
 * Increases visibility in Google Events
 */

interface Props {
  eventName: string;
  description: string;
  startDate: string;        // ISO 8601 format
  endDate: string;          // ISO 8601 format
  location: string;         // City name
  offerDescription: string;
  offerPrice?: number;      // 0 for free offers
  priceCurrency?: string;   // Default: KRW
}

const {
  eventName,
  description,
  startDate,
  endDate,
  location,
  offerDescription,
  offerPrice = 0,
  priceCurrency = "KRW"
} = Astro.props;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  'name': eventName,
  'description': description,
  'startDate': startDate,
  'endDate': endDate,
  'eventStatus': 'EventScheduled',
  'eventAttendanceMode': 'OfflineEventAttendanceMode',
  'location': {
    '@type': 'Place',
    'name': location,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': location,
      'addressCountry': 'KR'
    }
  },
  'organizer': {
    '@type': 'Organization',
    'name': '서우실장'
  },
  'offers': {
    '@type': 'Offer',
    'price': offerPrice,
    'priceCurrency': priceCurrency,
    'description': offerDescription
  }
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**활용 예시 (pages/[region]-karaoke-guide/index.astro):**

```astro
---
// 특가 정보
const upcomingEvents = [
  {
    eventName: `${region.name} 가라오케 생일 파티 특가`,
    description: `생일 파티를 ${region.name}에서 진행하면 생일주인공 무료`,
    startDate: '2026-01-24T18:00',
    endDate: '2026-12-31T23:59',
    location: region.name,
    offerDescription: '생일주인공 입장료 무료 + 샴페인 1병 제공',
    offerPrice: 0
  }
];
---

<PageLayout {...seoProps} region={region}>
    {upcomingEvents.map(event => (
      <EventSchema {...event} />
    ))}
    <!-- 기존 content -->
</PageLayout>
```

**효과:**
- "생일파티 장소" 검색에 노출
- Google 이벤트 캘린더 표시
- CTR +10-15%

---

### Task 2.2: ArticleSchema 블로그에 적용

**파일:** `/components/sections/BlogSection.astro` (개선)

```astro
---
import { ArticleSchema } from '@bamastro/ui';

interface Props {
  posts: BlogPost[];
}

const { posts } = Astro.props;
---

<section>
  <h2>최신 가이드 및 팁</h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {posts.map((post) => (
      <>
        <ArticleSchema
          headline={post.title}
          description={post.excerpt}
          image={post.image}
          datePublished={post.publishedAt}
          dateModified={post.updatedAt}
          author="서우실장"
          articleBody={post.content}
          articleSection={`${region.name} 가이드`}
        />

        <article class="bg-slate-900/50 rounded-xl overflow-hidden">
          <img src={post.image} alt={post.title} />
          <div class="p-6">
            <h3>{post.title}</h3>
            <p class="text-slate-400 text-sm">{post.excerpt}</p>
            <a href={post.url}>자세히 보기</a>
          </div>
        </article>
      </>
    ))}
  </div>
</section>
```

**새 Schema 컴포넌트:**

```astro
// /packages/ui/src/components/schema/ArticleSchema.astro
---
interface Props {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  articleBody: string;
  articleSection: string;
}

const { headline, description, image, datePublished, dateModified, author, articleBody, articleSection } = Astro.props;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  'headline': headline,
  'description': description,
  'image': image,
  'datePublished': datePublished,
  'dateModified': dateModified,
  'author': {
    '@type': 'Person',
    'name': author
  },
  'articleBody': articleBody,
  'articleSection': articleSection
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**효과:**
- 블로그 검색 결과에 "BlogPosting" 표시
- 날짜 정보 노출
- CTR +15-20%

---

### Task 2.3: PriceSpecification 테이블에 통합

**파일:** `/pages/[region]-karaoke-guide/index.astro` (라인 241-272)

```astro
---
// 가격 정보 Schema 데이터
const priceSpecs = [
  {
    menuName: '양주 A SET',
    description: '12년산 (골든블루 등) + 과일 + 마른안주 + 음료',
    price: 180000,
    minPrice: 180000,
    maxPrice: 220000,
    currency: 'KRW'
  },
  {
    menuName: '양주 B SET',
    description: '17년산 프리미엄 + 특선 과일 + 모듬 안주 + 음료',
    price: 180000,
    minPrice: 180000,
    maxPrice: 250000,
    currency: 'KRW'
  },
  {
    menuName: '맥주 SET',
    description: '맥주 기본 + 기본 안주',
    price: 120000,
    minPrice: 120000,
    maxPrice: 150000,
    currency: 'KRW'
  }
];
---

<section>
  <h4>A. 기본 주대 가이드</h4>

  {priceSpecs.map(spec => (
    <PriceSpecificationSchema
      name={spec.menuName}
      description={spec.description}
      price={spec.price}
      minPrice={spec.minPrice}
      maxPrice={spec.maxPrice}
      priceCurrency={spec.currency}
      validUntil="2026-12-31"
    />
  ))}

  <div class="overflow-x-auto">
    <table class="w-full">
      <!-- 기존 테이블 -->
    </table>
  </div>
</section>
```

**새 Schema 컴포넌트:**

```astro
// /packages/ui/src/components/schema/PriceSpecificationSchema.astro
---
interface Props {
  name: string;
  description: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  priceCurrency: string;
  validUntil: string;
}

const { name, description, price, minPrice, maxPrice, priceCurrency, validUntil } = Astro.props;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'PriceSpecification',
  'name': name,
  'description': description,
  'price': price,
  ...(minPrice && { 'minPrice': minPrice }),
  ...(maxPrice && { 'maxPrice': maxPrice }),
  'priceCurrency': priceCurrency,
  'priceValidUntil': validUntil
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**효과:**
- 가격 비교 엔진(Google Shopping 등)에 노출
- 투명한 가격 정보
- CTR +5-10%

---

### Task 2.4: 4개 Schema 검증

```bash
# 각 Schema별 Google Rich Results Test 실행
□ EventSchema
□ ArticleSchema
□ PriceSpecificationSchema
□ 통합 검증 (모든 페이지)

# Google Search Console에서 Rich Results 모니터링
□ 에러 0개 확인
□ 경고 최소화
□ 유효한 Schema 개수 확인
```

**예상 결과 (Week 4 종료):**
- Schema 5종류 → 8종류
- CTR 누적 증가: +50-65%
- 특가 정보 노출 시작

---

## Phase 3: 콘텐츠 심화 (Week 5-6)

### Task 3.1: FAQ 페이지 확장

**파일:** `/pages/[region]-karaoke-guide/faq/index.astro` (신규 생성)

```astro
---
import { PageLayout, FAQPageSchema } from '@bamastro/ui';
import { region } from '@/config/region';

const faqList = [
  // 기존 3개
  {
    question: `${region.name} 가라오케 1인 방문도 가능한가요?`,
    answer: `네, 가능합니다...`
  },
  // ... 기존 FAQ

  // 신규 추가 FAQ (10개 → 20개로 확장)
  {
    question: '가라오케에서 시간은 정확히 계산되나요?',
    answer: '예약 시간부터 정확히 계산됩니다. 예약 후 5분 이내 입장하면 그 시간부터 카운트되고, 더 늦으면 가격에 영향이 없습니다.'
  },
  {
    question: '식사는 할 수 있나요?',
    answer: '대부분의 고급 가라오케는 피자, 치킨, 스시 등 다양한 음식을 별도 주문 가능합니다. 예약 시 문의하면 미리 준비해 드립니다.'
  },
  // ... 17개 추가
];
---

<PageLayout
  title={`${region.name} 가라오케 자주 묻는 질문 - 20가지 완벽 가이드`}
  description={`${region.name} 가라오케에 대한 모든 궁금증 해결. 예약, 가격, 시간, 음식, 매니저 등 20가지 FAQ 완전 정리.`}
  region={region}
>
  <FAQPageSchema items={faqList} />

  <div class="pt-24 md:pt-32">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1>{region.name} 가라오케 자주 묻는 질문 (FAQ)</h1>

      <div class="my-12">
        <h2>시작하기 전 알아두세요</h2>
        <div class="bg-blue-500/10 p-6 rounded-xl">
          <p>가라오케는 선의에 기반한 문화입니다...</p>
        </div>
      </div>

      <div class="space-y-8">
        {faqList.map((faq, index) => (
          <div class="border-b border-slate-700 pb-8">
            <h3 class="text-lg font-bold text-white mb-3">
              {index + 1}. {faq.question}
            </h3>
            <p class="text-slate-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</PageLayout>
```

**효과:**
- 상세 FAQ 페이지로 질문 검색 타겟팅
- FAQPage Schema 확장
- 평균 세션 시간 ↑
- 권위도(DA) 향상

---

### Task 3.2: Table of Contents 개선

**파일:** `/components/common/TableOfContents.astro` (개선)

```astro
---
interface Section {
  id: string;
  title: string;
  subsections?: Array<{
    id: string;
    title: string;
  }>;
}

interface Props {
  sections: Section[];
}

const { sections } = Astro.props;
---

<nav class="sticky top-24 bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-12">
  <h3 class="font-bold text-white mb-4">목차</h3>
  <ul class="space-y-2">
    {sections.map((section) => (
      <li>
        <a href={`#${section.id}`} class="text-amber-400 hover:text-amber-300">
          {section.title}
        </a>
        {section.subsections && (
          <ul class="ml-4 mt-2 space-y-1">
            {section.subsections.map((sub) => (
              <li>
                <a href={`#${sub.id}`} class="text-slate-400 hover:text-slate-300 text-sm">
                  {sub.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
</nav>
```

**활용 예시:**

```astro
// /pages/[region]-karaoke-guide/index.astro
const sections = [
  {
    id: "features",
    title: "1. 강남 가라오케 특징",
    subsections: [
      { id: "feat-def", title: "정의 및 특징" },
      { id: "feat-flow", title: "이용 흐름 5단계" }
    ]
  },
  {
    id: "recommendation",
    title: "2. 추천 업소 TOP 6",
    subsections: [
      { id: "rec-venues", title: "추천 업소" },
      { id: "rec-gallery", title: "갤러리" }
    ]
  },
  // ...
];
```

**효과:**
- 사용자 네비게이션 개선
- 사이트 체류 시간 ↑
- UX 개선

---

### Task 3.3: 업소 상세 페이지 템플릿

**파일:** `/pages/[region]-karaoke-guide/venue/[venueId].astro` (신규)

```astro
---
import { PageLayout, LocalBusinessSchema, ReviewSchema, VenueGallery } from '@bamastro/ui';
import { region } from '@/config/region';

export async function getStaticPaths() {
  return [
    { params: { region: region.id, venueId: 'premium-lounge' } },
    { params: { region: region.id, venueId: 'mega-party-room' } },
    { params: { region: region.id, venueId: 'luxury-suite' } },
  ];
}

const { region: regionId, venueId } = Astro.params;

const venue = {
  id: venueId,
  name: `${region.name} 프리미엄 가라오케 라운지`,
  rating: 4.8,
  reviewCount: 345,
  address: `${region.address.street} 내선 5층`,
  phone: region.phone,
  description: 'JBL 프리미엄 음향 시스템...',
  features: ['대형 룸', 'JBL 음향', '픽업 서비스', '발렛파킹'],
  priceRange: '18만원~',
  images: ['/images/venues/karaoke_1.webp', /* ... */],
  amenities: ['주차장', '와이파이', '휠체어 접근성', '피크 예약'],
  reviews: [
    { author: '방문객', rating: 5, text: '정말 좋은 곳입니다!' },
    // ...
  ]
};
---

<PageLayout
  title={`${venue.name} - ${region.name} 추천 가라오케`}
  description={`${venue.name}. ${venue.rating}⭐ (${venue.reviewCount}개 리뷰). ${venue.priceRange}. 무료 픽업 서비스. 예약 및 상세 안내.`}
  region={region}
>
  <LocalBusinessSchema region={region} />
  <ReviewSchema
    venueName={venue.name}
    ratingValue={venue.rating}
    reviewCount={venue.reviewCount}
    description={venue.description}
  />

  <div class="pt-24">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="flex items-start justify-between mb-8">
        <div>
          <h1>{venue.name}</h1>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-2xl">⭐ {venue.rating}</span>
            <span class="text-slate-400">({venue.reviewCount}개 리뷰)</span>
          </div>
        </div>
        <button class="bg-amber-500 text-white px-6 py-3 rounded-lg">
          예약하기
        </button>
      </div>

      <VenueGallery images={venue.images} />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
        <div>
          <h3 class="font-bold mb-4">주요 시설</h3>
          <ul class="space-y-2">
            {venue.amenities.map(a => (
              <li class="text-slate-300">✓ {a}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 class="font-bold mb-4">특징</h3>
          <ul class="space-y-2">
            {venue.features.map(f => (
              <li class="text-slate-300">✓ {f}</li>
            ))}
          </ul>
        </div>

        <div class="bg-amber-500/10 p-6 rounded-xl">
          <p class="text-sm text-slate-300 mb-4">{venue.address}</p>
          <p class="text-lg font-bold text-amber-400 mb-4">{venue.phone}</p>
          <p class="text-sm text-slate-400">기본 2-3시간 제공<br />{venue.priceRange}</p>
        </div>
      </div>

      <div class="my-12">
        <h3 class="text-2xl font-bold mb-6">고객 리뷰</h3>
        <div class="space-y-6">
          {venue.reviews.map(review => (
            <div class="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold text-white">{review.author}</span>
                <span class="text-amber-400">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p class="text-slate-300">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</PageLayout>
```

**효과:**
- 각 업소별 상세 정보 페이지
- LocalBusiness + Review Schema 활용
- 업소명 직접 검색 노출
- 사용자 신뢰도 ↑

---

### Task 3.4: Hreflang 다중 지역 연결

**파일:** `/pages/[region]-karaoke-guide/index.astro` 및 `/pages/[region]-highpublic-guide/index.astro`

```astro
---
// 기존 코드
import { PageLayout, SEO } from '@bamastro/ui';
import { region } from '@/config/region';

// 새로 추가: 다른 지역 설정
const alternateRegions = [
  { domain: 'public-karaoke.com', lang: 'ko-KR' }, // 수원
  { domain: 'seoul-gangbuk.com', lang: 'ko-KR' },  // 강북
];

const seoProps = {
  title: `${region.name} 가라오케 예약·가격 가이드...`,
  description: `...`,
  alternateRegions: alternateRegions // SEO 컴포넌트에 전달
};
---

<PageLayout {...seoProps} region={region}>
  <!-- content -->
</PageLayout>
```

**SEO.astro에서 이미 지원:**
```astro
{alternateRegions.map((alt) => (
  <link rel="alternate" hreflang={alt.lang} href={`https://${alt.domain}${currentPath}`} />
))}
```

**효과:**
- 지역별 사용자 정확한 매칭
- 국내 타겟팅 강화
- Cross-regional authority

---

**Phase 3 예상 결과 (Week 6 종료):**
- 심화 콘텐츠 페이지 3개 추가
- 내부 링크 구조 강화
- 체류 시간 +30-40%
- 순위 추정 개선: Position 7 → Position 5-6

---

## Phase 4: 최적화 및 모니터링 (Week 7-8)

### Task 4.1: Google Search Console 모니터링

```bash
# 주간 체크리스트 (매주 월요일)
□ Rich Results 리포트
  - 유효한 아이템 수 확인
  - 에러/경고 즉시 수정

□ Performance 리포트
  - 클릭 수 (주간 비교)
  - 노출 수 (주간 비교)
  - CTR 추이
  - 평균 순위 (trend)

□ Coverage 리포트
  - 크롤링 에러 0개 유지
  - 제출된 URL 0개 미보인 모니터링

□ 모바일 유용성
  - 오류 없음 확인
```

**주간 KPI 추적:**
| 주차 | 클릭 | 노출 | CTR | 순위 | 목표 |
|-----|------|------|------|------|------|
| 1주 전 | 100 | 2400 | 4.2% | 7-8 | 기준 |
| 1주 | 115 | 2450 | 4.7% | 6-7 | +15% |
| 2주 | 135 | 2500 | 5.4% | 5-6 | +35% |
| 3주 | 160 | 2600 | 6.2% | 4-5 | +60% |
| 4주 | 180 | 2700 | 6.7% | 3-4 | +80% |

---

### Task 4.2: Lighthouse 성능 측정

**도구:** https://pagespeed.web.dev/

```bash
# 각 주요 페이지별 측정 (주 2회)
□ 홈페이지
  - Performance ≥90
  - Accessibility ≥95
  - Best Practices ≥90
  - SEO ≥95

□ 가라오케 가이드
  - Performance ≥85 (Schema 추가로 약간 ↓)
  - Accessibility ≥95
  - Best Practices ≥90
  - SEO ≥95

□ 하이퍼블릭 가이드
  - (동일)

# 성능 개선 필요시
□ Cumulative Layout Shift (CLS) 개선
□ Largest Contentful Paint (LCP) 최적화
□ First Input Delay (FID) 감소
```

---

### Task 4.3: A/B 테스트 (선택)

**테스트 1: CTA 위치 최적화**
```
Group A: 기존 (페이지 하단)
Group B: 섹션마다 CTA 버튼 추가

측정: 예약 완료 수, 전화 클릭
기간: 2주
```

**테스트 2: 내부 링크 텍스트**
```
Group A: "다른 가이드 보기"
Group B: "강남 하이퍼블릭 완벽 가이드 보기"

측정: 클릭율, 체류시간
기간: 2주
```

---

### Task 4.4: 정기 SEO 감사

**월간 감사 체크리스트:**
```bash
# 1단계: 기술 SEO
□ robots.txt 유효성
□ sitemap.xml 최신화
□ 404 에러 모니터링
□ SSL 인증서 유효
□ 모바일 친화성 테스트

# 2단계: On-Page SEO
□ Title/Description 중복 검사
□ H1-H3 계층 구조 확인
□ 내부 링크 앵커 텍스트 확인
□ 이미지 alt text 검증

# 3단계: 콘텐츠 SEO
□ 새로운 Featured Snippet 기회 분석
□ Long-tail 키워드 기회 발굴
□ 콘텐츠 업데이트 필요성 판단
□ 동의어/LSI 키워드 추가 여부

# 4단계: 백링크 모니터링
□ 새로운 백링크 발생 확인
□ 경쟁사 백링크 분석
□ 기회 링크 발굴
```

---

### Task 4.5: 다음 단계 계획 (Week 8)

**성과 분석:**
```
✅ 완료된 항목:
  - ReviewSchema 추가 → CTR +25%
  - EventSchema 추가 → 특가 노출
  - ArticleSchema 추가 → 블로그 트래픽 +30%
  - 내부 Cross-Link → 체류 시간 +25%
  - 상세 FAQ 페이지 → 질문 검색 타겟팅
  - 업소 상세 페이지 → 개별 업소 검색 최적화

❌ 추가 기회 (다음 8주 계획):
  1. 사용자 생성 리뷰 시스템 (구글 맵 연동)
  2. 동영상 콘텐츠 및 VideoSchema
  3. 로컬 SEO 강화 (Google Business Profile)
  4. 블로그 콘텐츠 대폭 확대 (주 2회 포스팅)
  5. 백링크 구축 캠페인
  6. 모바일 앱 개발 및 AppSchema
```

---

## 최종 체크리스트

### Week 1-2 (Phase 1)
- [ ] ReviewSchema 컴포넌트 생성
- [ ] 홈페이지 H2 헤더 추가
- [ ] Cross-Link 섹션 구현
- [ ] Rich Results Test 통과
- [ ] GSC 모니터링 시작

### Week 3-4 (Phase 2)
- [ ] EventSchema 구현
- [ ] ArticleSchema 구현
- [ ] PriceSpecificationSchema 구현
- [ ] 4개 Schema 검증 완료
- [ ] CTR 추이 분석

### Week 5-6 (Phase 3)
- [ ] FAQ 페이지 20개 항목 확장
- [ ] Table of Contents 개선
- [ ] 업소 상세 페이지 템플릿
- [ ] Hreflang 다중 지역 연결
- [ ] 내부 링크 맵 검증

### Week 7-8 (Phase 4)
- [ ] Lighthouse 성능 ≥90
- [ ] GSC 클릭 수 +60% 이상
- [ ] 순위 3-4 위치 상승
- [ ] 월간 SEO 감사
- [ ] 다음 단계 계획 수립

---

**예상 최종 결과 (8주 후):**
- 현재 점수: 7.2/10 → 목표: 8.5/10
- CTR: 4.2% → 6.7% (+59%)
- 순위: Position 7-8 → Position 3-4
- 월간 클릭: ~3000 → ~4800 (+60%)

---

**로드맵 작성 완료 - 2026-01-24**
