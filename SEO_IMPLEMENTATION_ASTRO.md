# 판교 지역 SEO 구현 가이드 - Astro 버전

## 1. PageLayout 컴포넌트 구현

### 파일 위치: apps/pangyeo/src/layouts/PageLayout.astro

```astro
---
import { ViewTransitions } from 'astro:transitions';

export interface Props {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl: string;
  schema?: any;
  noindex?: boolean;
  region?: any;
}

const {
  title,
  description,
  keywords = [],
  ogTitle = title,
  ogDescription = description,
  ogImage = '/og-karaoke.jpg',
  canonicalUrl,
  schema,
  noindex = false,
  region,
} = Astro.props;

// 환경변수 또는 설정에서 도메인 정보 가져오기
const SITE_URL = region?.domain ? `https://${region.domain}` : 'https://new-karaoke.com';
const fullCanonicalUrl = canonicalUrl.startsWith('http') 
  ? canonicalUrl 
  : `${SITE_URL}${canonicalUrl}`;
const fullOgImage = ogImage.startsWith('http') 
  ? ogImage 
  : `${SITE_URL}${ogImage}`;
---

<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    
    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    {keywords.length > 0 && (
      <meta name="keywords" content={keywords.join(', ')} />
    )}
    <meta name="author" content="서우실장 (PB Sewoo)" />
    <meta name="language" content="Korean" />
    <meta name="revisit-after" content="7 days" />
    
    {/* 인덱싱 제어 */}
    {noindex ? (
      <meta name="robots" content="noindex, nofollow" />
    ) : (
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    )}
    
    <!-- Canonical URL -->
    <link rel="canonical" href={fullCanonicalUrl} />
    
    <!-- Alternate Links (다국어/모바일) -->
    <link rel="alternate" hreflang="ko-KR" href={fullCanonicalUrl} />
    
    {/* Open Graph Meta Tags (소셜 공유) */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={fullCanonicalUrl} />
    <meta property="og:title" content={ogTitle} />
    <meta property="og:description" content={ogDescription} />
    <meta property="og:image" content={fullOgImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="서우실장 판교 유흥 가이드" />
    
    {/* Twitter Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={fullCanonicalUrl} />
    <meta name="twitter:title" content={ogTitle} />
    <meta name="twitter:description" content={ogDescription} />
    <meta name="twitter:image" content={fullOgImage} />
    <meta name="twitter:creator" content="@pbsewoo" />
    
    {/* Favicon & App Icons */}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="msapplication-TileColor" content="#2d89ef" />
    
    {/* Preconnect & DNS Prefetch */}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    
    {/* Schema Markup (구조화된 데이터) */}
    {schema && (
      <script type="application/ld+json" set:html={JSON.stringify(schema)} />
    )}
    
    <!-- Google Tag Manager (GTM) -->
    <script is:inline>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-XXXXXXX');
    </script>
    
    <ViewTransitions />
  </head>
  
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript>
      <iframe 
        src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
        height="0" 
        width="0" 
        style="display:none;visibility:hidden">
      </iframe>
    </noscript>
    
    <slot />
  </body>
</html>
```

---

## 2. 메인 페이지 구현

### 파일 위치: apps/pangyeo/src/pages/index.astro

```astro
---
import { 
  PageLayout, 
  LocalBusinessSchema, 
  OrganizationSchema, 
  BreadcrumbSchema,
  HeroSection,
  FeaturesSection,
  GallerySection,
  IntroSection,
  AnalysisSection,
  HotEventSection,
  BlogSection,
  VenuePreviewSection,
  FAQSection,
  GuideSection 
} from '@bamastro/ui';

import { region } from '@/config/region';
import { getBlogPosts } from '@/lib/supabase';

// SEO 최적화된 메타 태그 (Title: 50-60자, Description: 150-160자)
const seoProps = {
  title: '판교 유흥 완벽 가이드 | 가라오케·하이퍼블릭·셔츠룸 추천 | 서우실장',
  description: '판교역·수로왕릉역 최고급 가라오케·하이퍼블릭 완벽 가이드. 2026년 최신 가격, 프로 에티켓, 추천 업소 총정리. 회식·데이트·비즈니스 접대 전문. 서우실장 24시간 무료 상담 ★',
  keywords: [
    '판교 유흥',
    '판교 가라오케',
    '판교 하이퍼블릭',
    '판교 셔츠룸',
    '판교역 유흥',
    '판교 하이퍼블릭 추천',
  ],
  ogImage: '/og-karaoke.jpg',
  ogTitle: '판교 유흥 완벽 가이드 | 가라오케·하이퍼블릭·셔츠룸 추천',
  ogDescription: '판교역·수로왕릉역 최고급 가라오케·하이퍼블릭 완벽 가이드. 2026년 최신 가격, 프로 에티켓, 추천 업소 총정리. 무료 상담 ★',
  canonicalUrl: '/',
  region,
};

// LocalBusinessSchema 데이터
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `https://${region.domain}/#local-business`,
  'name': `서우실장 ${region.name} 유흥 가이드`,
  'image': `https://${region.domain}/og-karaoke.jpg`,
  'description': region.seo.description,
  'url': `https://${region.domain}`,
  'telephone': region.phone,
  'email': region.email,
  'priceRange': '$$-$$$',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': region.address.street,
    'addressLocality': region.address.city,
    'addressRegion': region.address.region,
    'addressCountry': 'KR',
    'postalCode': '13486',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': region.geo.lat,
    'longitude': region.geo.lng,
  },
  'areaServed': [region.name, ...region.nearbyStations],
  'serviceType': [
    'Karaoke Guide',
    'Entertainment Consultation',
    '유흥 상담',
    '가라오케 가이드',
  ],
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.9',
    'reviewCount': '180',
    'bestRating': '5',
    'worstRating': '1',
  },
  'sameAs': [
    'https://www.facebook.com/pbsewoo',
    'https://www.instagram.com/pbsewoo',
    'https://t.me/pbsewoo',
  ],
};

// OrganizationSchema 데이터
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `https://${region.domain}/#organization`,
  'name': '서우실장',
  'image': `https://${region.domain}/logo.png`,
  'description': '대한민국 유흥 전문 상담사',
  'url': `https://${region.domain}`,
  'telephone': region.phone,
  'email': region.email,
  'areaServed': ['KR'],
  'serviceArea': [
    '강남',
    '분당',
    '판교',
    '수원',
    '인계동',
    '동탄',
    '안양',
    '수지',
    '안산',
  ],
  'sameAs': [
    'https://www.facebook.com/pbsewoo',
    'https://www.instagram.com/pbsewoo',
  ],
};

// BreadcrumbSchema 데이터
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': '홈',
      'item': `https://${region.domain}`,
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': `${region.name} 유흥 가이드`,
      'item': `https://${region.domain}`,
    },
  ],
};

// 블로그 포스트 가져오기
const blogPosts = await getBlogPosts();
---

<PageLayout {...seoProps}>
  {/* Schema Markup 주입 */}
  <LocalBusinessSchema schema={localBusinessSchema} />
  <OrganizationSchema schema={organizationSchema} />
  <BreadcrumbSchema schema={breadcrumbSchema} />
  
  {/* 페이지 콘텐츠 */}
  <HeroSection region={region} />
  <FeaturesSection />
  <GallerySection />
  <IntroSection region={region} />
  <AnalysisSection 
    regionName={region.name} 
    regionId={region.id} 
    stations={region.nearbyStations} 
    landmarks={region.landmarks} 
  />
  <HotEventSection />
  <BlogSection posts={blogPosts} />
  <VenuePreviewSection region={region} />
  <FAQSection region={region} />
  <GuideSection region={region} />
</PageLayout>
```

---

## 3. 업소 타입별 페이지 - 가라오케 가이드

### 파일 위치: apps/pangyeo/src/pages/[region]-karaoke-guide/index.astro

```astro
---
import { 
  PageLayout,
  LocalBusinessSchema,
  BreadcrumbSchema,
  HowToSchema,
  FAQPageSchema,
  VenueCard,
  TableOfContents,
  RelatedServices
} from '@bamastro/ui';

import { region } from '@/config/region';

export function getStaticPaths() {
  return [
    { params: { region: region.id } },
  ];
}

const { region: regionId } = Astro.params;
const venueType = region.venueTypes.find(v => v.id === 'karaoke');

if (!venueType) {
  throw new Error(`Venue type 'karaoke' not found in region config`);
}

// SEO 최적화된 메타 태그 (Title: 50-60자, Description: 150-160자)
const seoProps = {
  title: '판교 가라오케 예약·가격 가이드 | 프리미엄 노래방 추천',
  description: '판교역·수로왕릉역 최고급 가라오케 완벽 가이드. 최신 JBL 음향, 럭셔리 룸. 회식·파티·비즈니스 맞춤 추천. 주대 18만원~, TC 10만원~. 무료 픽업 서비스. 24시간 예약 ★',
  keywords: [
    '판교 가라오케',
    '판교 가라오케 예약',
    '판교 가라오케 가격',
    '판교 프리미엄 노래방',
    '판교역 가라오케 추천',
    '판교역 노래방',
    '판교 회식 장소',
  ],
  ogImage: '/og-karaoke.jpg',
  ogTitle: '판교 가라오케 예약·가격 가이드 | 프리미엄 노래방 추천',
  ogDescription: '판교역·수로왕릉역 최고급 가라오케 완벽 가이드. 최신 음향, 럭셔리 룸. 회식·파티 맞춤 추천. 주대 18만원~.',
  canonicalUrl: `/${region.id}-karaoke-guide`,
  region,
};

// HowTo Schema (가라오케 이용 방법)
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': `https://${region.domain}/${region.id}-karaoke-guide#how-to`,
  'name': `${region.name} 가라오케 이용하기`,
  'description': `${region.name} 가라오케를 처음 이용하시는 분들을 위한 단계별 가이드`,
  'step': [
    {
      '@type': 'HowToStep',
      'position': 1,
      'name': '예약하기',
      'text': `원하는 시간, 인원, 주류 종류(양주/맥주) 및 방문 목적을 전달합니다. ${region.phone}으로 연락주세요.`,
      'image': `https://${region.domain}/images/how-to-step-1.webp`,
    },
    {
      '@type': 'HowToStep',
      'position': 2,
      'name': '입장 및 룸 배정',
      'text': '예약 시간에 맞춰 원하는 컨셉의 럭셔리 룸이 준비됩니다.',
      'image': `https://${region.domain}/images/how-to-step-2.webp`,
    },
    {
      '@type': 'HowToStep',
      'position': 3,
      'name': '음료 및 안주 세팅',
      'text': '선택한 양주/맥주 SET 음료, 프리미엄 안주, 제철 과일이 제공됩니다.',
      'image': `https://${region.domain}/images/how-to-step-3.webp`,
    },
    {
      '@type': 'HowToStep',
      'position': 4,
      'name': '노래 및 파티',
      'text': '기본 2-3시간의 노래 시간이 제공됩니다. DJ 서비스는 별도입니다.',
      'image': `https://${region.domain}/images/how-to-step-4.webp`,
    },
    {
      '@type': 'HowToStep',
      'position': 5,
      'name': '연장 서빙',
      'text': '즐거우면 추가 시간 연장 서빙이 가능합니다. 추가 주류도 주문 가능합니다.',
      'image': `https://${region.domain}/images/how-to-step-5.webp`,
    },
  ],
};

// BreadcrumbSchema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': '홈',
      'item': `https://${region.domain}`,
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': `${region.name} 유흥 가이드`,
      'item': `https://${region.domain}`,
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': '가라오케 가이드',
      'item': `https://${region.domain}/${region.id}-karaoke-guide`,
    },
  ],
};

// FAQ Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': '가라오케 처음 가봅니다. 뭘 준비해야 하나요?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': '복장 규칙: 깔끔한 일상복, 운동화 가능. 금지: 슬리퍼, 타올, 반팔. 미리 예약하면 무료 픽업 서비스 받으실 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      'name': '가라오케 가격은 얼마나 되나요?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': `주대: ${(region.pricing.minRoomCharge / 10000).toFixed(0)}만원 이상, 동반비(TC): ${(region.pricing.minTC / 10000).toFixed(0)}만원 이상. 최신 가격은 예약 시 확인하세요.`,
      },
    },
    {
      '@type': 'Question',
      'name': '예약 없이 방문 가능한가요?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': '예약을 권장합니다. 예약 시 선호하는 룸 타입 요청 가능하고, 무료 픽업 서비스도 받을 수 있습니다.',
      },
    },
  ],
};

// 지역 특화 콘텐츠
const localDesc = region.localContent?.venueDescriptions?.karaoke || '';

const venues = [
  {
    id: 'k-1',
    name: `${region.name} 프리미엄 가라오케`,
    type: 'Mega Party Room',
    location: `${region.nearbyStations[0]} 인근`,
    price: `주대 ${(region.pricing.minRoomCharge / 10000).toFixed(0)}만원 이상`,
    features: ['대형 룸', 'JBL 음향', `${region.nearbyStations[0]} 접근`, '회식 추천'],
    image: '/images/venues/karaoke_1.webp',
  },
];
---

<PageLayout {...seoProps}>
  <HowToSchema schema={howToSchema} />
  <BreadcrumbSchema schema={breadcrumbSchema} />
  <FAQPageSchema schema={faqSchema} />
  
  {/* 페이지 콘텐츠 */}
  <TableOfContents sections={['개요', '가격 정보', '예약 방법', '초보자 팁', 'FAQ']} />
  
  <div class="content-wrapper">
    <h1>{venueType.name} 완벽 가이드</h1>
    
    {/* 개요 섹션 */}
    <section>
      <h2>개요</h2>
      <p>{localDesc}</p>
    </section>
    
    {/* 가격 섹션 */}
    <section>
      <h2>가격 정보</h2>
      <div class="pricing-table">
        <p>주대: {(region.pricing.minRoomCharge / 10000).toFixed(0)}만원 이상</p>
        <p>동반비: {(region.pricing.minTC / 10000).toFixed(0)}만원 이상</p>
      </div>
    </section>
    
    {/* 추천 업소 */}
    <section>
      <h2>추천 업소</h2>
      <div class="venue-cards">
        {venues.map(venue => (
          <VenueCard {...venue} />
        ))}
      </div>
    </section>
  </div>
  
  {/* 관련 서비스 링크 */}
  <RelatedServices 
    services={region.venueTypes.filter(v => v.id !== 'karaoke')}
    regionId={region.id}
  />
</PageLayout>
```

---

## 4. 하이퍼블릭 가이드

### 파일 위치: apps/pangyeo/src/pages/[region]-highpublic-guide/index.astro

```astro
---
import { PageLayout, HowToSchema, BreadcrumbSchema, FAQPageSchema } from '@bamastro/ui';
import { region } from '@/config/region';

export function getStaticPaths() {
  return [{ params: { region: region.id } }];
}

const seoProps = {
  title: '판교 하이퍼블릭 완벽 가이드 | 가격·예약·초이스 시스템',
  description: '판교 하이퍼블릭(프라이빗 펍) 2026년 최신 가이드. 판교역·수로왕릉역 추천 업소, 매직미러 초이스 시스템, 가격 안내. 1인 방문 환영, 무료 픽업. 주대 18만원~. 비즈니스 접대 전문. ★',
  keywords: [
    '판교 하이퍼블릭',
    '판교 프라이빗 펍',
    '판교 하이퍼블릭 예약',
    '판교 하이퍼블릭 가격',
    '판교 하이퍼블릭 초보자',
    '판교역 하이퍼블릭',
    '판교 초이스 시스템',
    '판교 비즈니스 접대',
  ],
  ogImage: '/og-highpublic.jpg',
  canonicalUrl: `/${region.id}-highpublic-guide`,
  region,
};

// HowTo Schema - 하이퍼블릭 이용 방법
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  'name': `${region.name} 하이퍼블릭 이용하기`,
  'step': [
    {
      '@type': 'HowToStep',
      'position': 1,
      'name': '예약 및 입장',
      'text': '전화/카톡으로 예약 후 방문. 선호 매니저 요청 가능.',
    },
    {
      '@type': 'HowToStep',
      'position': 2,
      'name': '매직미러 초이스',
      'text': '투명한 벽 너머 매니저를 직접 볼 수 있는 초이스 시스템.',
    },
    {
      '@type': 'HowToStep',
      'position': 3,
      'name': '프라이빗 룸 배정',
      'text': '완벽하게 분리된 프라이빗 룸에서 프리미엄 경험.',
    },
    {
      '@type': 'HowToStep',
      'position': 4,
      'name': '음료 및 서빙',
      'text': '프리미엄 주류 서빙, 안주 및 과일 제공.',
    },
  ],
};

// FAQ Schema - 초보자 질문
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': '하이퍼블릭이 뭔가요?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': '프라이빗 펍으로, 매직미러 초이스 시스템을 통해 매니저를 직접 선택하는 프리미엄 비즈니스 라운지입니다.',
      },
    },
    {
      '@type': 'Question',
      'name': '1인도 방문 가능한가요?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': '예, 1인 방문을 환영합니다. 오히려 비즈니스 접대에 특화되어 있습니다.',
      },
    },
    {
      '@type': 'Question',
      'name': '초이스는 어떻게 하나요?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': '투명한 벽 너머로 매니저를 직접 보고 선택하는 시스템입니다. 마음에 드시는 분을 직접 선택하실 수 있습니다.',
      },
    },
  ],
};
---

<PageLayout {...seoProps}>
  <HowToSchema schema={howToSchema} />
  <FAQPageSchema schema={faqSchema} />
  
  <div class="content-wrapper">
    <h1>하이퍼블릭 완벽 가이드</h1>
    <!-- 페이지 콘텐츠 -->
  </div>
</PageLayout>
```

---

## 5. 비교 가이드 - 가라오케 vs 하이퍼블릭

### 파일 위치: apps/pangyeo/src/pages/[region]-karaoke-vs-highpublic.astro

```astro
---
import { PageLayout, ComparisonSchema, BreadcrumbSchema } from '@bamastro/ui';
import { region } from '@/config/region';

export function getStaticPaths() {
  return [{ params: { region: region.id } }];
}

const seoProps = {
  title: '판교 가라오케 vs 하이퍼블릭 | 차이점·가격·선택 가이드',
  description: '판교에서 가라오케와 하이퍼블릭 중 어떤 걸 선택할까? 가격, 분위기, 초이스 시스템, 용도별 비교. 비즈니스 접대·회식·데이트·2차 상황별 추천. 서우실장의 프로 팁. ★',
  keywords: [
    '판교 가라오케 vs 하이퍼블릭',
    '가라오케 하이퍼블릭 차이',
    '가라오케 하이퍼블릭 비교',
    '판교 선택 가이드',
  ],
  ogImage: '/og-karaoke.jpg',
  canonicalUrl: `/${region.id}-karaoke-vs-highpublic`,
  region,
};

// Comparison Schema
const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'ComparisonChart',
  'name': `${region.name} 가라오케 vs 하이퍼블릭`,
  'chart': [
    {
      'label': '가격대',
      'item1': '주대 16만원~',
      'item2': '주대 18만원~',
    },
    {
      'label': '분위기',
      'item1': '캐주얼, 파티',
      'item2': '프리미엄, 비즈니스',
    },
    {
      'label': '초이스',
      'item1': '없음',
      'item2': '매직미러 초이스',
    },
  ],
};
---

<PageLayout {...seoProps}>
  <ComparisonSchema schema={comparisonSchema} />
  
  <div class="content-wrapper">
    <h1>가라오케 vs 하이퍼블릭</h1>
    
    <section class="comparison-table">
      <table>
        <thead>
          <tr>
            <th>항목</th>
            <th>가라오케</th>
            <th>하이퍼블릭</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>가격대</td>
            <td>주대 16만원~</td>
            <td>주대 18만원~</td>
          </tr>
          <tr>
            <td>분위기</td>
            <td>캐주얼, 파티</td>
            <td>프리미엄, 비즈니스</td>
          </tr>
          <tr>
            <td>초이스</td>
            <td>없음</td>
            <td>매직미러 초이스 가능</td>
          </tr>
          <tr>
            <td>추천 용도</td>
            <td>회사 회식, 친구들과 파티</td>
            <td>비즈니스 접대, 해외 바이어</td>
          </tr>
          <tr>
            <td>1인 방문</td>
            <td>권장하지 않음</td>
            <td>환영함</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</PageLayout>
```

---

## 6. 블로그 페이지

### 파일 위치: apps/pangyeo/src/pages/blog/index.astro

```astro
---
import { PageLayout, BlogCard, BreadcrumbSchema } from '@bamastro/ui';
import { region } from '@/config/region';
import { getBlogPosts } from '@/lib/supabase';

const seoProps = {
  title: '판교 유흥 가이드 블로그 | 팁·에티켓·2026 트렌드',
  description: '판교 유흥 전문가가 알려주는 실전 팁과 에티켓. 15년 경력 서우실장의 인사이더 정보, 가라오케·하이퍼블릭 이용 가이드, 2026 최신 트렌드 총정리.',
  keywords: [
    '판교 유흥 가이드',
    '판교 가라오케 팁',
    '판교 하이퍼블릭 에티켓',
    '판교 유흥 블로그',
  ],
  canonicalUrl: '/blog',
  region,
};

const blogPosts = await getBlogPosts();
---

<PageLayout {...seoProps}>
  <div class="blog-listing">
    <h1>판교 유흥 가이드 블로그</h1>
    <p class="subtitle">15년 경력 서우실장의 실전 팁과 인사이더 정보</p>
    
    <div class="blog-posts">
      {blogPosts.map(post => (
        <BlogCard {...post} />
      ))}
    </div>
  </div>
</PageLayout>
```

---

## 7. 환경 설정 및 배포

### vercel.json 설정

```json
{
  "framework": null,
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm --filter @bamastro/pangyeo build",
  "outputDirectory": "apps/pangyeo/dist",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/images/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### .env 파일

```env
# Supabase
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=xxxxx

# Region Config
PUBLIC_REGION_ID=pangyeo
PUBLIC_REGION_NAME=판교
PUBLIC_DOMAIN=new-karaoke.com

# GTM
PUBLIC_GTM_ID=GTM-XXXXXXX

# Analytics
PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 8. 배포 체크리스트

- [ ] 모든 메타 태그 검증
- [ ] Schema Markup 테스트 (schema.org 검증)
- [ ] Page Speed 확인 (Lighthouse 80+)
- [ ] Mobile 반응형 테스트
- [ ] 모든 링크 깨짐 확인
- [ ] 이미지 최적화 (WebP, 압축)
- [ ] XML 사이트맵 생성
- [ ] robots.txt 설정
- [ ] Google Search Console 등록
- [ ] Google Analytics 4 설정
- [ ] Naver Search Advisor 등록
- [ ] Canonical URL 모두 확인
- [ ] OG 이미지 검증 (카톡 공유 테스트)

---

**작성자**: Claude Code (SEO Specialist)  
**최종 수정**: 2026-01-27  
**버전**: 1.0
