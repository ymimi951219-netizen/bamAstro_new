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

    // 지역별 가이드 (선택)
    areaGuides?: AreaGuide[];
}

export interface AreaGuide {
    slug: string;       // bundang-seohyeon-guide
    name: string;       // 서현역 가이드
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
            '분당 호빠'
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
    ],

    areaGuides: [
        { slug: 'bundang-seohyeon-guide', name: '서현역 가이드' },
        { slug: 'bundang-yatap-guide', name: '야탑역 가이드' },
        { slug: 'bundang-pangyo-guide', name: '판교역 가이드' },
    ],
};
