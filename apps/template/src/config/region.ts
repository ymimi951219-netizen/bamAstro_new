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
    kakaoLink: string;             // http://qr.kakao.com/talk/jMlvTnRecn1PgP4S9gqME2itU7g-
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
        mainKeyword: string;         // 분당 유흥
        mainKeywords: string[];      // ['분당 유흥', '분당 하이퍼블릭', ...]
        description: string;         // 메인 설명
        naverVerification?: string;  // 네이버 웹마스터 도구 인증 코드
        googleVerification?: string; // 구글 서치 콘솔 인증 코드
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

    /** @deprecated Use stationDetails instead. Will be removed in future version. */
    areaGuides?: AreaGuide[];

    /** Station detail configs for programmatic station pages (OPTIONAL) */
    stationDetails?: StationDetail[];

    /** Seasonal content toggles (OPTIONAL) */
    seasonalContent?: {
        yearendParty: boolean;
        companyDinner: boolean;
        birthdayParty: boolean;
    };
}

export interface AreaGuide {
    slug: string;       // bundang-seohyeon-guide
    name: string;       // 서현역 가이드
}

export interface StationDetail {
    name: string;           // '서현역'
    nameEn: string;         // 'Seohyeon'
    slug: string;           // 'seohyeon'
    exitCount: number;      // 8
    landmarks: string[];    // ['로데오거리', '서현역 먹자골목']
    description: string;    // Area description for SEO (200+ chars)
    venueHighlights: string[]; // ['karaoke', 'highpublic'] - top venue types near this station
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
        mainKeyword: '분당 유흥',
        mainKeywords: [
            '분당 유흥',
            '분당 하이퍼블릭',
            '분당 가라오케',
            '분당 셔츠룸',
            '분당 기모노룸',
            '분당 룸살롱',
            '분당 호빠',
            '분당 퍼블릭',
            '분당 일프로',
            '분당 텐프로',
            '분당 텐카페',
            '분당 하이쩜오',
            '분당 쩜오',
            '분당 레깅스룸',
            '분당 란제리룸',
            '분당 노래빠',
            '분당 보도노래방',
            '분당 노래방보도',
            '분당 착석바',
            '분당 착석빠'
        ],
        description: '분당 유흥 가이드 | 서현역 로데오거리·야탑역 먹자골목 중심 하이퍼블릭·가라오케·셔츠룸 예약. 판교·서현 직장인 맞춤 코스 안내.',
        naverVerification: 'YOUR_NAVER_VERIFICATION_CODE',  // 네이버 웹마스터 도구에서 발급받은 코드로 교체
        googleVerification: 'YOUR_GOOGLE_VERIFICATION_CODE', // 구글 서치 콘솔에서 발급받은 코드로 교체
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

    stationDetails: [
        {
            name: '서현역',
            nameEn: 'Seohyeon',
            slug: 'seohyeon',
            exitCount: 8,
            landmarks: ['로데오거리', '서현역 먹자골목', '서현 시범단지'],
            description: '분당의 유흥 중심지. 로데오거리를 따라 다양한 하이퍼블릭, 가라오케, 룸살롱이 밀집해 있으며 직장인들의 회식과 모임 장소로 인기가 높습니다.',
            venueHighlights: ['karaoke', 'highpublic', 'roomsalon'],
        },
        {
            name: '야탑역',
            nameEn: 'Yatap',
            slug: 'yatap',
            exitCount: 6,
            landmarks: ['야탑역 먹자골목', '야탑 로데오'],
            description: '서현역 대비 가성비 좋은 업소가 많은 지역. 셔츠룸과 호빠 위주의 캐주얼한 유흥 문화가 형성되어 있습니다.',
            venueHighlights: ['shirtsroom', 'hostbar', 'karaoke'],
        },
        {
            name: '미금역',
            nameEn: 'Migeum',
            slug: 'migeum',
            exitCount: 4,
            landmarks: ['미금역 상가', '정자동 카페거리'],
            description: '조용하고 프라이빗한 분위기의 업소가 많은 지역. 소규모 모임이나 비즈니스 접대에 적합합니다.',
            venueHighlights: ['roomsalon', 'kimonoroom'],
        },
        {
            name: '판교역',
            nameEn: 'Pangyo',
            slug: 'pangyo',
            exitCount: 6,
            landmarks: ['판교테크노밸리', '판교 알파돔시티'],
            description: 'IT 직장인 밀집 지역. 퇴근 후 회식이나 비즈니스 미팅을 위한 프리미엄 업소가 늘어나고 있습니다.',
            venueHighlights: ['karaoke', 'highpublic', 'roomsalon'],
        },
    ],

    venueTypes: [
        {
            id: 'highpublic',
            name: '하이퍼블릭',
            slug: 'bundang-highpublic-guide',
            subtitle: '프라이빗 / 시크릿',
            description: '서현역 로데오거리 중심 프라이빗 라운지',
            image: '/images/venues/hyperpublic_main.webp',
            minPrice: 180000,
            keywords: ['분당 하이퍼블릭', '서현역 하이퍼블릭'],
        },
        {
            id: 'karaoke',
            name: '가라오케',
            slug: 'bundang-karaoke-guide',
            subtitle: '프리미엄 가라오케',
            description: '최신 음향 시설과 럭셔리 룸에서 즐기는 파티',
            image: '/images/venues/karaoke_main.webp',
            minPrice: 150000,
            keywords: ['분당 가라오케', '서현역 노래방'],
        },
        {
            id: 'shirtsroom',
            name: '셔츠룸',
            slug: 'bundang-shirtsroom-guide',
            subtitle: '캐주얼 라운지',
            description: '편안한 분위기에서 즐기는 캐주얼 비즈니스 클럽',
            image: '/images/venues/shirtsroom_main.webp',
            minPrice: 160000,
            keywords: ['분당 셔츠룸', '야탑 셔츠룸'],
        },
        {
            id: 'kimonoroom',
            name: '기모노룸',
            slug: 'bundang-kimono-room-guide',
            subtitle: '이색 체험',
            description: '이국적인 테마와 특별한 경험을 선사하는 공간',
            image: '/images/venues/kimono_main.webp',
            minPrice: 200000,
            keywords: ['분당 기모노룸', '이색 테마'],
        },
        {
            id: 'roomsalon',
            name: '룸살롱',
            slug: 'bundang-room-salon-guide',
            subtitle: '하이엔드 비즈니스',
            description: '성공적인 비즈니스를 위한 격조 높은 공간',
            image: '/images/venues/roomsalon_main.webp',
            minPrice: 250000,
            keywords: ['분당 룸싸롱', '분당 비즈니스'],
        },
        {
            id: 'hostbar',
            name: '호빠',
            slug: 'bundang-hostbar-guide',
            subtitle: '여성 전용',
            description: '여성 고객만을 위한 프라이빗 엔터테인먼트',
            image: '/images/venues/hostbar_main.webp',
            minPrice: 150000,
            keywords: ['분당 호빠', '서현 호스트바'],
        },
        {
            id: 'public',
            name: '퍼블릭',
            slug: 'bundang-public-guide',
            subtitle: '퍼블릭 라운지',
            description: '캐주얼한 분위기에서 즐기는 퍼블릭 스타일 라운지',
            image: '/images/venues/public_main.webp',
            minPrice: 100000,
            keywords: ['분당 퍼블릭', '분당 퍼블릭바', '서현 퍼블릭', '분당 퍼블릭 가격'],
        },
        {
            id: 'ilpro',
            name: '일프로',
            slug: 'bundang-ilpro-guide',
            subtitle: '1% 프리미엄',
            description: '엄선된 1% 프리미엄 룸에서의 특별한 경험',
            image: '/images/venues/ilpro_main.webp',
            minPrice: 200000,
            keywords: ['분당 일프로', '분당 1프로', '서현 일프로', '분당 일프로 가격'],
        },
        {
            id: 'tenpro',
            name: '텐프로',
            slug: 'bundang-tenpro-guide',
            subtitle: '10% 프리미엄',
            description: '검증된 텐프로 시스템으로 운영되는 프리미엄 룸',
            image: '/images/venues/tenpro_main.webp',
            minPrice: 180000,
            keywords: ['분당 텐프로', '분당 10프로', '서현 텐프로', '분당 텐프로 가격'],
        },
        {
            id: 'tencafe',
            name: '텐카페',
            slug: 'bundang-tencafe-guide',
            subtitle: '카페형 라운지',
            description: '카페 같은 편안한 공간에서 즐기는 프리미엄 서비스',
            image: '/images/venues/tencafe_main.webp',
            minPrice: 120000,
            keywords: ['분당 텐카페', '분당 10카페', '서현 텐카페', '분당 텐카페 가격'],
        },
        {
            id: 'hi-jjumo',
            name: '하이쩜오',
            slug: 'bundang-hi-jjumo-guide',
            subtitle: '하이 0.5 프리미엄',
            description: '하이쩜오 시스템의 프리미엄 엔터테인먼트',
            image: '/images/venues/hi-jjumo_main.webp',
            minPrice: 160000,
            keywords: ['분당 하이쩜오', '분당 하이 0.5', '서현 하이쩜오', '분당 하이쩜오 가격'],
        },
        {
            id: 'jjumo',
            name: '쩜오',
            slug: 'bundang-jjumo-guide',
            subtitle: '0.5 라운지',
            description: '합리적인 가격의 쩜오 시스템 라운지',
            image: '/images/venues/jjumo_main.webp',
            minPrice: 120000,
            keywords: ['분당 쩜오', '분당 0.5', '서현 쩜오', '분당 쩜오 가격'],
        },
        {
            id: 'leggingsroom',
            name: '레깅스룸',
            slug: 'bundang-leggingsroom-guide',
            subtitle: '테마 룸',
            description: '레깅스 테마의 특별한 룸 엔터테인먼트',
            image: '/images/venues/leggingsroom_main.webp',
            minPrice: 150000,
            keywords: ['분당 레깅스룸', '서현 레깅스룸', '분당 레깅스룸 가격', '분당 레깅스룸 후기'],
        },
        {
            id: 'lingerieroom',
            name: '란제리룸',
            slug: 'bundang-lingerieroom-guide',
            subtitle: '프리미엄 테마',
            description: '란제리 테마의 프리미엄 룸 서비스',
            image: '/images/venues/lingerieroom_main.webp',
            minPrice: 170000,
            keywords: ['분당 란제리룸', '서현 란제리룸', '분당 란제리룸 가격', '분당 란제리룸 후기'],
        },
        {
            id: 'noraeppa',
            name: '노래빠',
            slug: 'bundang-noraeppa-guide',
            subtitle: '노래 라운지',
            description: '노래와 함께 즐기는 프리미엄 바 라운지',
            image: '/images/venues/noraeppa_main.webp',
            minPrice: 100000,
            keywords: ['분당 노래빠', '분당 노래바', '서현 노래빠', '분당 노래빠 가격'],
        },
        {
            id: 'bodo-noraebang',
            name: '보도노래방',
            slug: 'bundang-bodo-noraebang-guide',
            subtitle: '보도 시스템',
            description: '보도 시스템으로 운영되는 프리미엄 노래방',
            image: '/images/venues/bodo-noraebang_main.webp',
            minPrice: 80000,
            keywords: ['분당 보도노래방', '서현 보도노래방', '분당 보도노래방 가격', '분당 보도노래방 후기'],
        },
        {
            id: 'noraebang-bodo',
            name: '노래방보도',
            slug: 'bundang-noraebang-bodo-guide',
            subtitle: '노래방 보도',
            description: '노래방에서 즐기는 보도 서비스 시스템',
            image: '/images/venues/noraebang-bodo_main.webp',
            minPrice: 80000,
            keywords: ['분당 노래방보도', '분당 노래방 보도', '서현 노래방보도', '분당 노래방보도 가격'],
        },
        {
            id: 'chaksukbar',
            name: '착석바',
            slug: 'bundang-chaksukbar-guide',
            subtitle: '착석 라운지',
            description: '착석형 바에서 편안하게 즐기는 프리미엄 서비스',
            image: '/images/venues/chaksukbar_main.webp',
            minPrice: 100000,
            keywords: ['분당 착석바', '서현 착석바', '분당 착석바 가격', '분당 착석바 추천'],
        },
        {
            id: 'chaksukppa',
            name: '착석빠',
            slug: 'bundang-chaksukppa-guide',
            subtitle: '착석 바',
            description: '착석빠 스타일의 캐주얼 라운지 바',
            image: '/images/venues/chaksukppa_main.webp',
            minPrice: 100000,
            keywords: ['분당 착석빠', '서현 착석빠', '분당 착석빠 가격', '분당 착석빠 후기'],
        },
    ],

    areaGuides: [
        { slug: '/station/seohyeon', name: '서현역 가이드' },
        { slug: '/station/yatap', name: '야탑역 가이드' },
        { slug: '/station/pangyo', name: '판교역 가이드' },
    ],
};
