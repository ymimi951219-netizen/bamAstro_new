export interface RegionConfig {
    id: string;
    name: string;
    nameEn: string;
    domain: string;
    phone: string;
    phoneFormatted: string;
    kakaoId: string;
    kakaoLink: string;
    telegramId: string;
    telegramLink: string;
    email: string;
    address: {
        street: string;
        city: string;
        cityEn: string;
        region: string;
        regionEn: string;
    };
    geo: {
        lat: number;
        lng: number;
    };
    landmarks: string[];
    nearbyStations: string[];
    seo: {
        mainKeyword: string;
        mainKeywords: string[];
        description: string;
        naverVerification?: string;
        googleVerification?: string;
        // SEO 최적화 메타 태그 (2026 개선)
        homeTitle?: string;         // 홈페이지 title (50-60자)
        homeDescription?: string;   // 홈페이지 description (150-160자)
        blogListTitle?: string;     // 블로그 목록 title
        blogListDescription?: string; // 블로그 목록 description
        // 롱테일 키워드
        longTailKeywords?: string[];
        locationKeywords?: string[];
    };
    pricing: {
        minRoomCharge: number;
        minTC: number;
        currency: string;
    };
    businessHours: {
        open: string;
        close: string;
    };
    venueTypes: VenueType[];
    areaGuides?: AreaGuide[];
}

export interface AreaGuide {
    slug: string;
    name: string;
}

export interface VenueType {
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    description: string;
    image: string;
    minPrice: number;
    keywords: string[];
}
