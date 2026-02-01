import type { RegionConfig } from '../config/region';

export interface LinkItem {
  href: string;
  title: string;
  description?: string;
}

type PageType = 'homepage' | 'venue-pillar' | 'venue-subpage' | 'venue-faq' | 'station' | 'station-venue' | 'situational' | 'comparison' | 'comparison-hub' | 'hub' | 'glossary' | 'review-hub' | 'map' | 'price-guide';

interface LinkContext {
  pageType: PageType;
  venueId?: string;
  subpageType?: string;
  stationSlug?: string;
  guideSlug?: string;
  comparedVenues?: [string, string];
}

const VENUE_NAMES: Record<string, string> = {
  karaoke: '가라오케',
  highpublic: '하이퍼블릭',
  shirtsroom: '셔츠룸',
  kimonoroom: '기모노룸',
  roomsalon: '룸살롱',
  hostbar: '호빠',
  public: '퍼블릭',
  ilpro: '일프로',
  tenpro: '텐프로',
  tencafe: '텐카페',
  'hi-jjumo': '하이쩜오',
  jjumo: '쩜오',
  leggingsroom: '레깅스룸',
  lingerieroom: '란제리룸',
  noraeppa: '노래빠',
  'bodo-noraebang': '보도노래방',
  'noraebang-bodo': '노래방보도',
  chaksukbar: '착석바',
  chaksukppa: '착석빠',
};

const VENUE_IDS = ['karaoke', 'highpublic', 'shirtsroom', 'kimonoroom', 'roomsalon', 'hostbar', 'public', 'ilpro', 'tenpro', 'tencafe', 'hi-jjumo', 'jjumo', 'leggingsroom', 'lingerieroom', 'noraeppa', 'bodo-noraebang', 'noraebang-bodo', 'chaksukbar', 'chaksukppa'];

const SUBPAGE_TYPES = [
  { id: 'price', name: '가격 가이드' },
  { id: 'how-to-use', name: '이용 방법' },
  { id: 'etiquette', name: '에티켓 가이드' },
  { id: 'ranking', name: 'TOP 5 추천' },
  { id: 'review', name: '후기 & 리뷰' },
];

const VENUE_SLUG_MAP: Record<string, string> = {
  karaoke: 'karaoke-guide',
  highpublic: 'highpublic-guide',
  shirtsroom: 'shirtsroom-guide',
  kimonoroom: 'kimono-room-guide',
  roomsalon: 'room-salon-guide',
  hostbar: 'hostbar-guide',
  public: 'public-guide',
  ilpro: 'ilpro-guide',
  tenpro: 'tenpro-guide',
  tencafe: 'tencafe-guide',
  'hi-jjumo': 'hi-jjumo-guide',
  jjumo: 'jjumo-guide',
  leggingsroom: 'leggingsroom-guide',
  lingerieroom: 'lingerieroom-guide',
  noraeppa: 'noraeppa-guide',
  'bodo-noraebang': 'bodo-noraebang-guide',
  'noraebang-bodo': 'noraebang-bodo-guide',
  chaksukbar: 'chaksukbar-guide',
  chaksukppa: 'chaksukppa-guide',
};

function venueGuideUrl(regionId: string, venueId: string, subpage?: string): string {
  const slug = VENUE_SLUG_MAP[venueId] || `${venueId}-guide`;
  const base = `/${regionId}-${slug}`;
  return subpage ? `${base}/${subpage}` : base;
}

export function getRelatedLinks(ctx: LinkContext, region: RegionConfig): LinkItem[] {
  const r = region.id;
  const links: LinkItem[] = [];

  switch (ctx.pageType) {
    case 'homepage': {
      // Link to all 6 venue pillars
      for (const v of VENUE_IDS) {
        links.push({ href: venueGuideUrl(r, v), title: `${region.name} ${VENUE_NAMES[v]} 가이드`, description: `${VENUE_NAMES[v]} 완벽 가이드` });
      }
      links.push({ href: `/${r}-entertainment-hub`, title: `${region.name} 유흥 종합 가이드`, description: '모든 업종 한눈에' });
      links.push({ href: `/${r}-comparison-hub`, title: '업종 비교', description: '어떤 업종이 나에게 맞을까?' });
      // Top 2 stations
      const stations = region.stationDetails ?? [];
      for (const s of stations.slice(0, 2)) {
        links.push({ href: `/station/${s.slug}`, title: `${s.name} 유흥 가이드`, description: s.description.slice(0, 50) + '...' });
      }
      break;
    }

    case 'venue-pillar': {
      const v = ctx.venueId!;
      // 5 own subpages
      for (const sp of SUBPAGE_TYPES) {
        links.push({ href: venueGuideUrl(r, v, sp.id), title: `${VENUE_NAMES[v]} ${sp.name}` });
      }
      links.push({ href: venueGuideUrl(r, v, 'faq'), title: `${VENUE_NAMES[v]} FAQ`, description: '자주 묻는 질문' });
      // Comparison pages involving this venue
      const comparisons = [
        ['karaoke', 'highpublic'], ['roomsalon', 'hostbar'], ['shirtsroom', 'kimonoroom'],
        ['karaoke', 'roomsalon'], ['highpublic', 'shirtsroom'],
      ];
      for (const [v1, v2] of comparisons) {
        if (v1 === v || v2 === v) {
          links.push({ href: `/${r}-${v1}-vs-${v2}`, title: `${VENUE_NAMES[v1]} vs ${VENUE_NAMES[v2]}` });
        }
      }
      // Hub
      links.push({ href: `/${r}-entertainment-hub`, title: `${region.name} 유흥 종합 가이드` });
      break;
    }

    case 'venue-subpage': {
      const v = ctx.venueId!;
      const sp = ctx.subpageType!;
      // Parent pillar
      links.push({ href: venueGuideUrl(r, v), title: `${VENUE_NAMES[v]} 가이드`, description: '메인 가이드로 돌아가기' });
      // Sibling subpages
      for (const s of SUBPAGE_TYPES) {
        if (s.id !== sp) {
          links.push({ href: venueGuideUrl(r, v, s.id), title: `${VENUE_NAMES[v]} ${s.name}` });
        }
      }
      // Same subpage type of other venues
      for (const otherV of VENUE_IDS) {
        if (otherV !== v) {
          links.push({ href: venueGuideUrl(r, otherV, sp), title: `${VENUE_NAMES[otherV]} ${SUBPAGE_TYPES.find(s => s.id === sp)?.name}` });
        }
      }
      links.push({ href: `/${r}-comparison-hub`, title: '업종 비교 허브' });
      break;
    }

    case 'venue-faq': {
      const v = ctx.venueId!;
      links.push({ href: venueGuideUrl(r, v), title: `${VENUE_NAMES[v]} 가이드`, description: '메인 가이드' });
      for (const sp of SUBPAGE_TYPES) {
        links.push({ href: venueGuideUrl(r, v, sp.id), title: `${VENUE_NAMES[v]} ${sp.name}` });
      }
      // Other venue FAQs
      for (const otherV of VENUE_IDS) {
        if (otherV !== v) {
          links.push({ href: venueGuideUrl(r, otherV, 'faq'), title: `${VENUE_NAMES[otherV]} FAQ` });
        }
      }
      break;
    }

    case 'station': {
      const slug = ctx.stationSlug!;
      // Station venue combos
      links.push({ href: `/station/${slug}/karaoke`, title: `${slug} 가라오케` });
      links.push({ href: `/station/${slug}/highpublic`, title: `${slug} 하이퍼블릭` });
      // All venue pillars
      for (const v of VENUE_IDS) {
        links.push({ href: venueGuideUrl(r, v), title: `${region.name} ${VENUE_NAMES[v]}` });
      }
      // Other stations
      const stations = region.stationDetails ?? [];
      for (const s of stations) {
        if (s.slug !== slug) {
          links.push({ href: `/station/${s.slug}`, title: `${s.name} 가이드` });
        }
      }
      links.push({ href: `/${r}-entertainment-hub`, title: `${region.name} 유흥 종합` });
      break;
    }

    case 'station-venue': {
      const slug = ctx.stationSlug!;
      links.push({ href: `/station/${slug}`, title: `${slug} 유흥 가이드`, description: '역세권 메인 가이드' });
      if (ctx.venueId) {
        links.push({ href: venueGuideUrl(r, ctx.venueId), title: `${region.name} ${VENUE_NAMES[ctx.venueId]} 가이드` });
        links.push({ href: venueGuideUrl(r, ctx.venueId, 'ranking'), title: `${VENUE_NAMES[ctx.venueId]} TOP 5` });
        links.push({ href: venueGuideUrl(r, ctx.venueId, 'price'), title: `${VENUE_NAMES[ctx.venueId]} 가격` });
      }
      for (const v of VENUE_IDS.slice(0, 4)) {
        links.push({ href: venueGuideUrl(r, v), title: `${region.name} ${VENUE_NAMES[v]}` });
      }
      break;
    }

    case 'situational': {
      // Relevant venue pillars
      for (const v of VENUE_IDS.slice(0, 4)) {
        links.push({ href: venueGuideUrl(r, v), title: `${region.name} ${VENUE_NAMES[v]} 가이드` });
      }
      // Stations
      const stations = region.stationDetails ?? [];
      for (const s of stations.slice(0, 2)) {
        links.push({ href: `/station/${s.slug}`, title: `${s.name} 가이드` });
      }
      links.push({ href: `/${r}-entertainment-price-guide`, title: '가격 가이드' });
      links.push({ href: `/${r}-comparison-hub`, title: '업종 비교' });
      // Related situational guides
      const situationalGuides = [
        { slug: 'lunch-guide', name: '점심 유흥' }, { slug: 'evening-guide', name: '저녁 유흥' },
        { slug: 'latenight-guide', name: '심야 유흥' }, { slug: 'couple-guide', name: '커플 가이드' },
        { slug: 'small-group-guide', name: '소모임' }, { slug: 'large-group-guide', name: '단체 가이드' },
        { slug: 'budget-guide', name: '가성비 가이드' }, { slug: 'premium-guide', name: '프리미엄 가이드' },
        { slug: 'yearend-party', name: '연말 파티' }, { slug: 'company-dinner', name: '회식 가이드' },
        { slug: 'birthday-party', name: '생일 파티' }, { slug: 'business-meeting', name: '비즈니스 미팅' },
        { slug: 'first-timer', name: '초보자 가이드' }, { slug: 'date-course', name: '데이트 코스' },
        { slug: 'after-party', name: '2차 가이드' },
      ];
      for (const g of situationalGuides) {
        if (g.slug !== ctx.guideSlug) {
          links.push({ href: `/guide/${r}-${g.slug}`, title: `${region.name} ${g.name}` });
        }
      }
      break;
    }

    case 'comparison': {
      const [v1, v2] = ctx.comparedVenues || ['karaoke', 'highpublic'];
      links.push({ href: venueGuideUrl(r, v1), title: `${VENUE_NAMES[v1]} 가이드` });
      links.push({ href: venueGuideUrl(r, v2), title: `${VENUE_NAMES[v2]} 가이드` });
      links.push({ href: `/${r}-comparison-hub`, title: '업종 비교 허브' });
      links.push({ href: venueGuideUrl(r, v1, 'price'), title: `${VENUE_NAMES[v1]} 가격` });
      links.push({ href: venueGuideUrl(r, v2, 'price'), title: `${VENUE_NAMES[v2]} 가격` });
      links.push({ href: `/guide/${r}-first-timer`, title: '초보자 가이드' });
      links.push({ href: `/guide/${r}-budget-guide`, title: '가성비 가이드' });
      links.push({ href: `/${r}-entertainment-hub`, title: '유흥 종합 가이드' });
      break;
    }

    case 'comparison-hub': {
      const comparisons = [
        ['karaoke', 'highpublic'], ['roomsalon', 'hostbar'], ['shirtsroom', 'kimonoroom'],
        ['karaoke', 'roomsalon'], ['highpublic', 'shirtsroom'],
      ];
      for (const [v1, v2] of comparisons) {
        links.push({ href: `/${r}-${v1}-vs-${v2}`, title: `${VENUE_NAMES[v1]} vs ${VENUE_NAMES[v2]}` });
      }
      for (const v of VENUE_IDS) {
        links.push({ href: venueGuideUrl(r, v), title: `${region.name} ${VENUE_NAMES[v]}` });
      }
      break;
    }

    case 'hub': {
      for (const v of VENUE_IDS) {
        links.push({ href: venueGuideUrl(r, v), title: `${region.name} ${VENUE_NAMES[v]} 가이드` });
      }
      const stations = region.stationDetails ?? [];
      for (const s of stations) {
        links.push({ href: `/station/${s.slug}`, title: `${s.name} 가이드` });
      }
      links.push({ href: `/${r}-comparison-hub`, title: '업종 비교' });
      links.push({ href: `/${r}-glossary`, title: '유흥 용어사전' });
      links.push({ href: `/blog`, title: '블로그' });
      break;
    }

    case 'glossary': {
      for (const v of VENUE_IDS) {
        links.push({ href: venueGuideUrl(r, v), title: `${region.name} ${VENUE_NAMES[v]} 가이드` });
      }
      links.push({ href: `/${r}-entertainment-hub`, title: '유흥 종합 가이드' });
      links.push({ href: `/guide/${r}-first-timer`, title: '초보자 가이드' });
      links.push({ href: `/${r}-entertainment-price-guide`, title: '가격 종합 가이드' });
      break;
    }

    case 'review-hub': {
      for (const v of VENUE_IDS) {
        links.push({ href: venueGuideUrl(r, v, 'review'), title: `${VENUE_NAMES[v]} 후기` });
        links.push({ href: venueGuideUrl(r, v, 'ranking'), title: `${VENUE_NAMES[v]} TOP 5` });
      }
      links.push({ href: `/${r}-entertainment-hub`, title: '유흥 종합 가이드' });
      break;
    }

    case 'price-guide': {
      for (const v of VENUE_IDS) {
        links.push({ href: venueGuideUrl(r, v, 'price'), title: `${VENUE_NAMES[v]} 가격 상세` });
      }
      links.push({ href: `/guide/${r}-budget-guide`, title: '가성비 가이드' });
      links.push({ href: `/guide/${r}-premium-guide`, title: '프리미엄 가이드' });
      links.push({ href: `/${r}-comparison-hub`, title: '업종 비교' });
      break;
    }

    case 'map': {
      const stations = region.stationDetails ?? [];
      for (const s of stations) {
        links.push({ href: `/station/${s.slug}`, title: `${s.name} 가이드` });
      }
      for (const v of VENUE_IDS) {
        links.push({ href: venueGuideUrl(r, v), title: `${region.name} ${VENUE_NAMES[v]}` });
      }
      links.push({ href: `/${r}-entertainment-hub`, title: '유흥 종합 가이드' });
      break;
    }
  }

  // Return max 12 links
  return links.slice(0, 12);
}
