# SEO 최적화 실행 계획 | 빠른 시작 가이드

분당 유흥 정보 블로그 SEO 구조 개선 - 최우선 실행 항목

---

## 현재 상태 요약

### 현재 URL 구조
```
/blog                           블로그 목록
/blog/page/2                    페이지네이션
/blog/bundang-karaoke-78-guide  개별 글
```

### 주요 문제점
1. URL에 카테고리 정보 없음
2. SEO 사일로 구조 부재
3. 스키마 마크업 미흡
4. 내부 링크 전략 부족

---

## 1단계: 즉시 시작 (이번 주)

### Task 1: 파일 구조 설정

```bash
# src/pages에 새 디렉토리 생성
mkdir -p src/pages/guides/{karaoke,hyperpublic,shirtsroom,hostbar,room-salon,kimono-room}

# Astro 파일 생성
touch src/pages/guides/index.astro
touch src/pages/guides/[category].astro
touch src/pages/guides/[category]/[slug].astro
```

### Task 2: BlogPosting 스키마 추가 (30분)

```astro
<!-- src/pages/blog/[slug].astro에 추가 -->
---
// 페이지 최상단에 추가

const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.featured_image,
  "datePublished": post.published_at,
  "dateModified": post.updated_at,
  "author": {
    "@type": "Organization",
    "name": "서우실장"
  },
  "inLanguage": "ko"
};
---

<Fragment set:html={`<script type="application/ld+json">${JSON.stringify(schema)}</script>`} />
```

### Task 3: Breadcrumb 스키마 추가 (30분)

모든 페이지의 head에 추가

```astro
<!-- 모든 [slug].astro 페이지 -->
<Fragment set:html={`
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "홈", "item": "https://bundanghipublic.com"},
      {"@type": "ListItem", "position": 2, "name": "블로그", "item": "https://bundanghipublic.com/blog"},
      {"@type": "ListItem", "position": 3, "name": "${post.title}"}
    ]
  }
  </script>
`} />
```

**완료 목표**: 전체 블로그 글에 스키마 마크업 적용

---

## 2단계: 기초 구축 (1주일)

### Task 4: 가이드 메인 페이지 생성

```astro
<!-- src/pages/guides/index.astro -->
---
import { PageLayout } from '@bamastro/ui';
import { region } from '@/config/region';

const seoProps = {
  title: `분당 유흥 가이드 | ${region.name} 카테고리별 완벽 정보`,
  description: "분당 가라오케, 하이퍼블릭, 셔츠룸, 호빠 등 모든 카테고리의 완벽한 가이드"
};
---

<PageLayout {...seoProps}>
  <div class="guides-intro">
    <h1>분당 유흥 완벽 가이드</h1>
    <p>카테고리별 전문 정보로 최고의 경험을 준비하세요</p>
  </div>

  <div class="guides-grid">
    {region.venueTypes.map(category => (
      <a href={`/guides/${category.id}`} class="guide-card">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </a>
    ))}
  </div>
</PageLayout>
```

### Task 5: 카테고리 메인 페이지 생성

```astro
<!-- src/pages/guides/[category].astro -->
---
import { region } from '@/config/region';

export async function getStaticPaths() {
  return region.venueTypes.map(vt => ({
    params: { category: vt.id },
    props: { category: vt }
  }));
}

const { category } = Astro.props;

const seoProps = {
  title: `분당 ${category.name} 완벽 가이드`,
  description: category.description
};
---

<PageLayout {...seoProps}>
  <h1>분당 {category.name} 완벽 가이드</h1>
  <!-- 내용은 이후 Supabase에서 fetch -->
</PageLayout>
```

### Task 6: Supabase 스키마 업데이트 (선택사항)

```sql
-- 기존 테이블에 컬럼 추가
ALTER TABLE bamastro_blog_posts
ADD COLUMN guide_category VARCHAR(50),
ADD COLUMN content_type VARCHAR(20);

-- 기존 데이터 마이그레이션
UPDATE bamastro_blog_posts
SET guide_category = 'karaoke', content_type = 'blog'
WHERE title LIKE '%가라오케%';
```

---

## 3단계: 콘텐츠 계획 (2주)

### Task 7: Pillar 글 6개 작성 계획

각 카테고리별 1개씩, 최소 3,000 단어

| 카테고리 | Pillar 글 제목 | 예상 작성 날짜 |
|---------|-------------|------------|
| 가라오케 | 분당 가라오케 완벽 가이드 | Week 1 |
| 하이퍼블릭 | 분당 하이퍼블릭 완벽 가이드 | Week 1 |
| 셔츠룸 | 분당 셔츠룸 완벽 가이드 | Week 2 |
| 호빠 | 분당 호빠 완벽 가이드 | Week 2 |
| 기모노룸 | 분당 기모노룸 완벽 가이드 | Week 2 |
| 룸살롱 | 분당 룸살롱 완벽 가이드 | Week 3 |

### Task 8: 각 Pillar당 Cluster 5개 계획

```
예: 가라오케 카테고리
1. 분당 가라오케 명소 TOP 10
2. 가라오케 에티켓 & 매너
3. 가라오케 가격 가이드
4. 가라오케 첫 방문 팁
5. 가라오케 예약 팁 & 할인

총 30개의 Cluster 글 필요 (6개 카테고리 × 5개)
```

---

## 4단계: 내부 링크 자동화 (2주)

### Task 9: 링크 컴포넌트 개발

```astro
<!-- src/components/RelatedPosts.astro -->
---
import { supabase } from '@/lib/supabase';

export interface Props {
  currentPostId: string;
  category: string;
  limit?: number;
}

const { currentPostId, category, limit = 3 } = Astro.props;

const { data: relatedPosts } = await supabase
  .from('bamastro_blog_posts')
  .select('*')
  .eq('guide_category', category)
  .neq('id', currentPostId)
  .limit(limit);
---

<div class="related-posts">
  <h3>같은 주제 더 보기</h3>
  <ul>
    {relatedPosts?.map(post => (
      <li>
        <a href={`/guides/${category}/${post.slug}`}>
          {post.title}
        </a>
      </li>
    ))}
  </ul>
</div>
```

### Task 10: 모든 글에 관련 링크 추가

```astro
<!-- src/pages/guides/[category]/[slug].astro 하단에 추가 -->
<RelatedPosts currentPostId={post.id} category={category} limit={4} />
<BackToPillar category={category} categoryName={categoryName} />
```

---

## 5단계: 모니터링 시작 (1주)

### Task 11: Google Search Console 설정

1. Google Search Console에 사이트 추가
2. /guides 섹션 추가
3. 각 카테고리별 성과 모니터링
4. 매주 리포트 확인

```
확인 항목:
- 노출 수 (Impressions)
- 평균 순위 (Average Position)
- 클릭수 (Clicks)
- CTR (클릭률)
```

### Task 12: Google Analytics 4 설정

```javascript
// src/lib/analytics.ts 생성

export function trackInternalLink(
  destination: string,
  contentType: string
) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'internal_link_click', {
      'destination_url': destination,
      'content_type': contentType,
      'event_category': 'engagement'
    });
  }
}
```

---

## 단계별 시간 투자

```
즉시 시작 (이번 주):        4-5시간
  - 파일 구조 설정: 1시간
  - 스키마 마크업: 2시간
  - 가이드 메인 페이지: 1-2시간

기초 구축 (1주):          8-10시간
  - Pillar/Cluster 페이지 틀: 3시간
  - 컴포넌트 개발: 3시간
  - 모니터링 설정: 2-4시간

콘텐츠 작성 (2-3주):      40-60시간
  - Pillar 6개 (3,000 단어 × 6): 30시간
  - Cluster 30개 (1,500 단어 × 30): 45시간

지속 관리 (월별):          8-10시간
  - 성과 분석: 2시간
  - 최적화: 4시간
  - 신규 콘텐츠: 2-4시간
```

---

## 예상 효과 (6개월)

| 지표 | 현재 | 6개월 후 | 개선율 |
|------|------|---------|-------|
| 월간 유기검색 트래픽 | 1,000 | 2,500-3,500 | 150-250% |
| 랭킹 키워드 수 | 25 | 80-120 | 220-380% |
| 평균 순위 | - | 10-20위 | - |
| 클릭률 (CTR) | 2% | 3-4% | 50-100% |
| 문의 증가 | 월 5-10건 | 월 15-25건 | 150-250% |

---

## 우선순위별 실행 로드맵

### 🔴 필수 (즉시)
1. BlogPosting 스키마 모든 글에 추가
2. Breadcrumb 스키마 추가
3. /guides 섹션 기본 구조 생성
4. 6개 Pillar 글 작성 계획

### 🟡 중요 (1개월 내)
1. 30개 Cluster 글 작성
2. 내부 링크 자동화 컴포넌트
3. LocalBusiness 스키마 추가
4. Google Search Console 설정

### 🟢 좋음 (3개월 내)
1. FAQPage 스키마 추가
2. HowTo 스키마 추가
3. 상세 성과 분석
4. 콘텐츠 최적화

---

## 빠른 체크리스트

### Week 1 목표
- [ ] 파일 구조 생성
- [ ] BlogPosting + Breadcrumb 스키마 추가
- [ ] /guides 메인 페이지 생성
- [ ] Pillar 1-2개 시작 작성

### Week 2-3 목표
- [ ] Pillar 6개 완료
- [ ] 내부 링크 컴포넌트 개발
- [ ] Cluster 글 작성 시작
- [ ] 모니터링 설정

### Month 2 목표
- [ ] Cluster 30개 완료
- [ ] 모든 글에 내부 링크 추가
- [ ] Search Console 성과 분석
- [ ] 첫 최적화 사이클

---

## 추가 리소스

### 읽어야 할 문서
1. `SEO_STRUCTURE_ANALYSIS.md` - 전체 전략
2. `SCHEMA_IMPLEMENTATION.md` - 스키마 상세 구현
3. `INTERNAL_LINKING_STRATEGY.md` - 링크 전략

### 도구 설정
1. Google Search Console: https://search.google.com/search-console
2. Google Rich Results Test: https://search.google.com/test/rich-results
3. Google Analytics 4: https://analytics.google.com

### 자주 참고할 사이트
1. Schema.org: https://schema.org
2. Google Search Central: https://developers.google.com/search

---

## 성공 지표

### 첫 달
- 모든 기존 글에 스키마 마크업 적용
- 6개 Pillar 글 게시
- Search Console에서 노출 수 증가 추적 시작

### 세 달
- 30개 Cluster 글 게시
- 유기검색 트래픽 50% 증가
- 특정 키워드에서 1-2페이지 순위 달성

### 여섯 달
- 전체 구조 완성
- 유기검색 트래픽 150-250% 증가
- 주요 카테고리 키워드 상위 10위 진입

---

## 질문이 있다면

각 단계별 상세 가이드:
- **URL 구조**: SEO_STRUCTURE_ANALYSIS.md 참고
- **스키마 구현**: SCHEMA_IMPLEMENTATION.md 참고
- **링크 전략**: INTERNAL_LINKING_STRATEGY.md 참고

---

**다음 단계**: SEO_STRUCTURE_ANALYSIS.md를 읽고 Phase 1을 시작하세요.
