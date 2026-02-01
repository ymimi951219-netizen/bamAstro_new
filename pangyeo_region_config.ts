// 판교 지역 설정 파일 예시
// 실제 사용 시: apps/pangyeo/src/config/region.ts 에 저장

import { RegionConfig } from './types';

export const region: RegionConfig = {
  id: 'pangyeo',
  name: '판교',
  nameEn: 'Pangyeo',
  domain: 'new-karaoke.com',

  phone: '010-2626-4833',
  phoneFormatted: '010-2626-4833',
  kakaoId: '@pbsewoo',
  kakaoLink: 'http://qr.kakao.com/talk/jMlvTnRecn1PgP4S9gqME2itU7g-',
  telegramId: '@pbsewoo',
  telegramLink: 'https://t.me/pbsewoo',
  email: 'ymimi9512@gmail.com',

  address: {
    street: '판교역·수로왕릉역 일대',
    city: '성남시',
    cityEn: 'Seongnam-si',
    region: '경기도',
    regionEn: 'Gyeonggi-do',
  },
  geo: {
    lat: 37.3950,
    lng: 127.1117,
  },

  landmarks: ['판교역 광장', '수로왕릉역 먹자골목', '판교테크밸리', '분당구청'],
  nearbyStations: ['판교역', '수로왕릉역', '정자역', '이매역'],

  seo: {
    mainKeyword: '판교 유흥',
    mainKeywords: [
      '판교 유흥',
      '판교 가라오케',
      '판교 하이퍼블릭',
      '판교 셔츠룸',
      '판교 룸살롱',
      '판교 기모노룸',
      '판교 호빠',
    ],
    description: '판교역·수로왕릉역 최고급 가라오케·하이퍼블릭 완벽 가이드. 2026년 최신 가격, 추천 업소, 예약 팁 총정리. 회식·데이트·비즈니스 접대 전문. 서우실장 24시간 무료 상담.',
    
    // 메인 페이지용 메타 태그 (50-60자 Title, 150-160자 Description)
    homeTitle: '판교 유흥 완벽 가이드 | 가라오케·하이퍼블릭·셔츠룸 추천 | 서우실장',
    homeDescription: '판교역·수로왕릉역 최고급 가라오케·하이퍼블릭 완벽 가이드. 2026년 최신 가격, 프로 에티켓, 추천 업소 총정리. 회식·데이트·비즈니스 접대 전문. 서우실장 24시간 무료 상담 ★',
    
    // 블로그 리스팅 페이지
    blogListTitle: '판교 유흥 가이드 블로그 | 프로 팁·에티켓·2026 트렌드 | 서우실장',
    blogListDescription: '판교 유흥 전문가가 알려주는 실전 팁과 에티켓. 15년 경력 서우실장의 인사이더 정보, 가라오케·하이퍼블릭 이용 가이드, 2026 최신 트렌드 총정리.',
    
    naverVerification: '',
    googleVerification: '',
    
    // 롱테일 키워드 (Long-tail Keywords)
    longTailKeywords: [
      // 가격/예약 관련
      '판교 가라오케 가격',
      '판교 가라오케 예약',
      '판교 가라오케 추천',
      '판교 하이퍼블릭 가격',
      '판교 하이퍼블릭 예약',
      '판교 하이퍼블릭 초보자',
      '판교역 가라오케 추천',
      '판교역 유흥 가격',
      '수로왕릉역 가라오케',
      '판교 룸살롱 가격',
      '판교 접대 장소 추천',
      '판교 회식 장소 2차',
      // 초보자/가이드 관련
      '판교 유흥 초보자 가이드',
      '판교 가라오케 팁',
      '판교 하이퍼블릭 에티켓',
      '판교 유흥 예절',
      // 시간대/상황별
      '판교 회사원 저녁 유흥',
      '판교 2차 추천',
      '판교 직장인 술자리',
      '판교 퇴근 후 유흥',
      '판교 데이트 장소',
      // 가격대별
      '판교 가성비 유흥',
      '판교 가라오케 싼곳',
    ],
    
    // 위치 기반 키워드 (Location Keywords)
    locationKeywords: [
      '판교역 유흥',
      '수로왕릉역 가라오케',
      '정자역 하이퍼블릭',
      '이매역 룸살롱',
      '판교테크밸리 근처 유흥',
      '분당구 가라오케',
      '판교역 도보 유흥',
      '수로왕릉역 근처 가라오케',
      '판교 테크밸리 2차',
    ],
  },

  pricing: {
    minRoomCharge: 180000, // 판교: 강남보다 10% 낮음
    minTC: 100000,
    currency: 'KRW',
  },

  businessHours: {
    open: '18:00',
    close: '06:00',
  },

  venueTypes: [
    {
      id: 'highpublic',
      name: '하이퍼블릭',
      slug: 'pangyeo-highpublic-guide',
      subtitle: '프라이빗 / 시크릿',
      description: '판교 테크밸리 임원·스타트업 CEO들의 비즈니스 접대 1순위. 매직미러 초이스와 완벽한 프라이빗 룸에서 품격 있는 시간을 보내세요.',
      image: '/images/venues/hyperpublic_main.webp',
      minPrice: 180000,
      keywords: ['판교 하이퍼블릭', '판교역 하이퍼블릭'],
    },
    {
      id: 'karaoke',
      name: '가라오케',
      slug: 'pangyeo-karaoke-guide',
      subtitle: '프리미엄 가라오케',
      description: '최신 JBL 음향과 하만카돈 시스템을 장착한 럭셔리 룸. 판교역 인근 대형 파티룸은 20인 이상 회식에 최적화되어 있습니다.',
      image: '/images/venues/karaoke_main.webp',
      minPrice: 160000,
      keywords: ['판교 가라오케', '판교역 노래방'],
    },
    {
      id: 'shirtsroom',
      name: '셔츠룸',
      slug: 'pangyeo-shirtsroom-guide',
      subtitle: '캐주얼 라운지',
      description: '2030 직장인을 위한 캐주얼 비즈니스 라운지. 부담 없는 가격에 수로왕릉역 인근 트렌디한 분위기에서 편안하게 즐기세요.',
      image: '/images/venues/shirtsroom_main.webp',
      minPrice: 150000,
      keywords: ['판교 셔츠룸', '수로왕릉역 셔츠룸'],
    },
    {
      id: 'kimonoroom',
      name: '기모노룸',
      slug: 'pangyeo-kimonoroom-guide',
      subtitle: '이색 체험',
      description: '일본식 정통 서비스와 이국적인 인테리어. 해외 바이어 접대나 특별한 날 색다른 경험을 원하시는 분께 추천합니다.',
      image: '/images/venues/kimono_main.webp',
      minPrice: 220000,
      keywords: ['판교 기모노룸', '이색 테마'],
    },
    {
      id: 'roomsalon',
      name: '룸살롱',
      slug: 'pangyeo-roomsalon-guide',
      subtitle: '하이엔드 비즈니스',
      description: '대한민국 유흥업계 최정상. 판교 고급 업소는 스타트업 최고경영자와 VIP 고객을 위한 격조 높은 비즈니스 공간입니다.',
      image: '/images/venues/roomsalon_main.webp',
      minPrice: 280000,
      keywords: ['판교 룸싸롱', '판교 비즈니스'],
    },
    {
      id: 'hostbar',
      name: '호빠',
      slug: 'pangyeo-hostbar-guide',
      subtitle: '여성 전용',
      description: '판교역 인근 여성 고객 전용 프라이빗 라운지. 연예인급 외모의 전문 호스트가 특별한 밤을 선물합니다.',
      image: '/images/venues/hostbar_main.webp',
      minPrice: 160000,
      keywords: ['판교 호빠', '판교 호스트바'],
    },
  ],

  areaGuides: [
    { slug: 'pangyeo-station-guide', name: '판교역 가이드' },
    { slug: 'surowang-station-guide', name: '수로왕릉역 가이드' },
  ],

  // 판교 특화 콘텐츠
  localContent: {
    areaCharacter: '경기도 분당의 신도시. 삼성, SK, 네이버, 카카오 등 IT 기업 본사 밀집 지역. 평일 저녁 비즈니스 접대 수요가 높고, 주중과 주말의 기업 회식 수요 많음.',
    targetCustomers: '스타트업 CEO, IT 임원, 대기업 관리자, 해외 바이어 접대',
    transportFeature: '신분당선·분당선 환승역으로 서울 전역 40분 내 접근. 판교테크밸리 인접으로 근처 직장인 접근성 매우 높음.',
    nearbyBusiness: ['삼성', 'SK', '네이버', '카카오', '배달의민족', '쿠팡', '펀더스탠딩', '다양한 스타트업'],
    uniqueAdvantages: [
      '판교테크밸리 인접으로 IT 수요 높음',
      '신도시 내 신시설 업소 다수',
      '평일 저녁 예약이 많은 지역',
      '회식·접대 문화 발달',
      '직장인 밀도 높음',
    ],
    recommendedTime: '평일 저녁 6-9시 비즈니스 타임이 가장 붐빕니다. 목요일·금요일 오프타임 이용객 많음.',
    pricingNote: '강남 대비 10-20% 낮은 가격대. 강남과 유사한 시설 수준에서 더 저렴한 가성비.',
    venueDescriptions: {
      highpublic: '판교 하이퍼블릭은 판교테크밸리 임원·스타트업 CEO들의 비즈니스 접대 1순위입니다. 매직미러 초이스와 프라이빗 룸이 기본이며, 수로왕릉역 골목에 숨은 시크릿 라운지들이 특히 인기입니다.',
      karaoke: '판교 가라오케는 최신 JBL 음향과 하만카돈 시스템을 기본 장착합니다. 판교역 인근 대형 파티룸은 20인 이상 회식에 최적화되어 있습니다.',
      shirtsroom: '판교 셔츠룸은 캐주얼한 분위기에서 부담 없이 즐기기 좋습니다. 수로왕릉역 인근에 2030 직장인 타겟 업소들이 밀집해 있습니다.',
      roomsalon: '판교 룸살롱은 IT 임원과 스타트업 CEO들의 단골입니다. 판교 고급 업소는 격조 높은 비즈니스 공간으로 알려져 있습니다.',
      kimonoroom: '판교 기모노룸은 일본식 정통 서비스를 제공합니다. 해외 바이어 접대나 이색 체험을 원하는 고객에게 추천합니다.',
      hostbar: '판교 호빠는 여성 고객 전용으로 판교역 인근에 위치합니다. 연예인급 외모의 호스트들이 근무합니다.',
    },
  },
};
