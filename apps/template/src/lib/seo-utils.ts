/**
 * SEO 유틸리티 함수
 * 제목, 메타 설명, 키워드 최적화를 위한 헬퍼 함수들
 */

// SEO 권장 길이 상수
export const SEO_LIMITS = {
  TITLE_MIN: 30,
  TITLE_MAX: 60,
  TITLE_OPTIMAL: 55,
  DESCRIPTION_MIN: 120,
  DESCRIPTION_MAX: 160,
  DESCRIPTION_OPTIMAL: 155,
  KEYWORD_DENSITY_MIN: 0.5,
  KEYWORD_DENSITY_MAX: 2.5,
  KEYWORD_DENSITY_OPTIMAL: 1.5,
} as const;

/**
 * 제목 길이 검증
 * @param title - 검증할 제목
 * @returns 검증 결과 및 메시지
 */
export function validateTitle(title: string): {
  isValid: boolean;
  length: number;
  message: string;
  suggestion?: string;
} {
  const length = title.length;

  if (length < SEO_LIMITS.TITLE_MIN) {
    return {
      isValid: false,
      length,
      message: `제목이 너무 짧습니다 (${length}자)`,
      suggestion: `최소 ${SEO_LIMITS.TITLE_MIN}자 이상으로 작성하세요.`,
    };
  }

  if (length > SEO_LIMITS.TITLE_MAX) {
    return {
      isValid: false,
      length,
      message: `제목이 너무 깁니다 (${length}자)`,
      suggestion: `${SEO_LIMITS.TITLE_MAX}자 이하로 줄이세요. 검색 결과에서 잘릴 수 있습니다.`,
    };
  }

  return {
    isValid: true,
    length,
    message: `적절한 제목 길이입니다 (${length}자)`,
  };
}

/**
 * 메타 설명 길이 검증
 * @param description - 검증할 메타 설명
 * @returns 검증 결과 및 메시지
 */
export function validateDescription(description: string): {
  isValid: boolean;
  length: number;
  message: string;
  suggestion?: string;
} {
  const length = description.length;

  if (length < SEO_LIMITS.DESCRIPTION_MIN) {
    return {
      isValid: false,
      length,
      message: `설명이 너무 짧습니다 (${length}자)`,
      suggestion: `최소 ${SEO_LIMITS.DESCRIPTION_MIN}자 이상으로 작성하세요.`,
    };
  }

  if (length > SEO_LIMITS.DESCRIPTION_MAX) {
    return {
      isValid: false,
      length,
      message: `설명이 너무 깁니다 (${length}자)`,
      suggestion: `${SEO_LIMITS.DESCRIPTION_MAX}자 이하로 줄이세요. 검색 결과에서 잘릴 수 있습니다.`,
    };
  }

  return {
    isValid: true,
    length,
    message: `적절한 설명 길이입니다 (${length}자)`,
  };
}

/**
 * 키워드 밀도 계산
 * @param content - 분석할 콘텐츠
 * @param keyword - 타겟 키워드
 * @returns 키워드 밀도 (%)
 */
export function calculateKeywordDensity(content: string, keyword: string): {
  density: number;
  count: number;
  totalWords: number;
  isOptimal: boolean;
  message: string;
} {
  // 콘텐츠를 소문자로 변환하고 HTML 태그 제거
  const cleanContent = content
    .toLowerCase()
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const lowerKeyword = keyword.toLowerCase();

  // 전체 단어 수 계산 (한국어 + 영어 모두 고려)
  const totalWords = cleanContent.split(/\s+/).filter((w) => w.length > 0).length;

  // 키워드 출현 횟수 계산
  const regex = new RegExp(lowerKeyword, 'gi');
  const matches = cleanContent.match(regex);
  const count = matches ? matches.length : 0;

  // 키워드 밀도 계산 (키워드 단어 수 고려)
  const keywordWords = keyword.split(/\s+/).length;
  const density = totalWords > 0 ? (count * keywordWords * 100) / totalWords : 0;

  let message: string;
  let isOptimal: boolean;

  if (density < SEO_LIMITS.KEYWORD_DENSITY_MIN) {
    message = `키워드 밀도가 낮습니다 (${density.toFixed(2)}%). 콘텐츠에 키워드를 더 포함하세요.`;
    isOptimal = false;
  } else if (density > SEO_LIMITS.KEYWORD_DENSITY_MAX) {
    message = `키워드 밀도가 높습니다 (${density.toFixed(2)}%). 키워드 스터핑으로 판단될 수 있습니다.`;
    isOptimal = false;
  } else {
    message = `적절한 키워드 밀도입니다 (${density.toFixed(2)}%)`;
    isOptimal = true;
  }

  return {
    density: Number(density.toFixed(2)),
    count,
    totalWords,
    isOptimal,
    message,
  };
}

/**
 * 슬러그 유효성 검사
 * @param slug - 검증할 슬러그
 * @returns 검증 결과
 */
export function validateSlug(slug: string): {
  isValid: boolean;
  message: string;
  suggestion?: string;
} {
  // 빈 슬러그 체크
  if (!slug || slug.trim() === '') {
    return {
      isValid: false,
      message: '슬러그가 비어있습니다.',
      suggestion: '유효한 슬러그를 입력하세요.',
    };
  }

  // 소문자, 숫자, 하이픈만 허용
  const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!validSlugPattern.test(slug)) {
    return {
      isValid: false,
      message: '슬러그에 잘못된 문자가 포함되어 있습니다.',
      suggestion: '소문자, 숫자, 하이픈(-)만 사용하세요. 연속 하이픈이나 시작/끝 하이픈은 피하세요.',
    };
  }

  // 너무 긴 슬러그 체크
  if (slug.length > 75) {
    return {
      isValid: false,
      message: `슬러그가 너무 깁니다 (${slug.length}자)`,
      suggestion: '75자 이하로 줄이세요.',
    };
  }

  return {
    isValid: true,
    message: '유효한 슬러그입니다.',
  };
}

/**
 * 한국어 텍스트를 SEO 친화적인 슬러그로 변환
 * @param text - 변환할 텍스트
 * @returns SEO 친화적인 슬러그
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[가-힣]+/g, (match) => {
      // 한국어는 영문 대체어가 없으면 제거
      return '';
    })
    .replace(/[^a-z0-9\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .replace(/^-|-$/g, ''); // 시작/끝 하이픈 제거
}

/**
 * SEO 점수 계산 (0-100)
 * @param params - SEO 평가 파라미터
 * @returns SEO 점수
 */
export function calculateSeoScore(params: {
  title: string;
  description: string;
  content: string;
  keyword: string;
  hasH1?: boolean;
  hasImages?: boolean;
  hasAltTags?: boolean;
  hasInternalLinks?: boolean;
}): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: Record<string, number>;
  suggestions: string[];
} {
  const breakdown: Record<string, number> = {};
  const suggestions: string[] = [];
  let totalScore = 0;

  // 제목 점수 (20점)
  const titleValidation = validateTitle(params.title);
  if (titleValidation.isValid) {
    breakdown.title = 20;
    totalScore += 20;
  } else {
    breakdown.title = 10;
    totalScore += 10;
    suggestions.push(titleValidation.suggestion || '제목 길이를 조정하세요.');
  }

  // 설명 점수 (20점)
  const descValidation = validateDescription(params.description);
  if (descValidation.isValid) {
    breakdown.description = 20;
    totalScore += 20;
  } else {
    breakdown.description = 10;
    totalScore += 10;
    suggestions.push(descValidation.suggestion || '설명 길이를 조정하세요.');
  }

  // 키워드 밀도 점수 (20점)
  const densityResult = calculateKeywordDensity(params.content, params.keyword);
  if (densityResult.isOptimal) {
    breakdown.keywordDensity = 20;
    totalScore += 20;
  } else {
    breakdown.keywordDensity = 10;
    totalScore += 10;
    suggestions.push(densityResult.message);
  }

  // 제목에 키워드 포함 (15점)
  if (params.title.toLowerCase().includes(params.keyword.toLowerCase())) {
    breakdown.keywordInTitle = 15;
    totalScore += 15;
  } else {
    breakdown.keywordInTitle = 0;
    suggestions.push('제목에 메인 키워드를 포함하세요.');
  }

  // H1 태그 (10점)
  if (params.hasH1) {
    breakdown.h1Tag = 10;
    totalScore += 10;
  } else {
    breakdown.h1Tag = 0;
    suggestions.push('페이지에 H1 태그를 추가하세요.');
  }

  // 이미지 (10점)
  if (params.hasImages) {
    breakdown.images = params.hasAltTags ? 10 : 5;
    totalScore += params.hasAltTags ? 10 : 5;
    if (!params.hasAltTags) {
      suggestions.push('이미지에 alt 태그를 추가하세요.');
    }
  } else {
    breakdown.images = 0;
    suggestions.push('페이지에 관련 이미지를 추가하세요.');
  }

  // 내부 링크 (5점)
  if (params.hasInternalLinks) {
    breakdown.internalLinks = 5;
    totalScore += 5;
  } else {
    breakdown.internalLinks = 0;
    suggestions.push('관련 페이지로 내부 링크를 추가하세요.');
  }

  // 등급 결정
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (totalScore >= 90) grade = 'A';
  else if (totalScore >= 75) grade = 'B';
  else if (totalScore >= 60) grade = 'C';
  else if (totalScore >= 40) grade = 'D';
  else grade = 'F';

  return {
    score: totalScore,
    grade,
    breakdown,
    suggestions,
  };
}

/**
 * 읽기 시간 계산 (분)
 * @param content - 콘텐츠
 * @param wordsPerMinute - 분당 읽는 단어 수 (한국어 기준 약 500자/분)
 * @returns 예상 읽기 시간 (분)
 */
export function calculateReadingTime(
  content: string,
  charsPerMinute: number = 500
): number {
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
  const charCount = cleanContent.length;
  return Math.ceil(charCount / charsPerMinute);
}
