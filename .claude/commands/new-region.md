# 신규 지역 사이트 생성

**⚠️ 중요: Vercel 프로젝트는 절대 삭제하지 않는다. 기존에 동일한 이름의 프로젝트가 있으면 `bamastro_` 프리픽스를 붙여서 새 프로젝트를 생성한다. (예: `bamastro_anyang`)**

새로운 지역 사이트를 생성합니다. 아래 가이드를 따라 순차적으로 진행하세요.

---

## 📋 사전 준비 정보

먼저 사용자에게 다음 정보를 질문하세요:

| 항목 | 설명 | 예시 |
|------|------|------|
| 지역명 (한글) | 사이트에 표시될 지역명 | 강남 |
| 지역명 (영문) | 폴더명, URL 등에 사용 | gangnam |
| 도메인 | 사이트 도메인 | high-karaoke.com |
| 메인 키워드 | SEO 메인 타겟 키워드 | 강남 유흥 |
| 서브 키워드 | SEO 보조 키워드 | 강남 가라오케, 강남 하이퍼블릭 |

---

## Phase 1: 템플릿 복사 및 초기 설정

```bash
# suwon 앱을 새 지역명으로 복사
cp -r apps/suwon apps/[지역영문명]

# node_modules 및 lock 파일 제거
rm -rf apps/[지역영문명]/node_modules apps/[지역영문명]/pnpm-lock.yaml
```

---

## Phase 2: 기본 설정 파일 수정

### 2.1 package.json 수정
- 파일: `apps/[지역영문명]/package.json`
- `"name": "@bamastro/suwon"` → `"name": "@bamastro/[지역영문명]"`

### 2.2 astro.config.mjs 수정
- 파일: `apps/[지역영문명]/astro.config.mjs`
- `site: 'https://public-karaoke.com'` → `site: 'https://[새도메인]'`
- sitemap 내부 도메인 참조도 변경

---

## Phase 3: 핵심 지역 설정 (region.ts)

**파일 위치:** `apps/[지역영문명]/src/config/region.ts`

### 3.1 기본 정보 (필수)
- `id`: `'[지역영문명]'`
- `name`: `'[지역한글명]'`
- `nameEn`: `'[지역영문명대문자]'`
- `domain`: `'[도메인]'`

### 3.2 연락처 정보
- `phone`, `phoneFormatted`, `kakaoId`, `kakaoLink`, `telegramId`, `telegramLink`, `email`

### 3.3 위치 정보
- `address`: street, city, cityEn, region, regionEn
- `geo`: lat, lng

### 3.4 SEO 설정
- `landmarks`: 지역 랜드마크 배열
- `nearbyStations`: 인근 역 배열
- `seo.mainKeyword`, `seo.mainKeywords`, `seo.description`
- `seo.longTailKeywords` (10-15개)
- `seo.locationKeywords` (5-10개)

### 3.5 venueTypes slug 변경
각 업소 타입의 `slug`를 새 지역명으로 변경:
- `suwon-highpublic-guide` → `[지역]-highpublic-guide`
- `suwon-karaoke-guide` → `[지역]-karaoke-guide`
- `suwon-shirtsroom-guide` → `[지역]-shirtsroom-guide`
- 등등...

### 3.6 areaGuides 업데이트
지역 세부 가이드 slug 변경

---

## Phase 4: localContent 추가 (구글 중복 방지 - 매우 중요!)

**파일 위치:** `apps/[지역영문명]/src/config/region.ts`

```typescript
localContent: {
  areaCharacter: '[지역 특성 설명 100-150자]',
  targetCustomers: '[주요 고객층]',
  transportFeature: '[교통 특징]',
  nearbyBusiness: ['기업1', '기업2', ...],
  uniqueAdvantages: ['장점1', '장점2', '장점3'],
  recommendedTime: '[추천 시간대]',
  pricingNote: '[가격대 비교]',
  venueDescriptions: {
    highpublic: '[지역] 하이퍼블릭 특징...',
    karaoke: '[지역] 가라오케 특징...',
    shirtsroom: '[지역] 셔츠룸 특징...',
    roomsalon: '[지역] 룸살롱 특징...',
    kimonoroom: '[지역] 기모노룸 특징...',
    hostbar: '[지역] 호빠 특징...',
  },
}
```

---

## Phase 5: 페이지 파일명 변경

**파일 위치:** `apps/[지역영문명]/src/pages/`

```bash
mv suwon-station-guide.astro [지역]-station-guide.astro
mv suwon-[세부지역]-guide.astro [지역]-[세부지역]-guide.astro
```

각 페이지 내부 콘텐츠 수정:
- 제목, 설명, 본문 텍스트
- FAQ 내용
- 링크 URL

### 5.2 index.astro IntroSection region prop 확인 (필수!)

> ⚠️ **누락 시 404 오류 발생**: IntroSection에 region prop이 없으면 suwon 이미지를 참조하여 404 발생

**파일:** `apps/[지역영문명]/src/pages/index.astro`

```astro
<!-- 잘못된 예 (404 발생) -->
<IntroSection />

<!-- 올바른 예 -->
<IntroSection region={region} />
```

---

## Phase 6: SEO 파일 수정

### 6.1 robots.txt
- `apps/[지역영문명]/public/robots.txt`
- Sitemap URL 변경: `https://[새도메인]/sitemap-index.xml`

### 6.2 manifest.json
- `apps/[지역영문명]/public/manifest.json`
- `name`: `"[지역명] 유흥 가이드"`
- `short_name`: `"[지역명]"`

### 6.3 RSS 피드 설정 (필수!)

> RSS 피드는 검색엔진 색인 및 블로그 구독에 필수

**1. 의존성 추가:**
```bash
cd apps/[지역영문명]
pnpm add @astrojs/rss
```

**2. RSS 파일 생성:** `apps/[지역영문명]/src/pages/rss.xml.ts`

```typescript
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getBlogPosts } from '@/lib/supabase';
import { region } from '@/config/region';

export async function GET(context: APIContext) {
  const posts = await getBlogPosts();

  return rss({
    title: `${region.name} 유흥 가이드 | ${region.domain}`,
    description: `${region.name} 가라오케, 하이퍼블릭, 유흥 정보 블로그.`,
    site: context.site || `https://${region.domain}`,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.published_at || post.created_at),
      description: post.excerpt,
      link: `/blog/${post.slug}/`,
      categories: [post.category],
    })),
    customData: `<language>ko-KR</language>`,
  });
}
```

**3. 확인:** `https://[도메인]/rss.xml`

---

## Phase 7: 의존성 설치 및 빌드 테스트

```bash
# 루트에서 의존성 설치
pnpm install

# 빌드 테스트
pnpm --filter @bamastro/[지역영문명] build

# 개발 서버 실행
pnpm --filter @bamastro/[지역영문명] dev
```

**체크리스트:**
- [ ] 홈페이지 로딩 확인
- [ ] 각 가이드 페이지 접근 확인
- [ ] 연락처 정보 표시 확인
- [ ] SEO 메타 태그 확인
- [ ] 모바일 반응형 확인

---

## Phase 8: Vercel 배포 설정

### 8.1 vercel.json 필수 설정 (매우 중요!)

> ⚠️ **중요**: 이 설정 없으면 Vercel 빌드 시 `astro: command not found` 에러 발생!

**파일 위치**: `apps/[지역영문명]/vercel.json`

```json
{
  "framework": null,
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm --filter @bamastro/[지역영문명] build",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**핵심 설정**:
- `framework: null` - Vercel의 자동 감지 비활성화
- `installCommand` - 루트에서 pnpm workspace 설치
- `buildCommand` - 특정 앱만 빌드 (monorepo 구조)

### 8.2 Vercel 프로젝트 생성

> 프로젝트명은 `bamastro-[지역영문명]` 형식으로 통일

```bash
cd apps/[지역영문명]

# 기존 .vercel 폴더 삭제 (템플릿에서 복사된 경우)
rm -rf .vercel

# 새 프로젝트로 배포 (bamastro- 프리픽스 사용)
vercel --prod --yes --name bamastro-[지역영문명]
```

### 8.2.1 Root Directory 설정 (필수!)

> ⚠️ **매우 중요**: monorepo 구조에서 Root Directory를 설정하지 않으면 빌드가 실패할 수 있음!

프로젝트 생성 후 **Vercel API로 Root Directory 설정**:

```bash
# .vercel/project.json에서 projectId 확인
PROJECT_ID=$(cat .vercel/project.json | python3 -c "import sys,json;print(json.load(sys.stdin)['projectId'])")

# Vercel 인증 토큰 가져오기
VERCEL_TOKEN=$(cat "/Users/deneb/Library/Application Support/com.vercel.cli/auth.json" | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# Root Directory 설정 API 호출
curl -X PATCH "https://api.vercel.com/v9/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rootDirectory": "apps/[지역영문명]"}'
```

**확인**: 응답에 `"rootDirectory":"apps/[지역영문명]"` 포함되면 성공

프로젝트 생성 후 `.vercel/project.json` 수정:

```json
{
  "projectId": "[생성된_PROJECT_ID]",
  "orgId": "team_TBb1NKrIoGKgiKknFNgf5r1G",
  "projectName": "bamastro-[지역영문명]",
  "settings": {
    "framework": null,
    "installCommand": "cd ../.. && pnpm install",
    "buildCommand": "cd ../.. && pnpm --filter @bamastro/[지역영문명] build",
    "outputDirectory": "dist"
  }
}
```

### 8.3 Supabase 환경변수 설정 (필수!)

> ⚠️ **매우 중요**: 환경변수 없으면 `supabaseUrl is required` 에러로 500 발생!
>
> SSR 모드에서는 **Vercel 환경변수 설정 필수** (빌드 타임 + 런타임 모두 필요)

```bash
cd apps/[지역영문명]

# SUPABASE_URL 추가 (production, preview, development 각각)
printf 'https://rrzeapykmyrsiqmkwjcf.supabase.co' | vercel env add SUPABASE_URL production
printf 'https://rrzeapykmyrsiqmkwjcf.supabase.co' | vercel env add SUPABASE_URL preview
printf 'https://rrzeapykmyrsiqmkwjcf.supabase.co' | vercel env add SUPABASE_URL development

# SUPABASE_KEY 추가 (production, preview, development 각각)
printf 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyemVhcHlrbXlyc2lxbWt3amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDI0MzIsImV4cCI6MjA4NDQ3ODQzMn0.1syiV186n8K4pJnCqMXNBR4N4fr0BHnSba5sBrtMjGk' | vercel env add SUPABASE_KEY production
printf 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyemVhcHlrbXlyc2lxbWt3amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDI0MzIsImV4cCI6MjA4NDQ3ODQzMn0.1syiV186n8K4pJnCqMXNBR4N4fr0BHnSba5sBrtMjGk' | vercel env add SUPABASE_KEY preview
printf 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyemVhcHlrbXlyc2lxbWt3amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDI0MzIsImV4cCI6MjA4NDQ3ODQzMn0.1syiV186n8K4pJnCqMXNBR4N4fr0BHnSba5sBrtMjGk' | vercel env add SUPABASE_KEY development

# 환경변수 설정 확인
vercel env ls
# 예상 결과:
# SUPABASE_KEY  Encrypted  Development  ...
# SUPABASE_KEY  Encrypted  Preview      ...
# SUPABASE_KEY  Encrypted  Production   ...
# SUPABASE_URL  Encrypted  Production, Preview, Development  ...
```

> ⚠️ **주의**: `echo` 대신 `printf`를 사용해야 함 (echo는 줄바꿈 추가로 값이 잘못됨)

### 8.4 빌드 및 배포

```bash
# 로컬 빌드 후 배포 (prebuilt 방식)
vercel build && vercel deploy --prebuilt --prod

# 또는 Vercel 서버에서 빌드
vercel --prod --yes
```

### 8.5 도메인 연결
- Vercel → Settings → Domains
- DNS: A 레코드 `76.76.21.21`, CNAME `cname.vercel-dns.com`

---

## Phase 9: SSR 동적 라우트 prerender 설정 (중요!)

> SSR 모드에서 동적 라우트 페이지 404 에러 방지

모든 `[region]-*.astro` 파일의 frontmatter 첫 줄에 추가:

```astro
---
export const prerender = true;
---
```

**대상 파일:**
- 가이드 메인 페이지 (6개)
- FAQ 페이지 (6개)
- 비교 페이지 (3개)
- 기타 가이드 페이지 (2개)

---

## Phase 10: 이미지 설정 (필수!)

### 10.1 이미지 폴더 구조
```
apps/[지역]/public/images/
├── [지역]-highpublic-karaoke-private-room.webp  # 메인 히어로 이미지
├── venues/           # 제휴 업소 안내 섹션 (수원과 동일하게 유지)
│   ├── karaoke_main.webp, highpublic_1-6.webp
│   ├── hyperpublic_main.webp
│   └── ...
└── partners/         # 파트너 갤러리 섹션 (랜덤 이미지로 교체!)
    └── partner_1-10.webp
```

### 10.2 venues 이미지 복사 (수원 기준)
```bash
# venues는 수원에서 그대로 복사 (변경 금지)
cp -r apps/suwon/public/images/venues apps/[지역영문명]/public/images/
```

### 10.3 메인 히어로 이미지 이름 변경
```bash
mv apps/[지역영문명]/public/images/suwon-highpublic-karaoke-private-room.webp \
   apps/[지역영문명]/public/images/[지역영문명]-highpublic-karaoke-private-room.webp
```

### 10.4 partners 갤러리 랜덤 이미지 교체 (필수!)
```python
# Python 스크립트로 실행
import os, shutil, random

src_dir = "/Users/deneb/Downloads/제목을 입력해주세요_분류완료/gallery"
partners_dir = "apps/[지역영문명]/public/images/partners"

files = [f for f in os.listdir(src_dir) if f.endswith('.webp')]
random.shuffle(files)

for i, f in enumerate(files[:10], 1):
    shutil.copy2(os.path.join(src_dir, f),
                 os.path.join(partners_dir, f"partner_{i}.webp"))
```

> ⚠️ **중요**: venues 이미지는 수원과 동일하게 유지, partners 갤러리만 랜덤 교체!

### 10.5 og-home.jpg 생성 (필수!)

> og:image는 SNS 공유 시 표시되는 이미지. partners 이미지를 변환하여 사용

```bash
cd apps/[지역영문명]/public

# partners 이미지를 jpg로 변환하여 og-home.jpg 생성
sips -s format jpeg images/partners/partner_1.webp --out og-home.jpg
```

---

## Phase 11: 블로그 포스트 복사 (필수!)

> ⚠️ 블로그 포스트는 직접 생성하지 않고, **gangnam**에서 복사 후 지역명 치환 + 셔플 방식으로 생성합니다.

### 11.1 Supabase MCP로 블로그 포스트 복사

**mcp__supabase__execute_sql** 도구 사용 (project_id: `rrzeapykmyrsiqmkwjcf`)

```sql
-- 강남에서 신규 지역으로 복사 (지역명 치환 + 날짜 셔플)
-- ⚠️ 중요: status를 'published'로 반드시 설정! (안 하면 블로그에 안 보임)
INSERT INTO bamastro_blog_posts (region, category, title, slug, content, excerpt, status, created_at, featured_image)
SELECT
  '[신규지역영문]' as region,
  category,
  REPLACE(REPLACE(title, '강남', '[신규지역한글]'), 'gangnam', '[신규지역영문]') as title,
  REPLACE(REPLACE(slug, 'gangnam', '[신규지역영문]'), 'bundang', '[신규지역영문]') as slug,
  REPLACE(REPLACE(content, '강남', '[신규지역한글]'), 'gangnam', '[신규지역영문]') as content,
  REPLACE(REPLACE(excerpt, '강남', '[신규지역한글]'), 'gangnam', '[신규지역영문]') as excerpt,
  'published' as status,  -- 필수! 이게 없으면 draft로 들어가서 블로그에 안 보임
  created_at + (random() * interval '30 days') - interval '15 days' as created_at,
  featured_image
FROM bamastro_blog_posts
WHERE region = 'gangnam'
ON CONFLICT (slug) DO NOTHING;
```

### 11.2 status 확인 및 설정 (필수!)

> ⚠️ **중요**: status가 'draft'면 블로그에 안 보임! 반드시 'published'로 설정 필요

```sql
-- status 확인
SELECT status, COUNT(*)
FROM bamastro_blog_posts
WHERE region = '[신규지역영문]'
GROUP BY status;

-- status가 'draft'이면 'published'로 변경
UPDATE bamastro_blog_posts
SET status = 'published'
WHERE region = '[신규지역영문]' AND status != 'published';
```

### 11.3 미래 스케줄링 (카테고리별 6개/일) - 매우 중요!

> ⚠️ **핵심**: 모든 포스트를 미래 날짜로 설정 후, 10개만 오늘로 변경

```sql
-- 모든 포스트를 내일부터 카테고리별 6개/일로 스케줄링
WITH numbered AS (
  SELECT id, category,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY random()) as rn
  FROM bamastro_blog_posts
  WHERE region = '[신규지역영문]'
)
UPDATE bamastro_blog_posts b
SET published_at = DATE(NOW()) + INTERVAL '1 day'
    + ((n.rn - 1) / 6) * INTERVAL '1 day'  -- 6개마다 하루씩 증가
    + ((n.rn - 1) % 6) * INTERVAL '2 hours' -- 같은 날 내 2시간 간격
    + (CASE n.category
        WHEN '가라오케' THEN INTERVAL '0 minutes'
        WHEN '하이퍼블릭' THEN INTERVAL '20 minutes'
        WHEN '셔츠룸' THEN INTERVAL '40 minutes'
        WHEN '룸살롱' THEN INTERVAL '60 minutes'
        WHEN '기모노룸' THEN INTERVAL '80 minutes'
        WHEN '호빠' THEN INTERVAL '100 minutes'
       END)
FROM numbered n
WHERE b.id = n.id;
```

### 11.4 오늘 공개할 10개만 설정

```sql
-- 10개만 오늘 날짜로 변경 (즉시 공개)
UPDATE bamastro_blog_posts
SET published_at = NOW() - (random() * INTERVAL '6 hours')
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY category ORDER BY random()) as rn
    FROM bamastro_blog_posts
    WHERE region = '[신규지역영문]'
  ) sub
  WHERE rn <= 2
  LIMIT 10
);
```

### 11.5 스케줄 및 status 최종 확인 (필수!)

```sql
-- 공개/예약 상태 + status 확인
SELECT
  status,
  CASE WHEN published_at <= NOW() THEN '현재 공개' ELSE '미래 예약' END as publish_status,
  COUNT(*) as count
FROM bamastro_blog_posts
WHERE region = '[신규지역영문]'
GROUP BY status, CASE WHEN published_at <= NOW() THEN '현재 공개' ELSE '미래 예약' END
ORDER BY status, publish_status;
-- 예상: status='published', 현재 공개 10개, 미래 예약 1,070개
```

### 11.6 복사 결과 확인

```sql
-- 카테고리별 포스트 수 확인 (각 180개, 총 1,080개 예상)
SELECT region, category, COUNT(*) as count
FROM bamastro_blog_posts
WHERE region = '[신규지역영문]'
GROUP BY region, category
ORDER BY category;
```

### 11.7 블로그 이미지 할당 (필수!)

> ⚠️ **중요**: featured_image가 null이면 블로그 목록에서 이미지가 안 보임!

```sql
-- gangnam 이미지를 anyang에 랜덤 할당
WITH image_list AS (
    SELECT DISTINCT featured_image
    FROM bamastro_blog_posts
    WHERE region = 'gangnam' AND featured_image IS NOT NULL
),
new_region_posts AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY random()) as rn
    FROM bamastro_blog_posts
    WHERE region = '[신규지역영문]'
),
image_array AS (
    SELECT featured_image, ROW_NUMBER() OVER (ORDER BY random()) as img_rn
    FROM image_list
)
UPDATE bamastro_blog_posts bp
SET featured_image = (
    SELECT featured_image
    FROM image_array
    WHERE img_rn = ((nrp.rn - 1) % (SELECT COUNT(*) FROM image_list)) + 1
)
FROM new_region_posts nrp
WHERE bp.id = nrp.id;

-- 이미지 할당 확인
SELECT
    COUNT(*) as total,
    COUNT(DISTINCT featured_image) as unique_images,
    SUM(CASE WHEN featured_image IS NOT NULL THEN 1 ELSE 0 END) as with_image
FROM bamastro_blog_posts
WHERE region = '[신규지역영문]';
-- 예상: total=1080, unique_images=362, with_image=1080
```

---

## Phase 12: 검색 엔진 등록

### 12.1 Google Search Console
1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 → URL 프리픽스: `https://[도메인]`
3. 소유권 확인 (HTML 태그)
4. `region.ts`에 `seo.googleVerification` 추가 후 재배포
5. **Sitemaps 제출:**
   - `https://[도메인]/sitemap-index.xml`
6. **RSS 제출** (선택):
   - `https://[도메인]/rss.xml`

### 12.2 Naver Search Advisor
1. [Naver Search Advisor](https://searchadvisor.naver.com/) 접속
2. 사이트 등록 → 사이트 소유 확인
3. `region.ts`에 `seo.naverVerification` 추가 후 재배포
4. **사이트맵 제출:**
   - 요청 → 사이트맵 제출 → `https://[도메인]/sitemap-index.xml`
5. **RSS 제출:**
   - 요청 → RSS 제출 → `https://[도메인]/rss.xml`

---

## Phase 13: GitHub Actions Sitemap Ping 설정

> 매일 자동으로 Google에 사이트맵 ping을 보내 색인 요청

**파일:** `.github/workflows/sitemap-ping.yml`

DOMAINS 배열에 새 도메인 추가:

```yaml
DOMAINS=(
  "high-karaoke.com"      # 강남
  "hikaraoke.com"         # 분당
  "best-karaoke.com"      # 동탄
  "public-karaoke.net"    # 인계동
  "public-karaoke.com"    # 수원
  "[새도메인]"            # [지역명]
)
```

수동 실행 테스트:
- GitHub → Actions → Daily Sitemap Ping → Run workflow

---

## 🎉 완료 체크리스트

- [ ] 사이트 정상 접속
- [ ] 모든 페이지 로딩 확인
- [ ] 모바일 반응형 정상 작동
- [ ] 연락처 정보 정확성 확인
- [ ] SEO 메타 태그 정상 출력
- [ ] 블로그 페이지 정상 표시
- [ ] Google Search Console 등록 완료
- [ ] Naver Search Advisor 등록 완료
- [ ] GitHub Actions Sitemap Ping 도메인 추가
- [ ] og-home.jpg 설정 확인
- [ ] RSS 피드 정상 작동 (`/rss.xml`)
- [ ] Google Search Console 사이트맵/RSS 제출
- [ ] Naver Search Advisor 사이트맵/RSS 제출

---

## 📚 상세 참고 문서

- [NEW_REGION_CREATION_LOG.md](/Users/deneb/bamAstro/NEW_REGION_CREATION_LOG.md) - 전체 가이드 및 상세 설명
- [NEW_REGION_CREATION_TASKS.md](/Users/deneb/bamAstro/NEW_REGION_CREATION_TASKS.md) - 단계별 체크리스트

---

**작성일:** 2026-01-26
**버전:** 3.3 (Phase 6.3 RSS 피드 추가, Phase 12 검색엔진 등록 상세화)
