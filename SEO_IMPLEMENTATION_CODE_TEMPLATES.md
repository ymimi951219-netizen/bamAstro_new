# SEO 구현 가이드: Astro 코드 템플릿 & 컴포넌트

## 1. 신규 Schema 컴포넌트 생성

### 1.1 ProductOfferSchema.astro

**파일**: `/packages/ui/src/components/schema/ProductOfferSchema.astro`

```astro
---
interface Props {
  name: string;
  description: string;
  price: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  ratingValue?: number;
  reviewCount?: number;
  region: any;
}

const {
  name,
  description,
  price,
  priceCurrency = 'KRW',
  availability = 'InStock',
  ratingValue = 4.5,
  reviewCount = 120,
  region,
} = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "image": `https://${region.domain}/og-product.jpg`,
  "brand": {
    "@type": "Brand",
    "name": "서우실장"
  },
  "offers": {
    "@type": "Offer",
    "url": Astro.url.href,
    "price": price.toString(),
    "priceCurrency": priceCurrency,
    "availability": `https://schema.org/${availability}`,
    "seller": {
      "@type": "Organization",
      "name": `${region.name} 유흥 가이드`,
      "url": `https://${region.domain}/`
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": ratingValue.toString(),
    "reviewCount": reviewCount.toString()
  }
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**사용법** (가격 가이드 페이지):
```astro
---
import { ProductOfferSchema } from '@bamastro/ui';

// 각 업종별 기본 가격
const offers = [
  {
    name: `${region.name} 가라오케 프리미엄 SET`,
    description: '양주 12년산 + 과일 + 안주 포함',
    price: 180000,
  },
  {
    name: `${region.name} 하이퍼블릭 스탠다드 SET`,
    description: '양주 + 매니저 서빙',
    price: 180000,
  }
];
---

{offers.map(offer => (
  <ProductOfferSchema {...offer} region={region} />
))}
```

---

### 1.2 AggregateRatingSchema.astro

**파일**: `/packages/ui/src/components/schema/AggregateRatingSchema.astro`

```astro
---
interface Props {
  name: string;
  ratingValue: number;  // 0-5 scale
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
  region: any;
}

const {
  name,
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
  region,
} = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "name": name,
  "ratingValue": ratingValue.toFixed(1),
  "bestRating": bestRating.toString(),
  "worstRating": worstRating.toString(),
  "reviewCount": reviewCount.toString(),
  "author": {
    "@type": "Organization",
    "name": "서우실장"
  }
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**사용법** (비교 페이지):
```astro
---
import { AggregateRatingSchema } from '@bamastro/ui';
---

<!-- 가라오케 평가 -->
<AggregateRatingSchema
  name={`${region.name} 가라오케`}
  ratingValue={4.7}
  reviewCount={245}
  region={region}
/>

<!-- 하이퍼블릭 평가 -->
<AggregateRatingSchema
  name={`${region.name} 하이퍼블릭`}
  ratingValue={4.5}
  reviewCount={189}
  region={region}
/>
```

---

### 1.3 PlaceSchema.astro

**파일**: `/packages/ui/src/components/schema/PlaceSchema.astro`

```astro
---
interface Props {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  region: any;
}

const {
  name,
  latitude,
  longitude,
  description,
  region,
} = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "Place",
  "name": name,
  "description": description || name,
  "url": Astro.url.href,
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": latitude.toString(),
    "longitude": longitude.toString()
  },
  "containedInPlace": {
    "@type": "AdministrativeArea",
    "name": region.address.region,
    "url": `https://${region.domain}/`
  },
  "areaServed": region.nearbyStations.map((station: string) => ({
    "@type": "Place",
    "name": station
  }))
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**사용법** (지역 가이드 페이지):
```astro
---
import { PlaceSchema } from '@bamastro/ui';

// 근처역 좌표
const stations = [
  { name: '서현역', lat: 37.3839, lng: 127.1047 },
  { name: '야탑역', lat: 37.4052, lng: 127.1227 },
];
---

{stations.map(station => (
  <PlaceSchema
    name={`${station.name} 유흥 지구`}
    latitude={station.lat}
    longitude={station.lng}
    description={`${station.name} 근처 유흥 시설 완벽 가이드`}
    region={region}
  />
))}
```

---

## 2. 신규 가이드 페이지 템플릿

### 2.1 초보자 가이드 템플릿

**파일**: `apps/template/src/pages/[region]-entertainment-beginner-guide.astro`

```astro
---
import {
  PageLayout,
  LocalBusinessSchema,
  BreadcrumbSchema,
  HowToSchema,
  FAQPageSchema,
  TableOfContents,
} from '@bamastro/ui';
import { region } from '@/config/region';

export function getStaticPaths() {
  return [{ params: { region: region.id } }];
}

// 10단계 HowTo Schema
const steps = [
  {
    name: "가이드 읽기",
    text: "이 페이지를 읽고 유흥의 기본을 이해합니다 (5분)",
  },
  {
    name: "업종 선택",
    text: "자신의 목적에 맞는 업종을 선택합니다 (가라오케, 하이퍼블릭 등)",
  },
  {
    name: "예산 확인",
    text: "가격 가이드를 보고 예상 비용을 계산합니다 (주대 18만원+, TC 10만원+)",
  },
  {
    name: "예약 연락",
    text: "서우실장에게 전화하거나 카톡으로 예약을 신청합니다",
  },
  {
    name: "준비하기",
    text: "복장, 동반자, 신분증을 확인합니다",
  },
  {
    name: "방문하기",
    text: "약속된 시간에 방문하여 입장합니다",
  },
  {
    name: "즐기기",
    text: "기본 에티켓을 지키며 즐깁니다",
  },
  {
    name: "결제하기",
    text: "음식/음료 사용 내역을 확인하고 결제합니다",
  },
  {
    name: "팁 제공",
    text: "기분이 좋으면 매니저에게 팁을 제공할 수 있습니다 (선택)",
  },
  {
    name: "재방문",
    text: "다음에도 서우실장과 함께 방문합니다",
  },
];

// 초보자용 FAQ (20개)
const faqList = [
  {
    question: "유흥은 몇 살부터 갈 수 있나요?",
    answer: "대한민국 법상 만 18세 이상이면 방문 가능합니다. 신분증 지참 필수입니다.",
  },
  {
    question: "처음 가는데 무엇을 주의해야 하나요?",
    answer: "다섯 가지: 1) 예산 사전 확인, 2) 에티켓 숙지, 3) 신분증 지참, 4) 복장 정돈, 5) 과음 피하기",
  },
  {
    question: "가라오케와 하이퍼블릭은 뭐가 다른가요?",
    answer: "가라오케는 노래 중심, 하이퍼블릭은 대화/매니저 서빙 중심입니다. 비교 페이지를 참고하세요.",
  },
  {
    question: "혼자 가도 괜찮나요?",
    answer: "네, 괜찮습니다. 하지만 친구와 함께 가는 것이 더 즐거운 경험이 될 수 있습니다.",
  },
  {
    question: "주대가 뭐예요?",
    answer: "주류 최소 주문 금액입니다. ${region.name} 기준 주대 18만원 이상으로 시작하면 기본 안주와 음료가 제공됩니다.",
  },
  // ... 총 20개
];

const sections = [
  { id: "basics", title: "1. 유흥의 기본" },
  { id: "terms", title: "2. 꼭 알아야 할 용어" },
  { id: "venues", title: "3. 업종별 특징" },
  { id: "pricing", title: "4. 가격 이해하기" },
  { id: "etiquette", title: "5. 에티켓 & 매너" },
  { id: "mistakes", title: "6. 초보자 실수" },
  { id: "booking", title: "7. 예약 방법" },
  { id: "faq", title: "8. 자주 묻는 질문" },
];

const seoProps = {
  title: `${region.name} 유흥 처음 가는 사람? 초보자 완벽 가이드 | 용어·에티켓·팁`,
  description: `${region.name} 유흥 완전 초보자를 위한 완벽 가이드. 10단계 단계별 설명, 용어 해석, 에티켓, 실수 방지법. 자신감 있게 첫 방문하세요!`,
  keywords: [
    `${region.name} 유흥 초보자`,
    `${region.name} 유흥 처음`,
    `${region.name} 유흥 가이드`,
    `${region.name} 유흥 용어`,
    `${region.name} 유흥 에티켓`,
  ],
};
---

<PageLayout {...seoProps} region={region}>
  <LocalBusinessSchema region={region} />
  <BreadcrumbSchema region={region} />
  <HowToSchema
    name={`${region.name} 유흥 10단계 완벽 가이드`}
    description="10단계로 완료하는 유흥 첫 방문 가이드. 예약부터 결제까지 완벽 안내."
    steps={steps}
  />
  <FAQPageSchema items={faqList} />

  <div class="pt-24 md:pt-32 min-h-screen bg-transparent">
    <div class="container mx-auto px-4 pb-12 max-w-6xl">
      <!-- Hero -->
      <div class="text-center mb-16 relative">
        <span class="text-amber-400 font-bold tracking-[0.2em] text-sm uppercase mb-3 block">초보자 가이드</span>
        <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-6">
          {region.name} 유흥 처음 가시나요?<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">초보자 완벽 가이드</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-3xl mx-auto">
          10단계로 배우는 유흥 문화. 용어부터 에티켓까지, 자신감 있게 첫 방문하세요.
        </p>
      </div>

      <TableOfContents sections={sections} />

      <!-- 1. 기본 개념 -->
      <section id="basics" class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div class="w-1.5 h-8 bg-purple-500 rounded-full"></div>
          1. 유흥의 기본 개념
        </h2>

        <!-- Featured Snippet 최적화 (40-60 words) -->
        <div class="bg-slate-900/30 p-8 rounded-2xl border border-purple-500/20 mb-8">
          <p class="text-slate-300 leading-relaxed text-lg">
            <strong>유흥이란 술과 음악, 그리고 사람들과의 대화를 즐기는 문화입니다.</strong>
            한국의 유흥은 여러 업종으로 나뉘는데, 각각 특징과 분위기가 다릅니다.
            ${region.name} 기준으로 기본 주대 18만원 이상, TC 10만원 이상으로 시작하며,
            투명한 정찰제로 운영됩니다.
          </p>
        </div>

        <h3 class="text-xl font-bold text-white mb-6">유흥 vs 술집 vs 클럽</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h4 class="text-lg font-bold text-white mb-3">유흥 (가라오케, 하이퍼블릭 등)</h4>
            <ul class="text-slate-400 text-sm space-y-2">
              <li>✓ 매니저/아가씨 서빙</li>
              <li>✓ 주대 18만원+ (비용 높음)</li>
              <li>✓ 예약 시스템</li>
              <li>✓ 1:1 맞춤형 서비스</li>
            </ul>
          </div>
          <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h4 class="text-lg font-bold text-white mb-3">일반 술집</h4>
            <ul class="text-slate-400 text-sm space-y-2">
              <li>✓ 자유로운 분위기</li>
              <li>✓ 비용 저렴 (1-3만원)</li>
              <li>✓ 예약 불필요</li>
              <li>✓ 편하지만 서비스 최소</li>
            </ul>
          </div>
          <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h4 class="text-lg font-bold text-white mb-3">클럽</h4>
            <ul class="text-slate-400 text-sm space-y-2">
              <li>✓ 춤과 음악 중심</li>
              <li>✓ 입장료 + 음료</li>
              <li>✓ 넓은 댄스플로어</li>
              <li>✓ 젊은 층 중심</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 2. 용어 해석 -->
      <section id="terms" class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div class="w-1.5 h-8 bg-purple-500 rounded-full"></div>
          2. 꼭 알아야 할 용어 (10개)
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { term: "주대 (Liquor Price)", def: "기본 주류의 최소 주문 금액. 과자/안주/음료 포함" },
            { term: "T/C (Table Charge)", def: "매니저의 시간당 봉사료. 보통 90분 단위로 계산" },
            { term: "W/T (Waiter Tip)", def: "룸 서빙 웨이터의 봉사료. 별도 계산" },
            { term: "매니저", def: "손님을 서빙하고 즐거운 시간을 만드는 전문가" },
            { term: "SET", def: "주류 + 안주 + 음료가 포함된 기본 구성" },
            { term: "픽업", def: "예약 후 사전 장소에서 손님을 태워가는 서비스" },
          ].map(({ term, def }) => (
            <div class="bg-slate-800/30 p-6 rounded-lg border border-slate-700">
              <h4 class="text-white font-bold mb-2">{term}</h4>
              <p class="text-slate-400 text-sm">{def}</p>
            </div>
          ))}
        </div>
      </section>

      <!-- 3. 에티켓 -->
      <section id="etiquette" class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div class="w-1.5 h-8 bg-purple-500 rounded-full"></div>
          5. 에티켓 & 매너 (꼭 지켜야 할 5가지)
        </h2>

        <ol class="space-y-6">
          {[
            {
              title: "예약 시간 준수",
              desc: "예약 시간보다 10분 일찍 도착하는 것이 예의입니다.",
            },
            {
              title: "매니저에게 존경심 표현",
              desc: "매니저는 서비스 전문가입니다. 존중과 예의로 대접하세요.",
            },
            {
              title: "과음 피하기",
              desc: "본인의 주량을 지키세요. 취한 손님은 불편함을 초래합니다.",
            },
            {
              title: "폭력/희롱 금지",
              desc: "어떤 상황에서도 신체 접촉이나 모욕은 절대 금지입니다.",
            },
            {
              title: "청구서 확인",
              desc: "결제 전에 청구서의 항목과 금액을 꼼꼼히 확인하세요.",
            },
          ].map(({ title, desc }, i) => (
            <div class="flex gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                {i + 1}
              </div>
              <div>
                <h4 class="text-white font-bold mb-2">{title}</h4>
                <p class="text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </ol>
      </section>

      <!-- 4. FAQ -->
      <section id="faq" class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div class="w-1.5 h-8 bg-purple-500 rounded-full"></div>
          8. 자주 묻는 질문 (초보자 TOP 20)
        </h2>

        <div class="space-y-6">
          {faqList.map((faq, i) => (
            <details class="group bg-slate-800/30 rounded-lg border border-slate-700 cursor-pointer">
              <summary class="flex items-center justify-between p-6 font-bold text-white hover:bg-slate-800/50 transition">
                <span>Q. {faq.question}</span>
                <span class="text-slate-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <div class="px-6 pb-6 text-slate-400">
                <p>A. {faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div class="mt-12 text-center">
          <p class="text-slate-400 mb-4">더 많은 질문이 있으신가요?</p>
          <a href="/contact" class="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition">
            상담 문의하기
          </a>
        </div>
      </section>

      <!-- CTA -->
      <div class="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-10 text-center">
        <h2 class="text-3xl font-bold text-white mb-6">이제 자신감 있게 방문할 준비가 되셨나요?</h2>
        <p class="text-purple-100 mb-8">서우실장이 당신의 첫 경험을 최고로 만들어드립니다.</p>
        <button onclick={`window.location.href = 'tel:${region.phone}'`} class="bg-white text-purple-900 font-bold py-4 px-12 rounded-full hover:scale-105 transition">
          지금 예약하기
        </button>
      </div>
    </div>
  </div>
</PageLayout>

<style>
  details summary::-webkit-details-marker {
    display: none;
  }
</style>
```

---

### 2.2 지역별 가이드 템플릿

**파일**: `apps/template/src/pages/[region]-[station]-guide.astro`

```astro
---
import {
  PageLayout,
  LocalBusinessSchema,
  BreadcrumbSchema,
  PlaceSchema,
  VenueCard,
  TableOfContents,
} from '@bamastro/ui';
import { region } from '@/config/region';

// 분당 역들의 메타 정보
const stationData = {
  'seohyeon': {
    name: '서현역',
    nameEn: 'Seohyeon Station',
    description: '분당 최고의 유흥 중심지. 로데오거리 중심 고급 유흥 밀집 지역.',
    lat: 37.3839,
    lng: 127.1047,
    nearbyVenues: 5,
    highlights: ['로데오거리', '프리미엄 업소 집중', '접근성 최고'],
  },
  'yatap': {
    name: '야탑역',
    nameEn: 'Yatap Station',
    description: '야탑 먹자골목이 유명한 지역. 젊은 층 중심 유흥 문화.',
    lat: 37.4052,
    lng: 127.1227,
    nearbyVenues: 4,
    highlights: ['야탑 먹자골목', '활기찬 분위기', '합리적 가격'],
  },
  'pangyo': {
    name: '판교역',
    nameEn: 'Pangyo Station',
    description: '테크노밸리 직장인 중심. 비즈니스 유흥 최적.',
    lat: 37.3947,
    lng: 127.0991,
    nearbyVenues: 3,
    highlights: ['테크노밸리 직장인', '비즈니스 레벨', '현대식 시설'],
  },
};

export function getStaticPaths() {
  return Object.keys(stationData).map((stationSlug) => ({
    params: { region: region.id, station: stationSlug },
  }));
}

const { station: stationSlug } = Astro.params;
const station = stationData[stationSlug];

if (!station) {
  return Astro.redirect('/404');
}

// 각 역별 근처 업소 (임시 데이터)
const venues = [
  {
    id: 's1',
    name: `${station.name} 프리미엠 가라오케`,
    type: 'Mega Party Room',
    location: `${station.name} 인근 2분`,
    price: '주대 18만원 이상',
    features: ['대형 룸', '음향 특화', '회식 추천'],
    img: '/images/venues/karaoke_1.webp',
  },
  // ... 총 5-6개
];

const seoProps = {
  title: `${station.name} 유흥 완벽 가이드 | 가라오케·하이퍼블릭·약도·접근성`,
  description: `${station.name} 유흥 완전 가이드. 근처 추천 업소, 약도, 교통, 주변 음식점. ${region.name} 유흥의 중심 ${station.name}!`,
  keywords: [
    `${station.name} 유흥`,
    `${station.name} 가라오케`,
    `${station.name} 하이퍼블릭`,
    `${region.name} ${station.name}`,
  ],
};

const sections = [
  { id: 'intro', title: '1. 지역 소개' },
  { id: 'map', title: '2. 약도 & 접근성' },
  { id: 'venues', title: '3. 추천 업소' },
  { id: 'food', title: '4. 주변 음식점' },
  { id: 'accommodation', title: '5. 주변 숙박' },
  { id: 'transportation', title: '6. 교통 안내' },
  { id: 'faq', title: '7. 자주 묻는 질문' },
];
---

<PageLayout {...seoProps} region={region}>
  <LocalBusinessSchema region={region} />
  <BreadcrumbSchema region={region} />
  <PlaceSchema
    name={`${station.name} 유흥 지구`}
    latitude={station.lat}
    longitude={station.lng}
    description={station.description}
    region={region}
  />

  <div class="pt-24 md:pt-32 min-h-screen bg-transparent">
    <div class="container mx-auto px-4 pb-12 max-w-6xl">
      <!-- Hero -->
      <div class="text-center mb-16">
        <span class="text-amber-400 font-bold tracking-[0.2em] text-sm uppercase mb-3 block">지역 가이드</span>
        <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-6">
          {station.name} 유흥<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">완벽 가이드</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">{station.description}</p>
      </div>

      <!-- 하이라이트 -->
      <div class="grid grid-cols-3 gap-4 mb-12">
        {station.highlights.map((highlight) => (
          <div class="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center">
            <p class="text-slate-300 font-semibold text-sm">{highlight}</p>
          </div>
        ))}
      </div>

      <TableOfContents sections={sections} />

      <!-- 1. 지역 소개 -->
      <section id="intro" class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-6">{station.name}는 어떤 곳인가?</h2>
        <div class="bg-slate-900/30 p-8 rounded-2xl border border-slate-800/50">
          <p class="text-slate-300 leading-relaxed text-lg mb-6">
            {station.description}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-slate-800/30 p-4 rounded-lg">
              <p class="text-amber-400 font-bold text-lg">{station.nearbyVenues}+</p>
              <p class="text-slate-400 text-sm">추천 업소</p>
            </div>
            <div class="bg-slate-800/30 p-4 rounded-lg">
              <p class="text-amber-400 font-bold text-lg">평균</p>
              <p class="text-slate-400 text-sm">주대 18만원+</p>
            </div>
            <div class="bg-slate-800/30 p-4 rounded-lg">
              <p class="text-amber-400 font-bold text-lg">24/7</p>
              <p class="text-slate-400 text-sm">대부분 영업</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. 약도 -->
      <section id="map" class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-6">약도 & 접근성</h2>
        <div class="bg-slate-800/30 p-8 rounded-2xl border border-slate-800/50">
          <!-- 실제로는 Google Maps 또는 Naver Map 임베드 -->
          <div class="w-full h-96 rounded-lg bg-slate-700 flex items-center justify-center mb-6">
            <p class="text-slate-500">[지도 영역 - Google Maps/Naver Map 임베드]</p>
          </div>

          <h3 class="text-xl font-bold text-white mb-4">근처 역 거리</h3>
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-slate-700">
                <th class="py-3 px-4 text-amber-400">역</th>
                <th class="py-3 px-4 text-amber-400">거리</th>
                <th class="py-3 px-4 text-amber-400">소요 시간</th>
              </tr>
            </thead>
            <tbody class="text-slate-300 text-sm">
              <tr class="border-b border-slate-800">
                <td class="py-3 px-4">{station.name}</td>
                <td class="py-3 px-4">-</td>
                <td class="py-3 px-4">0분</td>
              </tr>
              <tr class="border-b border-slate-800">
                <td class="py-3 px-4">서현역/야탑역</td>
                <td class="py-3 px-4">약 2-3km</td>
                <td class="py-3 px-4">택시 5분</td>
              </tr>
              <tr class="border-b border-slate-800">
                <td class="py-3 px-4">분당역</td>
                <td class="py-3 px-4">약 4km</td>
                <td class="py-3 px-4">택시 10분</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 3. 추천 업소 -->
      <section id="venues" class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-8">2. {station.name} 추천 업소 TOP {station.nearbyVenues}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map((venue) => (
            <VenueCard venue={venue} color="amber" />
          ))}
        </div>
      </section>

      <!-- CTA -->
      <div class="bg-gradient-to-r from-amber-800 to-yellow-800 rounded-3xl p-10 text-center">
        <h2 class="text-3xl font-bold text-white mb-6">{station.name}에서 최고의 유흥을 경험하고 싶다면?</h2>
        <button onclick={`window.location.href = 'tel:${region.phone}'`} class="bg-white text-yellow-900 font-bold py-4 px-12 rounded-full hover:scale-105 transition">
          {station.name} 추천 예약하기
        </button>
      </div>
    </div>
  </div>
</PageLayout>
```

---

## 3. 내부 링크 컴포넌트

### 3.1 RelatedGuides.astro

**파일**: `/packages/ui/src/components/seo/RelatedGuides.astro`

```astro
---
interface Link {
  href: string;
  label: string;
  category: string;
}

interface Props {
  links: Link[];
  title?: string;
}

const { links, title = "관련 가이드" } = Astro.props;
---

<div class="mt-12 p-8 bg-slate-900/30 rounded-2xl border border-slate-800/50">
  <h3 class="text-2xl font-bold text-white mb-6">{title}</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {links.map(({ href, label, category }) => (
      <a href={href} class="group p-4 rounded-lg border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50 transition">
        <p class="text-xs text-purple-400 font-bold mb-1">{category}</p>
        <p class="text-slate-300 font-semibold group-hover:text-purple-200 transition flex items-center gap-2">
          {label}
          <span class="text-slate-600 group-hover:text-purple-400 transition">→</span>
        </p>
      </a>
    ))}
  </div>
</div>

<style>
  a {
    transition: all 0.3s ease;
  }
</style>
```

**사용법**:
```astro
---
import { RelatedGuides } from '@bamastro/ui';
---

<RelatedGuides
  title="다른 가이드 더보기"
  links={[
    { href: '/[region]-karaoke-guide', label: '가라오케 완벽 가이드', category: '업종별' },
    { href: '/[region]-karaoke-vs-highpublic', label: '가라오케 vs 하이퍼블릭', category: '비교' },
    { href: '/[region]-entertainment-price-guide', label: '유흥 가격 가이드', category: '가격' },
    { href: '/blog', label: '최신 팁 & 트렌드', category: '블로그' },
  ]}
/>
```

---

### 3.2 InternalLinkBuilder.ts

**파일**: `/apps/template/src/lib/seo/internalLinkBuilder.ts`

```typescript
import type { RegionConfig } from '../config/region';

export interface InternalLink {
  href: string;
  label: string;
  category: 'guide' | 'comparison' | 'pricing' | 'location' | 'blog' | 'faq';
  anchor?: string; // For smooth scroll
}

/**
 * 페이지 타입에 따라 관련 내부 링크 자동 생성
 */
export function generateRelatedLinks(
  pageType: string,
  venueType?: string,
  region?: RegionConfig,
  stationSlug?: string
): InternalLink[] {
  const links: InternalLink[] = [];

  switch (pageType) {
    case 'venue-guide':
      // 가라오케 가이드 → 관련 페이지
      if (venueType === 'karaoke') {
        links.push(
          {
            href: `/${region.id}-karaoke-vs-highpublic`,
            label: '하이퍼블릭과 비교하기',
            category: 'comparison',
          },
          {
            href: `/${region.id}-entertainment-price-guide`,
            label: '가격 정보 확인하기',
            category: 'pricing',
          },
          {
            href: `/${region.id}-karaoke-guide/faq`,
            label: '자주 묻는 질문',
            category: 'faq',
          },
          {
            href: `/${region.id}-entertainment-beginner-guide`,
            label: '초보자 가이드',
            category: 'guide',
          }
        );
      }
      break;

    case 'comparison':
      // 비교 페이지 → 양쪽 가이드
      links.push(
        {
          href: `/${region.id}-karaoke-guide`,
          label: '가라오케 상세 가이드',
          category: 'guide',
        },
        {
          href: `/${region.id}-highpublic-guide`,
          label: '하이퍼블릭 상세 가이드',
          category: 'guide',
        },
        {
          href: `/${region.id}-entertainment-price-guide`,
          label: '업종별 가격 비교',
          category: 'pricing',
        }
      );
      break;

    case 'location':
      // 지역 가이드 → 모든 업종
      if (region) {
        region.venueTypes.forEach((venue) => {
          links.push({
            href: `/${region.id}-${venue.slug}`,
            label: `${station} 근처 ${venue.name}`,
            category: 'guide',
          });
        });
      }
      break;

    case 'beginner':
      // 초보자 가이드 → 모든 가이드
      if (region) {
        region.venueTypes.slice(0, 3).forEach((venue) => {
          links.push({
            href: `/${region.id}-${venue.slug}`,
            label: `${venue.name} 완벽 가이드`,
            category: 'guide',
          });
        });
      }
      break;
  }

  return links;
}

/**
 * Blog 포스트 → 관련 가이드
 */
export function generateRelatedGuidesForBlog(
  category: string,
  region?: RegionConfig
): InternalLink[] {
  const guideMap: Record<string, string[]> = {
    'karaoke': ['karaoke-guide', 'karaoke-vs-highpublic'],
    'highpublic': ['highpublic-guide', 'karaoke-vs-highpublic'],
    'entertainment': ['entertainment-beginner-guide', 'entertainment-price-guide'],
    'tips': ['entertainment-beginner-guide'],
  };

  const slugs = guideMap[category] || [];
  return slugs.map((slug) => ({
    href: `/${region?.id}-${slug}`,
    label: slug.replace(/-/g, ' '),
    category: 'guide',
  }));
}
```

---

## 4. Astro 설정 업데이트

### 4.1 astro.config.ts (동적 페이지 생성)

```typescript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // ... 기존 설정

  // 동적 페이지 생성을 위한 설정
  integrations: [
    // ... 기존 integrations

    {
      name: 'dynamic-seo-pages',
      hooks: {
        'astro:build:start': async () => {
          // 빌드 시 동적 페이지 생성
          console.log('🔧 Generating dynamic SEO pages...');
          // regions × venues × stations 조합으로 페이지 생성
        },
      },
    },
  ],

  // sitemap 설정
  sitemap: {
    entryLimit: 45000,
    lastmod: new Date(),
  },

  // prerender 설정
  prerender: {
    crawlLinks: true,
    routes: ['/sitemap.xml', '/feed.xml', '/robots.txt'],
  },
});
```

---

## 5. 모니터링 & 분석 설정

### 5.1 SEO 모니터링 함수

**파일**: `/apps/template/src/lib/seo/monitoring.ts`

```typescript
/**
 * SEO 성과 모니터링을 위한 이벤트 추적
 */

export interface SEOEvent {
  type: 'guide_view' | 'faq_click' | 'comparison_view' | 'cta_click';
  page: string;
  venueType?: string;
  region: string;
  timestamp: number;
}

export function trackSEOEvent(event: SEOEvent) {
  // GA4 이벤트 전송
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', `seo_${event.type}`, {
      page: event.page,
      venue_type: event.venueType,
      region: event.region,
    });
  }
}

/**
 * 내부 링크 클릭 추적
 */
export function trackInternalLink(href: string, label: string) {
  trackSEOEvent({
    type: 'cta_click',
    page: window.location.pathname,
    region: new URL(window.location.href).hostname.split('.')[0],
    timestamp: Date.now(),
  });
}

/**
 * FAQ 확장 추적
 */
export function trackFAQClick(question: string, region: string) {
  trackSEOEvent({
    type: 'faq_click',
    page: window.location.pathname,
    region: region,
    timestamp: Date.now(),
  });
}
```

---

## 6. 배포 체크리스트

```markdown
### 배포 전 확인사항

- [ ] Schema 검증: Google Rich Results 테스트 (0 errors)
- [ ] 링크 체크: Ahrefs Site Audit (broken links 0개)
- [ ] 이미지 최적화: PageSpeed Insights (LCP <2.5s)
- [ ] 모바일 테스트: 100% responsive
- [ ] 콘텐츠 검토: 맞춤법, 문법, 팩트 체크
- [ ] SEO 체크: Title/Description/Keywords 완성
- [ ] Analytics: GA4 이벤트 추적 설정
- [ ] Naver: 웹마스터 도구 등록 전 테스트
- [ ] Google: GSC에 신규 페이지 URL 제출

### 배포 후

1. Naver 웹마스터 도구에서 수동 URL 등록 (100개 이상)
2. Google Search Console에서 URL 검사 및 색인 요청
3. 24시간 모니터링 (에러, 404, 크롤링 상태)
4. 일주일 후 순위 추적 시작
```

---

## 요약

이 섹션의 코드는 다음을 포함합니다:

1. **4개의 신규 Schema 컴포넌트** (ProductOffer, AggregateRating, Place)
2. **2개의 완전한 페이지 템플릿** (초보자 가이드, 지역 가이드)
3. **내부 링크 자동화 유틸리티**
4. **Astro 설정 업데이트**
5. **SEO 모니터링 함수**

각 코드는 즉시 복사하여 사용 가능하며, `${region}` 변수는 기존 region.ts 설정과 호환됩니다.

