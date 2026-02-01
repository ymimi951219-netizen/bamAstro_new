# 신규 지역 사이트 생성 태스크 체크리스트

> 이 문서는 bamAstro 프로젝트에서 새로운 지역 사이트를 생성할 때 사용하는 단계별 체크리스트입니다.
> 각 Phase를 순서대로 완료하면서 체크박스를 체크해 나가세요.

---

## 📋 사전 준비 정보

새 지역 생성 전 아래 정보를 먼저 확정하세요:

| 항목 | 설명 | 예시 | 실제 값 |
|------|------|------|--------|
| 지역명 (한글) | 사이트에 표시될 지역명 | 강남 | `_______` |
| 지역명 (영문) | 폴더명, URL 등에 사용 | gangnam | `_______` |
| 도메인 | 사이트 도메인 | high-karaoke.com | `_______` |
| 메인 키워드 | SEO 메인 타겟 키워드 | 강남 유흥 | `_______` |
| 서브 키워드 | SEO 보조 키워드 | 강남 가라오케, 강남 하이퍼블릭 | `_______` |

---

## Phase 1: 템플릿 복사 및 초기 설정

- [ ] suwon 앱을 새 지역명 폴더로 복사
  ```bash
  cp -r apps/suwon apps/[지역영문명]
  ```

- [ ] node_modules 및 pnpm-lock.yaml 제거
  ```bash
  rm -rf apps/[지역영문명]/node_modules apps/[지역영문명]/pnpm-lock.yaml
  ```

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 1](./NEW_REGION_CREATION_LOG.md#phase-1-템플릿-복사)

---

## Phase 2: package.json 수정

- [ ] `apps/[지역영문명]/package.json` 열기
- [ ] `name` 필드를 `@bamastro/[지역영문명]`으로 변경
  ```json
  {
    "name": "@bamastro/[지역영문명]"
  }
  ```

**변경 예시:**
```diff
- "name": "@bamastro/suwon",
+ "name": "@bamastro/gangnam",
```

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 2.1](./NEW_REGION_CREATION_LOG.md#21-packagejson-수정)

---

## Phase 3: astro.config.mjs 도메인 설정

- [ ] `apps/[지역영문명]/astro.config.mjs` 열기
- [ ] `site` 값을 새 도메인으로 변경
  ```diff
  - site: 'https://public-karaoke.com',
  + site: 'https://[새도메인]',
  ```

- [ ] sitemap 내부 도메인 참조 변경
  ```diff
  - if (url === 'https://public-karaoke.com/' || url.endsWith('.com/')) {
  + if (url === 'https://[새도메인]/' || url.endsWith('.com/')) {
  ```

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 2.2](./NEW_REGION_CREATION_LOG.md#22-astroconfigmjs-수정)

---

## Phase 4: region.ts 핵심 정보 수정 (1/3 - 기본정보)

**파일 위치:** `apps/[지역영문명]/src/config/region.ts`

### 4.1 기본 정보
- [ ] `id`: `'[지역영문명]'` (예: `'gangnam'`)
- [ ] `name`: `'[지역한글명]'` (예: `'강남'`)
- [ ] `nameEn`: `'[지역영문명대문자]'` (예: `'Gangnam'`)
- [ ] `domain`: `'[도메인]'` (예: `'high-karaoke.com'`)

### 4.2 연락처 정보
- [ ] `phone`: `'010-XXXX-XXXX'`
- [ ] `phoneFormatted`: `'010-XXXX-XXXX'`
- [ ] `kakaoId`: `'@아이디'`
- [ ] `kakaoLink`: `'http://qr.kakao.com/...'`
- [ ] `telegramId`: `'@아이디'`
- [ ] `telegramLink`: `'https://t.me/아이디'`
- [ ] `email`: `'email@example.com'`

### 4.3 위치 정보
- [ ] `address.street`: 주요 거리명 (예: `'강남역·역삼동 일대'`)
- [ ] `address.city`: 시/구 (예: `'강남구'`)
- [ ] `address.cityEn`: 시/구 영문 (예: `'Gangnam-gu'`)
- [ ] `address.region`: 도/광역시 (예: `'서울특별시'`)
- [ ] `address.regionEn`: 도/광역시 영문 (예: `'Seoul'`)
- [ ] `geo.lat`: 위도 (예: `37.4979`)
- [ ] `geo.lng`: 경도 (예: `127.0276`)

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 3.2](./NEW_REGION_CREATION_LOG.md#32-수정해야-할-항목들)

---

## Phase 5: region.ts SEO 설정 (2/3 - SEO)

**파일 위치:** `apps/[지역영문명]/src/config/region.ts`

### 5.1 랜드마크 및 역
- [ ] `landmarks`: 지역 랜드마크 배열 (예: `['강남역 거리', '역삼동 먹자골목', ...]`)
- [ ] `nearbyStations`: 인근 역 배열 (예: `['강남역', '역삼역', '선릉역', ...]`)

### 5.2 SEO 설정
- [ ] `seo.mainKeyword`: 메인 키워드 (예: `'강남 유흥'`)
- [ ] `seo.mainKeywords`: 메인 키워드 배열
  ```typescript
  mainKeywords: [
    '[지역명] 유흥',
    '[지역명] 가라오케',
    '[지역명] 하이퍼블릭',
    // ...
  ]
  ```
- [ ] `seo.description`: 사이트 설명 (검색결과에 표시됨)
- [ ] `seo.naverVerification`: Naver 인증 코드 (나중에 추가 가능)
- [ ] `seo.googleVerification`: Google 인증 코드 (나중에 추가 가능)

### 5.3 가격 정보
- [ ] `pricing.minRoomCharge`: 최소 룸비 (예: `180000`)
- [ ] `pricing.minTC`: 최소 TC (예: `100000`)
- [ ] `pricing.currency`: `'KRW'`

### 5.4 영업시간
- [ ] `businessHours.open`: 오픈 시간 (예: `'18:00'`)
- [ ] `businessHours.close`: 마감 시간 (예: `'06:00'`)

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 3.2](./NEW_REGION_CREATION_LOG.md#32-수정해야-할-항목들)

---

## Phase 6: region.ts venueTypes slug 변경 (3/3)

**파일 위치:** `apps/[지역영문명]/src/config/region.ts`

각 업소 타입의 `slug`를 새 지역명으로 변경:

- [ ] **하이퍼블릭**: `[지역]-highpublic-guide` (예: `gangnam-highpublic-guide`)
- [ ] **가라오케**: `[지역]-karaoke-guide`
- [ ] **셔츠룸**: `[지역]-shirtsroom-guide`
- [ ] **기모노룸**: `[지역]-kimono-room-guide`
- [ ] **룸살롱**: `[지역]-room-salon-guide`
- [ ] **호빠**: `[지역]-hostbar-guide`

### 6.1 areaGuides 업데이트
- [ ] `areaGuides` 배열의 slug를 새 지역 세부 지역으로 변경
  ```typescript
  areaGuides: [
    { slug: '[지역]-[세부지역]-guide', name: '[세부지역] 가이드' },
    // 예: { slug: 'gangnam-station-guide', name: '강남역 가이드' }
  ]
  ```

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 3.3](./NEW_REGION_CREATION_LOG.md#33-venuetypes-slug-변경-규칙)

---

## Phase 7: localContent 추가 (구글 중복 방지)

**파일 위치:** `apps/[지역영문명]/src/config/region.ts`

**왜 필요한가?** 동일 템플릿 사용 시 구글 중복 콘텐츠 필터링 방지용

### 7.1 localContent 필드 추가

```typescript
localContent: {
  // 지역 특성 설명 (50-100자)
  areaCharacter: '[지역 특성 설명...]',

  // 주요 고객층
  targetCustomers: '[주요 고객층...]',

  // 교통 특징
  transportFeature: '[교통 특징...]',

  // 주변 비즈니스 (대기업, 랜드마크)
  nearbyBusiness: ['기업1', '기업2', ...],

  // 지역만의 장점 (3-5개)
  uniqueAdvantages: [
    '장점1',
    '장점2',
    '장점3',
  ],

  // 추천 이용 시간대
  recommendedTime: '[추천 시간대...]',

  // 가격대 특징 (다른 지역과 비교)
  pricingNote: '[가격대 비교...]',

  // 업종별 특화 설명 (각 50-100자)
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

### 7.2 체크리스트
- [ ] `areaCharacter` 작성
- [ ] `targetCustomers` 작성
- [ ] `transportFeature` 작성
- [ ] `nearbyBusiness` 배열 작성 (3-5개)
- [ ] `uniqueAdvantages` 배열 작성 (3-5개)
- [ ] `recommendedTime` 작성
- [ ] `pricingNote` 작성
- [ ] `venueDescriptions.highpublic` 작성
- [ ] `venueDescriptions.karaoke` 작성
- [ ] `venueDescriptions.shirtsroom` 작성
- [ ] `venueDescriptions.roomsalon` 작성
- [ ] `venueDescriptions.kimonoroom` 작성
- [ ] `venueDescriptions.hostbar` 작성

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 9.2](./NEW_REGION_CREATION_LOG.md#92-localcontent-필드-추가)

---

## Phase 8: 페이지 파일명 변경

**파일 위치:** `apps/[지역영문명]/src/pages/`

### 8.1 파일명 변경
지역 가이드 페이지 파일들을 새 지역명으로 변경:

```bash
# 예시: suwon → gangnam
mv [이전지역]-station-guide.astro [새지역]-station-guide.astro
mv [이전지역]-area1-guide.astro [새지역]-area1-guide.astro
mv [이전지역]-area2-guide.astro [새지역]-area2-guide.astro
```

- [ ] 메인 역 가이드 페이지 파일명 변경
- [ ] 세부 지역 가이드 페이지 1 파일명 변경
- [ ] 세부 지역 가이드 페이지 2 파일명 변경
- [ ] 기타 지역 관련 페이지 파일명 변경

### 8.2 페이지 내부 콘텐츠 수정
각 페이지 파일을 열어서 다음 항목 수정:

- [ ] 페이지 제목 (title) 변경
- [ ] 메타 설명 (description) 변경
- [ ] 본문 텍스트 내 지역명 변경
- [ ] FAQ 내용 업데이트
- [ ] 이미지 경로 확인 (필요시 변경)
- [ ] 링크 URL 확인

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 4](./NEW_REGION_CREATION_LOG.md#phase-4-페이지-파일-수정)

---

## Phase 9: SEO 파일 수정 (robots.txt, manifest.json)

### 9.1 robots.txt 수정

**파일 위치:** `apps/[지역영문명]/public/robots.txt`

- [ ] Sitemap URL을 새 도메인으로 변경
  ```txt
  Sitemap: https://[새도메인]/sitemap-index.xml
  ```

### 9.2 manifest.json 수정

**파일 위치:** `apps/[지역영문명]/public/manifest.json`

- [ ] `name` 필드 변경: `"[지역명] 유흥 가이드"`
- [ ] `short_name` 필드 변경: `"[지역명]"`

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 5](./NEW_REGION_CREATION_LOG.md#phase-5-seo-파일-수정)

---

## Phase 10: 의존성 설치 및 빌드 테스트

### 10.1 의존성 설치

- [ ] 프로젝트 루트에서 pnpm install 실행
  ```bash
  pnpm install
  ```

### 10.2 빌드 테스트

- [ ] 특정 앱 빌드 실행
  ```bash
  pnpm --filter @bamastro/[지역영문명] build
  ```

- [ ] 빌드 에러 확인
  - [ ] 에러 없이 빌드 완료 확인
  - [ ] 에러 발생 시 에러 메시지 확인 및 수정

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 7](./NEW_REGION_CREATION_LOG.md#phase-7-빌드-및-테스트)

---

## Phase 11: 개발 서버 실행 및 체크리스트 확인

### 11.1 개발 서버 실행

- [ ] 개발 서버 시작
  ```bash
  pnpm --filter @bamastro/[지역영문명] dev
  ```

### 11.2 기능 체크리스트

- [ ] 홈페이지 로딩 확인 (`http://localhost:4321/`)
- [ ] 각 가이드 페이지 접근 확인
  - [ ] 하이퍼블릭 가이드
  - [ ] 가라오케 가이드
  - [ ] 셔츠룸 가이드
  - [ ] 룸살롱 가이드
  - [ ] 기모노룸 가이드 (있는 경우)
  - [ ] 호빠 가이드 (있는 경우)
- [ ] 연락처 정보 표시 확인 (전화번호, 카카오톡, 텔레그램)
- [ ] SEO 메타 태그 확인 (개발자 도구 → Elements → head)
  - [ ] title 태그
  - [ ] meta description
  - [ ] og:title, og:description
- [ ] 모바일 반응형 확인 (개발자 도구 → 모바일 뷰)

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 7.4](./NEW_REGION_CREATION_LOG.md#74-체크리스트)

---

## Phase 12: Vercel 배포 설정

### 12.1 Vercel 프로젝트 생성

- [ ] [Vercel 대시보드](https://vercel.com/dashboard) 접속
- [ ] "Add New Project" 클릭
- [ ] Git 저장소 연결
- [ ] Import 버튼 클릭

### 12.2 프로젝트 설정

- [ ] **Root Directory** 설정: `apps/[지역영문명]`
- [ ] **Framework Preset**: Astro 자동 감지 확인
- [ ] **Build Command**: 자동 설정 확인
- [ ] **Output Directory**: 자동 설정 확인
- [ ] Deploy 클릭

### 12.3 도메인 연결

- [ ] Vercel 프로젝트 → Settings → Domains
- [ ] 커스텀 도메인 추가: `[새도메인]`
- [ ] DNS 설정 안내 확인

### 12.4 DNS 설정

도메인 등록 업체(가비아, 호스팅케이알 등)에서 설정:

- [ ] **A 레코드** 추가: `76.76.21.21`
- [ ] **CNAME 레코드** 추가: `cname.vercel-dns.com`
- [ ] DNS 전파 대기 (최대 24시간)
- [ ] 도메인 접속 확인

### 12.5 pnpm Workspace 문제 해결 (중요!)

> **⚠️ 주의:** 이 프로젝트는 pnpm workspace를 사용하는 monorepo입니다.
> Vercel 기본 설정으로 배포하면 `workspace:*` 프로토콜 오류가 발생합니다.

**오류 메시지:**
```
npm error Unsupported URL Type "workspace:": workspace:*
ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE  In : No matching version found for @bamastro/ui@* inside the workspace
```

**해결 방법:**

1. `apps/[지역영문명]/vercel.json` 파일 생성 또는 수정:

```json
{
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm --filter @bamastro/[지역영문명] build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*).webp",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*).woff2",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/favicon.ico",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" },
        { "key": "Content-Type", "value": "application/manifest+json" }
      ]
    }
  ]
}
```

**핵심 설정 설명:**
- `installCommand`: 루트에서 pnpm install 실행 (workspace 의존성 해결)
- `buildCommand`: 루트에서 특정 앱만 빌드 (`--filter` 사용)
- `outputDirectory`: Astro 빌드 결과물 위치

**체크리스트:**
- [ ] vercel.json 파일 존재 확인
- [ ] `installCommand`에 `cd ../..` 포함 확인
- [ ] `buildCommand`에 `--filter @bamastro/[지역영문명]` 포함 확인
- [ ] `outputDirectory`가 `dist`로 설정 확인

### 12.6 Vercel 프레임워크 프리셋 비활성화 (필수!)

> **⚠️ Astro 프로젝트에서 커스텀 buildCommand가 무시되는 경우!**

**오류 메시지:**
```
sh: line 1: astro: command not found
Error: Command "astro build" exited with 127
```

**원인:** Vercel이 Astro를 자동 감지하여 `buildCommand`를 덮어씀

**해결 방법:**

`vercel.json`에 `"framework": null` 추가:

```json
{
  "framework": null,
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm --filter @bamastro/[지역영문명] build",
  "outputDirectory": "dist",
  ...
}
```

**체크리스트:**
- [ ] `vercel.json`에 `"framework": null` 추가됨 확인
- [ ] 변경사항 커밋 및 push

### 12.7 Root Directory 설정 확인 (중요!)

> **⚠️ Vercel 프로젝트의 Root Directory가 잘못 설정되면 빌드 실패!**

**확인 방법:**
```bash
vercel project inspect
```

**정상:** `Root Directory: apps/[지역영문명]`
**비정상:** `Root Directory: .`

**수정 방법 (API):**
```bash
curl -X PATCH "https://api.vercel.com/v9/projects/[PROJECT_ID]?teamId=[TEAM_ID]" \
  -H "Authorization: Bearer [VERCEL_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"rootDirectory": "apps/[지역영문명]"}'
```

**체크리스트:**
- [ ] `vercel project inspect` 실행
- [ ] Root Directory가 `apps/[지역영문명]`인지 확인
- [ ] 잘못된 경우 API로 수정

### 12.8 환경변수 설정 (필수!)

> **⚠️ Supabase 환경변수가 없으면 500 에러 발생!**

**에러:** `Error: supabaseUrl is required.`

**CLI로 환경변수 추가:**
```bash
cd apps/[지역영문명]

# SUPABASE_URL
echo "https://rrzeapykmyrsiqmkwjcf.supabase.co" | vercel env add SUPABASE_URL production

# SUPABASE_KEY
echo "[SUPABASE_ANON_KEY]" | vercel env add SUPABASE_KEY production

# 확인
vercel env ls
```

**재배포:**
```bash
git commit --allow-empty -m "chore: trigger redeploy with env vars"
git push
```

**체크리스트:**
- [ ] `SUPABASE_URL` 환경변수 추가됨
- [ ] `SUPABASE_KEY` 환경변수 추가됨
- [ ] `vercel env ls`로 확인
- [ ] 재배포 트리거

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 8](./NEW_REGION_CREATION_LOG.md#phase-8-배포)

---

## Phase 13: SEO 최적화 - 검색엔진 등록

### 13.1 Google Search Console 등록

- [ ] [Google Search Console](https://search.google.com/search-console) 접속
- [ ] 속성 추가 → "URL 프리픽스" 선택
- [ ] 도메인 입력: `https://[새도메인]`
- [ ] 소유권 확인 방법 선택 (HTML 태그 권장)
- [ ] 확인 코드 복사
- [ ] `region.ts`에 코드 추가:
  ```typescript
  seo: {
    googleVerification: 'YOUR_GOOGLE_VERIFICATION_CODE',
  }
  ```
- [ ] 배포 후 소유권 확인 클릭
- [ ] Sitemaps 메뉴 → `https://[도메인]/sitemap-index.xml` 제출


---

## Phase 14: SEO 최적화 - 메타태그 및 스키마 검증

### 14.1 메타태그 검증

각 주요 페이지에서 확인:

- [ ] **Title 태그** (30-60자)
  - [ ] 홈페이지
  - [ ] 가이드 페이지들
- [ ] **Meta Description** (120-160자)
  - [ ] 홈페이지
  - [ ] 가이드 페이지들
- [ ] **Keywords 밀도** (0.5-2.5%)
- [ ] **OG 태그** (소셜 미디어 공유용)
  - [ ] og:title
  - [ ] og:description
  - [ ] og:image

### 14.2 스키마 마크업 검증

[Google Rich Results Test](https://search.google.com/test/rich-results) 사용:

- [ ] **LocalBusinessSchema** 확인
- [ ] **OrganizationSchema** 확인
- [ ] **BreadcrumbSchema** 확인
- [ ] **FAQPageSchema** 확인 (FAQ 있는 페이지)
- [ ] **HowToSchema** 확인 (가이드 페이지)

### 14.3 검색 엔진 색인 모니터링

- [ ] Google Search Console → 색인 → 페이지 확인
- [ ] Naver Search Advisor → 검색 반영 현황 확인
- [ ] 주요 키워드로 검색 테스트 (1-2주 후)

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 10](./NEW_REGION_CREATION_LOG.md#phase-10-seo-최적화-완벽-가이드)

---

## 🎉 완료!

모든 Phase를 완료했다면 신규 지역 사이트가 성공적으로 생성되었습니다!

### 최종 확인 사항

- [ ] 사이트 정상 접속
- [ ] 모든 페이지 로딩 확인
- [ ] 모바일 반응형 정상 작동
- [ ] 연락처 정보 정확성 확인
- [ ] SEO 메타 태그 정상 출력
- [ ] Google Search Console 등록 완료
- [ ] Naver Search Advisor 등록 완료

---

## 📚 참고 자료

- [NEW_REGION_CREATION_LOG.md](./NEW_REGION_CREATION_LOG.md) - 전체 가이드 및 상세 설명
- [Astro 공식 문서](https://docs.astro.build/)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Google Search Console](https://search.google.com/search-console)
- [Naver Search Advisor](https://searchadvisor.naver.com/)

---

**작성일:** 2026-01-25
**버전:** 1.0

---

## Phase 16: 이미지 교체 (필수!)

> ⚠️ **매우 중요:** 신규 지역 생성 시 **반드시** 이미지를 교체해야 합니다!
> 다른 지역과 동일한 이미지를 사용하면 Google 중복 콘텐츠 필터링에 걸릴 수 있습니다.

**목적:** 지역별 고유 이미지로 교체하여 SEO 중복 방지 및 사이트 차별화

### ⚠️ 핵심 원칙: 다른 지역과 중복 금지!

> **절대 금지:** 기존 지역의 이미지를 그대로 복사하지 마세요!
> **반드시:** 갤러리 소스 폴더에서 새 이미지를 선택하여 교체하세요!

```
apps/[지역]/public/images/
├── venues/           # 제휴 업소 안내 섹션 (VenuePreviewSection)
│   ├── karaoke_main.webp, karaoke_1-6.webp
│   ├── highpublic_main.webp, highpublic_1-6.webp
│   ├── roomsalon_main.webp, roomsalon_1-5.webp
│   ├── shirts_main.webp, shirts_1-5.webp
│   ├── kimono_main.webp, kimono_1-5.webp
│   └── hostbar_main.webp
│
├── partners/         # 파트너 갤러리 섹션 (GallerySection - "다양한 스타일의 매력적인 파트너")
│   └── partner_1-10.webp
│
└── gallery/          # (선택) 소스 이미지 폴더 - partners로 복사용
    └── gallery_1-12.webp
```

**섹션별 이미지 매핑:**
| 섹션 | 폴더 | 파일 | 컴포넌트 |
|------|------|------|----------|
| 제휴 업소 안내 | `venues/` | *_main.webp, *_1-6.webp | VenuePreviewSection |
| 다양한 스타일의 매력적인 파트너 | `partners/` | partner_1-10.webp | GallerySection |

### 16.1 이미지 소스 폴더 (필수 확인!)

**갤러리 소스 폴더:**
```
/Users/deneb/Downloads/제목을 입력해주세요_분류완료/gallery/
```

- [ ] 갤러리 폴더에 최소 50개 이상의 이미지 있는지 확인
- [ ] 기존 지역에서 사용하지 않은 이미지 확인
- [ ] WebP, JPG, PNG 형식 지원
- [ ] 권장 해상도: 800-1200px

### 16.2 partners 이미지 교체 (필수! - 다른 지역과 중복 금지)

> **⚠️ 경고:** 기존 지역에서 이미지를 복사하면 안 됩니다!
> 갤러리 소스 폴더에서 **새 이미지**를 랜덤 선택하여 교체하세요!

**partners 이미지 랜덤 교체 (macOS):**
```bash
# 갤러리 소스 폴더
GALLERY="/Users/deneb/Downloads/제목을 입력해주세요_분류완료/gallery"

# 신규 지역 partners 폴더
TARGET="apps/[지역영문명]/public/images/partners"

# 랜덤으로 10개 이미지 선택 후 복사 (macOS에서 shuf 대신 awk 사용)
files=($(ls "$GALLERY"/*.{jpg,jpeg,png,webp} 2>/dev/null | awk 'BEGIN{srand()} {print rand()"\t"$0}' | sort -n | cut -f2 | head -10))

# partner_1~10.webp로 복사
for i in {1..10}; do
  cp "${files[$((i-1))]}" "$TARGET/partner_$i.webp"
done
```

**체크리스트:**
- [ ] partner_1.webp ~ partner_10.webp 10개 파일 교체 완료
- [ ] 기존 지역(gangnam, bundang 등)과 중복되지 않는지 확인
- [ ] 이미지 파일 용량 확인 (각 50-200KB 권장)

### 16.3 og-*.jpg 이미지 생성 (필수! - partners 이미지 기반)

> **중요:** og 이미지는 partners 이미지를 기반으로 생성합니다!
> partners 이미지를 먼저 교체한 후 이 단계를 진행하세요.

**ImageMagick으로 og 이미지 생성:**
```bash
cd apps/[지역영문명]/public

# partners 이미지 → og 이미지 변환 (1200x630, 소셜 미디어 최적화)
convert images/partners/partner_1.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-karaoke.jpg
convert images/partners/partner_2.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-highpublic.jpg
convert images/partners/partner_3.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-hostbar.jpg
convert images/partners/partner_4.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-roomsalon.jpg
convert images/partners/partner_5.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-shirtsroom.jpg
convert images/partners/partner_6.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-kimonoroom.jpg
```

**og 이미지 매핑:**
| 소스 이미지 | 결과 파일 | 용도 |
|------------|----------|------|
| partner_1.webp | og-karaoke.jpg | 가라오케 가이드 |
| partner_2.webp | og-highpublic.jpg | 하이퍼블릭 가이드 |
| partner_3.webp | og-hostbar.jpg | 호스트바 가이드 |
| partner_4.webp | og-roomsalon.jpg | 룸살롱 가이드 |
| partner_5.webp | og-shirtsroom.jpg | 셔츠룸 가이드 |
| partner_6.webp | og-kimonoroom.jpg | 기모노룸 가이드 |

**체크리스트:**
- [ ] ImageMagick 설치 확인 (`brew install imagemagick`)
- [ ] og-karaoke.jpg 생성 완료
- [ ] og-highpublic.jpg 생성 완료
- [ ] og-hostbar.jpg 생성 완료
- [ ] og-roomsalon.jpg 생성 완료
- [ ] og-shirtsroom.jpg 생성 완료
- [ ] og-kimonoroom.jpg 생성 완료
- [ ] 모든 og 이미지 크기 확인 (1200x630px)

### 16.4 교체 대상 이미지 목록

#### 1. venues/ - 제휴 업소 안내 섹션 (38개)

- [ ] **하이퍼블릭** (7개)
  - highpublic_1-6.webp
  - hyperpublic_main.webp

- [ ] **가라오케** (7개)
  - karaoke_1-6.webp
  - karaoke_main.webp

- [ ] **룸살롱** (7개)
  - roomsalon_1-6.webp
  - roomsalon_main.webp

- [ ] **셔츠룸** (7개)
  - shirts_1-6.webp
  - shirtsroom_main.webp

- [ ] **기모노룸** (7개)
  - kimono_1-6.webp
  - kimono_main.webp

- [ ] **호빠** (1개)
  - hostbar_main.webp

#### 2. partners/ - 파트너 갤러리 섹션 (10개)

> **"다양한 스타일의 매력적인 파트너 상시 대기"** 섹션에서 사용

- [ ] **파트너 이미지** (10개)
  - partner_1.webp ~ partner_10.webp

#### 3. 기타 이미지

- [ ] **OG 이미지** (소셜 미디어 공유용)
  - og-home.jpg (권장: 1200x630px)

- [ ] **대표 이미지**
  - [지역명]-highpublic-karaoke-private-room.webp

### 16.5 빌드 테스트

- [ ] 이미지 교체 후 빌드 테스트
  ```bash
  pnpm --filter @bamastro/[지역영문명] build
  ```

- [ ] 에러 확인
  - [ ] 빌드 에러 없음 확인
  - [ ] 이미지 경로 오류 없음 확인

### 16.6 이미지 최적화 (권장)

- [ ] **이미지 압축**
  - Squoosh (https://squoosh.app/) 사용
  - 목표: 50-200KB per 이미지

- [ ] **해상도 조정**
  - 권장: 800-1200px
  - 비율: 16:9 또는 4:3

- [ ] **WebP 변환**
  - 모든 이미지를 WebP로 변환 권장
  - 용량 절감: 25-35%



### 16.8 성능 확인

- [ ] **Lighthouse 점수 측정**
  ```bash
  # Chrome DevTools → Lighthouse
  # Performance, SEO 점수 확인
  ```

- [ ] **이미지 로딩 시간**
  - Network 탭에서 이미지 로딩 시간 확인
  - 목표: 각 이미지 < 1초

- [ ] **WebP 지원 확인**
  - 브라우저에서 WebP 형식 정상 표시 확인

### 16.9 문제 해결

**이미지가 표시되지 않을 때:**

1. **경로 확인**
   ```bash
   ls apps/[지역영문명]/public/images/venues/
   ```

2. **파일명 확인**
   - 대소문자 구분 (karaoke_1.webp ≠ Karaoke_1.webp)
   - 공백 없음
   - 특수문자 없음

3. **빌드 재시도**
   ```bash
   pnpm --filter @bamastro/[지역영문명] build
   ```

4. **캐시 삭제**
   ```bash
   rm -rf apps/[지역영문명]/.astro
   rm -rf apps/[지역영문명]/dist
   ```

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 16](./NEW_REGION_CREATION_LOG.md#phase-16-이미지-교체-인계동)

---

**작성일:** 2026-01-25
**최종 수정:** 2026-01-25
**버전:** 1.1


---

## Phase 17: 콘텐츠 차별화 (구글 중복 필터링 방지)

> **중요:** 동일 템플릿 사용 시 Google 중복 콘텐츠 필터링을 방지하기 위한 필수 단계입니다.

**목적:** 전체 지역 사이트 간 콘텐츠를 차별화하여 SEO 패널티 방지 및 검색 순위 향상

### 17.1 localContent 작성

**파일 위치:** `apps/[지역영문명]/src/config/region.ts`

**필수 필드 체크리스트:**

- [ ] **areaCharacter** (100-150자)
  - 지역 특색 강조 (예: "경기 남부 최대 상권", "IT 벤처 기업 밀집")
  - 역사/문화적 특징 언급
  - 주요 고객층 소개
  - 다른 지역 대비 강점

- [ ] **targetCustomers** (50자)
  - 주요 고객층 3-5개 나열
  - 예: "IT 스타트업 임원, 벤처 기업 대표, 판교 테크노밸리 직장인"

- [ ] **transportFeature** (50자)
  - 주요 역에서의 거리/시간
  - 환승역 정보
  - 자차 접근성 (고속도로, 주차)

- [ ] **nearbyBusiness** (5-7개 배열)
  - 주변 대기업, 공공기관
  - 대학교, 병원
  - 랜드마크, 관광지
  - 예: `['네이버', '카카오', 'NHN', '엔씨소프트']`

- [ ] **uniqueAdvantages** (4-5개 배열)
  - 지역만의 독특한 장점
  - 가격 비교 (강남/분당 대비)
  - 서비스 특징
  - 접근성, 편의성

- [ ] **recommendedTime** (30자)
  - 가장 활발한 시간대
  - 예약 권장 시기
  - 성수기/비수기 정보

- [ ] **pricingNote** (50자)
  - 가격대 특징
  - 타 지역과의 가격 비교
  - 할인/우대 정보

- [ ] **venueDescriptions** (각 80자)
  - [ ] **highpublic** - 지역 랜드마크 언급, 가격 포지셔닝
  - [ ] **karaoke** - 교통 접근성, 시설 특징, 타겟층
  - [ ] **shirtsroom** - 분위기, 주 고객층, 가성비
  - [ ] **roomsalon** - 비즈니스 특화, 서비스 수준
  - [ ] **kimonoroom** - 이색 체험, 특별한 점
  - [ ] **hostbar** - 여성 고객 안전, 서비스 특징

**품질 기준:**
- [ ] 타 지역과 중복도 30% 미만 확인
- [ ] 지역 랜드마크 3회 이상 언급
- [ ] 구체적인 가격 비교 포함 (예: "강남 대비 30% 저렴")

---

### 17.2 SEO 키워드 작성

**파일 위치:** `apps/[지역영문명]/src/config/region.ts`

#### 17.2.1 longTailKeywords (20-25개)

**카테고리별 키워드 분배:**

- [ ] **Venue + Location** (5-7개)
  - 예: "[지역]역 [업종]", "[랜드마크] 근처 [업종]"
  - "수원역 로데오거리 유흥", "팔달문 가라오케 예약"

- [ ] **Price-focused** (5-7개)
  - 예: "[지역] [업종] 가격", "[지역] 저렴한 [업종]"
  - "수원 하이퍼블릭 가격", "인계동 최저가 유흥"

- [ ] **Customer Type** (3-5개)
  - 예: "[지역] 대학생 [업종]", "[기업명] 회식"
  - "인계동 대학생 가라오케", "삼성전자 수원 회식"

- [ ] **Location-based** (3-5개)
  - 예: "[역명] 도보 [업종]", "[건물명] 인근 [업종]"
  - "수원역 도보 5분 유흥", "NC백화점 인근 하이퍼블릭"

- [ ] **Feature-based** (2-4개)
  - 예: "[지역] 당일예약 [업종]", "[지역] 24시간 [업종]"
  - "수원 당일예약 가능 가라오케", "인계동 새벽 영업"

**품질 기준:**
- [ ] 모든 키워드 한글 작성
- [ ] 타 지역과 중복도 30% 미만
- [ ] 지역 특화 키워드 40% 이상 (먹자골목, 테크노밸리 등)

#### 17.2.2 locationKeywords (10-15개)

**카테고리별 키워드:**

- [ ] **주요 역** (3-5개)
  - 예: "[지역]역", "[지역]시청역", "[세부지역]역"

- [ ] **랜드마크** (5-7개)
  - 관광지, 쇼핑몰, 공원, 먹자골목
  - 예: "수원화성", "인계동 먹자골목", "판교테크노밸리"

- [ ] **행정구역** (2-4개)
  - 동/구 이름
  - 예: "인계동", "팔달구", "강남구"

**품질 기준:**
- [ ] 지역 고유 랜드마크 포함
- [ ] 주변 역 3개 이상 포함

---

### 17.3 페이지 템플릿 업데이트 (지역별 차별화)

#### 17.3.1 Venue Guide 페이지 (6개)

**대상 파일:**
- [ ] `[region]-karaoke-guide/index.astro`
- [ ] `[region]-highpublic-guide/index.astro`
- [ ] `[region]-shirtsroom-guide.astro`
- [ ] `[region]-room-salon-guide/index.astro`
- [ ] `[region]-kimono-room-guide.astro`
- [ ] `[region]-hostbar-guide.astro`

**각 파일에 추가할 코드:**

```typescript
const localDesc = region.localContent?.venueDescriptions?.karaoke || '';

const seoProps = {
  title: `${region.name} 가라오케 예약·가격 가이드 | 프리미엄 노래방 추천`,
  description: `${region.name} 가라오케 완벽 가이드. ${localDesc} 회식·파티 맞춤 추천. 지금 예약하세요`,
  // ...
};
```

**체크리스트:**
- [ ] karaoke - `venueDescriptions.karaoke` 사용
- [ ] highpublic - `venueDescriptions.highpublic` 사용
- [ ] shirtsroom - `venueDescriptions.shirtsroom` 사용
- [ ] roomsalon - `venueDescriptions.roomsalon` 사용
- [ ] kimonoroom - `venueDescriptions.kimonoroom` 사용
- [ ] hostbar - `venueDescriptions.hostbar` 사용

---

### 17.4 HowToSchema 차별화 (선택 - Phase 3)

> **참고:** Phase 1-2에서는 region.ts만 수정. HowToSchema는 Phase 3에서 진행 가능.

**대상:** 24개 페이지 (6 venues × 4 regions)

**각 지역별 5단계 프로세스 차별화:**

- [ ] **Bundang** - IT 기업 맞춤 프로세스
  - "예약 및 IT 기업 맞춤 상담"
  - "신분당선 서현역 픽업"
  - "대형 파티룸 배정"
  - "판교 스타일 세팅"
  - "연장 및 2차 안내"

- [ ] **Gangnam** - VIP 비즈니스 프로세스
  - "VIP 비즈니스 예약"
  - "전담 매니저 배정 및 발렛파킹"
  - "VVIP 룸 입장"
  - "프리미엄 서비스"
  - "새벽 연장 및 VIP 대우"

- [ ] **Suwon** - 가성비 프로세스
  - "부담 없는 당일 예약"
  - "수원역 픽업 (선택)"
  - "다양한 룸 선택"
  - "가성비 세팅"
  - "연장 및 2차"

- [ ] **Ingedong** - 먹자골목 연계 프로세스
  - "먹자골목 연계 예약"
  - "도보 이동 또는 픽업"
  - "다양한 룸 즉시 배정"
  - "저렴한 세팅"
  - "새벽까지 연장 OK"

---

### 17.5 검증 및 빌드

#### 17.5.1 콘텐츠 고유성 체크

- [ ] **areaCharacter** 복사 후 Google 검색 → 중복 없음 확인
- [ ] **venueDescriptions** 각 항목 Google 검색 → 중복 없음 확인
- [ ] 타 지역 콘텐츠와 비교 → 중복도 30% 미만 확인

#### 17.5.2 빌드 테스트

- [ ] 빌드 명령 실행
  ```bash
  pnpm --filter @bamastro/[지역영문명] build
  ```

- [ ] 빌드 결과 확인
  - [ ] TypeScript 에러 없음
  - [ ] 빌드 성공 메시지 확인
  - [ ] dist 폴더 생성 확인

#### 17.5.3 개발 서버 확인

- [ ] 개발 서버 실행
  ```bash
  pnpm --filter @bamastro/[지역영문명] dev
  ```

- [ ] 브라우저에서 확인
  - [ ] 홈페이지 localContent 표시 확인
  - [ ] Venue 가이드 페이지 meta description 확인
  - [ ] 개발자 도구에서 meta 태그 확인

---

### 17.6 전체 지역 빌드 검증

모든 지역 사이트 동시 빌드 테스트:

```bash
pnpm --filter @bamastro/bundang build
pnpm --filter @bamastro/gangnam build
pnpm --filter @bamastro/suwon build
pnpm --filter @bamastro/ingedong build
```

- [ ] **Bundang** 빌드 성공
- [ ] **Gangnam** 빌드 성공
- [ ] **Suwon** 빌드 성공
- [ ] **Ingedong** 빌드 성공

---

### 17.7 SEO 도구 활용 (권장)

#### 17.7.1 seo-content-writer 에이전트

**용도:**
- localContent 전체 생성
- HowToSchema 단계별 프로세스 작성
- FAQ 콘텐츠 생성

**호출 방법:**
```typescript
Task tool → subagent_type: "seo-content-creation:seo-content-writer"
```

**입력 정보:**
- 지역 컨텍스트 (위치, 특성, 타겟 고객)
- 포지셔닝 (가격, 차별화 포인트)
- 참고 지역 (비교 대상)

#### 17.7.2 seo-meta-optimizer 에이전트

**용도:**
- longTailKeywords 생성
- locationKeywords 생성
- Meta descriptions 최적화

**호출 방법:**
```typescript
Task tool → subagent_type: "seo-technical-optimization:seo-meta-optimizer"
```

**입력 정보:**
- 주요 랜드마크
- 타겟 키워드
- 가격 포지셔닝

---

### 17.8 성공 지표 (배포 후 30-60일)

#### Google Search Console 모니터링

- [ ] 중복 콘텐츠 경고 0건
- [ ] 색인 페이지 수 증가 확인
- [ ] 평균 검색 순위 개선 확인

#### Analytics 지표

- [ ] Organic traffic +30-50%
- [ ] Bounce rate -10-15%
- [ ] Time on page +20-30%
- [ ] Pages per session +15-25%

---

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 17](./NEW_REGION_CREATION_LOG.md#phase-17-콘텐츠-차별화-구글-중복-필터링-방지)

**작성일:** 2026-01-25
**최종 수정:** 2026-01-25
**버전:** 1.2


---

## Phase 18: 블로그 포스트 생성 (기존 지역 복사 방식)

> **⚠️ 중요:** 블로그 포스트는 **직접 생성하지 않고**, 기존 지역(분당 등)에서 복사 후 **지역명 치환 + 발행일 셔플** 방식으로 생성합니다.

**목적:** 기존 블로그 포스트를 복사하여 지역명 치환, 발행일 랜덤 셔플로 중복 방지

---

### 18.1 Supabase MCP로 SQL 실행 (권장)

**mcp__supabase__execute_sql** 도구를 사용하여 직접 SQL 실행:

```sql
-- 기존 지역(bundang)에서 복사하여 새 지역 포스트 생성
-- [신규지역영문], [신규지역한글], [기존지역영문], [기존지역한글] 치환 필요

INSERT INTO bamastro_blog_posts (
  title, slug, excerpt, content, category,
  read_time, featured, gradient, status, region, published_at
)
SELECT
  -- 제목: 기존 지역명 → 신규 지역명 치환
  REPLACE(REPLACE(title, '[기존지역한글]', '[신규지역한글]'), '[기존지역영문]', '[신규지역영문]'),
  -- 슬러그: 지역명 치환 + 랜덤 suffix로 중복 방지
  REPLACE(slug, '[기존지역영문]', '[신규지역영문]') || '-' || SUBSTRING(gen_random_uuid()::text, 1, 6),
  -- 요약: 지역명 치환
  REPLACE(REPLACE(excerpt, '[기존지역한글]', '[신규지역한글]'), '[기존지역영문]', '[신규지역영문]'),
  -- 본문: 지역명 치환
  REPLACE(REPLACE(content, '[기존지역한글]', '[신규지역한글]'), '[기존지역영문]', '[신규지역영문]'),
  category,
  read_time,
  featured,
  gradient,
  'published',
  '[신규지역영문]',  -- 새 지역 region 값
  -- 발행일: 랜덤 오프셋으로 셔플 효과 (1~60일 전 랜덤)
  NOW() - (FLOOR(RANDOM() * 60) + 1) * INTERVAL '1 day'
FROM bamastro_blog_posts
WHERE region = '[기존지역영문]'
  AND status = 'published';
```

---

### 18.2 예시: 분당 → 동탄 복사

```sql
INSERT INTO bamastro_blog_posts (
  title, slug, excerpt, content, category,
  read_time, featured, gradient, status, region, published_at
)
SELECT
  REPLACE(REPLACE(title, '분당', '동탄'), 'bundang', 'dongtan'),
  REPLACE(slug, 'bundang', 'dongtan') || '-' || SUBSTRING(gen_random_uuid()::text, 1, 6),
  REPLACE(REPLACE(excerpt, '분당', '동탄'), 'bundang', 'dongtan'),
  REPLACE(REPLACE(content, '분당', '동탄'), 'bundang', 'dongtan'),
  category, read_time, featured, gradient,
  'published', 'dongtan',
  NOW() - (FLOOR(RANDOM() * 60) + 1) * INTERVAL '1 day'
FROM bamastro_blog_posts
WHERE region = 'bundang' AND status = 'published';
```

**지역명 매핑:**
| 영문 | 한글 |
|------|------|
| bundang | 분당 |
| gangnam | 강남 |
| suwon | 수원 |
| ingedong | 인계동 |
| dongtan | 동탄 |

---

### 18.3 복사 후 확인

```sql
-- 1. 신규 지역 포스트 수 확인
SELECT COUNT(*) FROM bamastro_blog_posts WHERE region = '[신규지역영문]';

-- 2. 카테고리별 분포 확인
SELECT category, COUNT(*)
FROM bamastro_blog_posts
WHERE region = '[신규지역영문]'
GROUP BY category;

-- 3. 샘플 포스트 확인
SELECT title, category, published_at
FROM bamastro_blog_posts
WHERE region = '[신규지역영문]'
ORDER BY published_at DESC
LIMIT 10;
```

**체크리스트:**
- [ ] 총 포스트 수 = 소스 지역과 동일 (1000개 이상)
- [ ] 각 카테고리별 포스트 수 균등 (180개 내외)
- [ ] 지역명이 올바르게 치환되었는지 확인

---

### 18.3 결과 검증

#### 18.3.1 Supabase 데이터베이스 확인

```sql
-- 1. 총 포스트 수 확인
SELECT COUNT(*) FROM bamastro_blog_posts WHERE region = '[신규지역]';

-- 2. 카테고리별 포스트 수
SELECT category, COUNT(*) 
FROM bamastro_blog_posts 
WHERE region = '[신규지역]'
GROUP BY category;

-- 3. 오늘 오픈된 포스트 확인
SELECT title, category, published_at 
FROM bamastro_blog_posts 
WHERE region = '[신규지역]'
  AND published_at <= NOW()
ORDER BY published_at DESC
LIMIT 10;

-- 4. 스케줄된 포스트 확인
SELECT COUNT(*) 
FROM bamastro_blog_posts 
WHERE region = '[신규지역]'
  AND published_at > NOW();
```

**체크리스트:**
- [ ] 총 포스트 수 = 소스 지역과 동일 (예: 784개)
- [ ] 각 카테고리별 포스트 수 균등 (130개 내외)
- [ ] 오늘 오픈된 포스트 = 6개
- [ ] 스케줄된 포스트 = 총 포스트 - 6개

#### 18.3.2 블로그 페이지 확인

**개발 서버 실행:**
```bash
pnpm --filter @bamastro/[지역영문명] dev
```

**확인 사항:**
- [ ] 블로그 목록 페이지 접속 (`http://localhost:4321/blog`)
- [ ] 6개 포스트 표시 확인 (오늘 오픈분)
- [ ] Featured 포스트 노출 확인
- [ ] 이미지 정상 로딩 확인
- [ ] 각 포스트 클릭 → 상세 페이지 정상 표시
- [ ] 지역명이 올바르게 변경되었는지 확인

#### 18.3.3 이미지 확인

- [ ] 각 포스트의 `featured_image` URL 확인
- [ ] 이미지 파일 실제 로딩 확인
- [ ] 다양한 이미지 사용 확인 (중복 최소화)

---

### 18.4 스케줄링 조정 (선택 사항)

스케줄을 재설정하려면:

```bash
cd apps/[지역영문명]
APPLY=true npx tsx scripts/schedule-posts.ts
```

**주의:** 이 명령은 기존 `published_at` 값을 모두 재설정합니다.

---

### 18.5 문제 해결

#### 포스트가 표시되지 않을 때

**원인 1: published_at이 미래**
```sql
UPDATE bamastro_blog_posts
SET published_at = NOW()
WHERE region = '[지역]' AND id = '[포스트ID]';
```

**원인 2: status가 draft**
```sql
UPDATE bamastro_blog_posts
SET status = 'published'
WHERE region = '[지역]' AND status != 'published';
```

**원인 3: region 필드 불일치**
- `apps/[지역]/src/config/region.ts`에서 `id` 확인
- Supabase의 `region` 필드와 일치하는지 확인

#### 이미지가 표시되지 않을 때

**원인 1: Storage Public Access**
- Supabase Dashboard → Storage → `bamastro-blog`
- Public access 활성화 확인

**원인 2: 잘못된 경로**
- `featured_image` URL 확인
- 형식: `https://[supabase-url]/storage/v1/object/public/bamastro-blog/blog-images/shared/[filename]`

---

### 18.6 배포 후 확인

#### Vercel 배포 후

- [ ] 프로덕션 URL 접속
- [ ] 블로그 목록 페이지 확인
- [ ] SSR 동작 확인 (시간이 지나면 포스트 자동 노출)
- [ ] 모바일 반응형 확인

#### SEO 확인

- [ ] Google Search Console에 블로그 페이지 등록
  - 사이트맵: `https://[도메인]/sitemap-index.xml`
- [ ] 메타 태그 확인 (title, description, og:image)
- [ ] Schema.org 마크업 확인

---

### 18.7 자동화 스케줄 (선택 사항)

Vercel Cron을 사용하여 자동 발행:

**파일 생성:** `apps/[지역]/api/cron/publish-scheduled-posts.ts`

```typescript
import { supabase } from '@/lib/supabase';

export default async function handler(req: Request) {
  // Cron secret 확인
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 스케줄된 포스트를 published로 변경 로직
  // (이미 published_at 기반 필터링으로 자동 노출되므로 불필요)

  return new Response('OK', { status: 200 });
}
```

**vercel.json 추가:**
```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled-posts",
      "schedule": "0 */2 * * *"
    }
  ]
}
```

---

### 18.8 성공 지표

#### 즉시 확인 (배포 후 1일)
- [ ] 블로그 페이지 6개 포스트 표시
- [ ] 이미지 정상 로딩
- [ ] 모바일 반응형 정상 작동
- [ ] 검색엔진 크롤링 확인 (robots.txt)

#### 1주일 후
- [ ] 블로그 페이지 방문자 수 확인 (Vercel Analytics)
- [ ] 평균 세션 시간 확인
- [ ] Bounce rate 확인
- [ ] Google Search Console 색인 페이지 수 확인

#### 1개월 후
- [ ] 블로그 포스트 검색 순위 확인
- [ ] Organic traffic 증가율 확인
- [ ] 블로그 → 가이드 페이지 전환율 확인
- [ ] 사용자 참여도 (댓글, 공유) 확인

---

### 18.9 RLS 우회: Supabase MCP로 직접 삽입 (권장)

> **중요:** 스크립트 실행 시 RLS(Row Level Security) 정책으로 인해 삽입이 실패할 수 있습니다.
> 이 경우 Supabase MCP 도구를 사용하여 직접 SQL로 삽입합니다.

**Supabase MCP SQL 삽입 명령:**

```sql
-- 신규 지역 블로그 포스트 일괄 생성 (bundang → [신규지역])
INSERT INTO bamastro_blog_posts (title, slug, excerpt, content, category, read_time, featured, gradient, featured_image, status, region, published_at)
SELECT
  REPLACE(REPLACE(title, 'bundang', '[신규지역영문]'), '분당', '[신규지역한글]'),
  REPLACE(slug, 'bundang', '[신규지역영문]') || '-' || SUBSTRING(gen_random_uuid()::text, 1, 8),
  REPLACE(REPLACE(excerpt, 'bundang', '[신규지역영문]'), '분당', '[신규지역한글]'),
  REPLACE(REPLACE(content, 'bundang', '[신규지역영문]'), '분당', '[신규지역한글]'),
  category,
  read_time,
  CASE WHEN row_number() OVER (PARTITION BY category ORDER BY created_at) = 1 THEN true ELSE false END,
  gradient,
  featured_image,
  status,
  '[신규지역영문]' as region,
  CASE
    WHEN row_number() OVER (ORDER BY created_at) <= 6 THEN NOW()
    ELSE NOW() + ((row_number() OVER (ORDER BY created_at) - 6) * INTERVAL '4 hours')
  END as published_at
FROM bamastro_blog_posts
WHERE region = 'bundang'
ORDER BY created_at;
```

**지역명 매핑:**
| 영문 | 한글 |
|------|------|
| bundang | 분당 |
| gangnam | 강남 |
| suwon | 수원 |
| ingedong | 인계동 |

**체크리스트:**
- [ ] Supabase MCP 도구 사용 (`mcp__supabase__execute_sql`)
- [ ] project_id: `rrzeapykmyrsiqmkwjcf`
- [ ] 삽입 후 포스트 수 확인

---

### 18.10 이미지 랜덤 재배치 (전체 지역)

> **중요:** 모든 지역이 동일한 이미지를 사용하면 중복 콘텐츠로 인식될 수 있습니다.
> Storage의 모든 이미지(375개)를 사용하여 랜덤 재배치합니다.

**Storage 이미지 개수 확인:**
```sql
SELECT COUNT(*) as total_images
FROM storage.objects
WHERE bucket_id = 'blog-images'
AND name LIKE 'shared/%.webp';
-- 결과: 375개
```

**전체 지역 이미지 랜덤 재배치:**
```sql
WITH all_images AS (
  SELECT
    'https://rrzeapykmyrsiqmkwjcf.supabase.co/storage/v1/object/public/blog-images/' || name as image_url,
    ROW_NUMBER() OVER (ORDER BY random()) as img_num
  FROM storage.objects
  WHERE bucket_id = 'blog-images'
  AND name LIKE 'shared/%.webp'
),
posts_numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY random()) as post_num
  FROM bamastro_blog_posts
)
UPDATE bamastro_blog_posts bp
SET featured_image = (
  SELECT image_url
  FROM all_images
  WHERE img_num = ((
    SELECT post_num FROM posts_numbered WHERE posts_numbered.id = bp.id
  ) % (SELECT COUNT(*) FROM all_images)) + 1
);
```

**결과 확인:**
```sql
SELECT COUNT(DISTINCT featured_image) as unique_images FROM bamastro_blog_posts;
-- 결과: 375개
```

**체크리스트:**
- [ ] Storage 이미지 개수 확인 (375개 이상)
- [ ] 랜덤 재배치 SQL 실행
- [ ] 재배치 결과 확인 (375개 고유 이미지 사용)

---

### 18.11 공개 날짜 지역별 셔플 (중복 방지)

> **중요:** 같은 날 모든 지역에서 같은 내용의 포스트가 공개되면 중복 콘텐츠 문제 발생.
> 각 지역별로 published_at을 랜덤 셔플하여 같은 날 다른 포스트가 공개되도록 합니다.

**공개 날짜 지역별 랜덤 셔플:**
```sql
WITH shuffled_dates AS (
  SELECT
    id,
    region,
    ROW_NUMBER() OVER (PARTITION BY region ORDER BY random()) as new_order
  FROM bamastro_blog_posts
),
region_dates AS (
  SELECT
    region,
    published_at,
    ROW_NUMBER() OVER (PARTITION BY region ORDER BY published_at) as date_order
  FROM bamastro_blog_posts
)
UPDATE bamastro_blog_posts bp
SET published_at = (
  SELECT rd.published_at
  FROM region_dates rd
  JOIN shuffled_dates sd ON sd.id = bp.id
  WHERE rd.region = bp.region
  AND rd.date_order = sd.new_order
);
```

**결과 확인:**
```sql
-- 각 지역별 오늘 공개된 포스트 비교 (서로 다른지 확인)
SELECT region, title
FROM bamastro_blog_posts
WHERE published_at <= NOW()
AND published_at >= NOW() - INTERVAL '1 day'
ORDER BY region, published_at
LIMIT 20;
```

**체크리스트:**
- [ ] 셔플 SQL 실행
- [ ] 각 지역별 오늘 공개 포스트가 서로 다른지 확인
- [ ] 브라우저에서 각 지역 블로그 페이지 확인

---

## Phase 12.9: SSR 동적 라우트 prerender 설정

> **⚠️ SSR 모드에서 동적 라우트 페이지 404 에러 발생 시 이 항목 확인!**

SSR 모드(`output: 'server'`)에서는 `getStaticPaths()`가 기본적으로 무시됨.
동적 라우트 페이지가 빌드 시 정적으로 생성되려면 `export const prerender = true;` 필수.

### 적용 위치

모든 `[region]-*.astro` 파일의 frontmatter 첫 줄에 추가:

```astro
---
export const prerender = true;

import { PageLayout, ... } from '@bamastro/ui';
// ...
---
```

### 체크리스트

**가이드 메인 페이지 (6개):**
- [ ] `[region]-karaoke-guide/index.astro`
- [ ] `[region]-highpublic-guide/index.astro`
- [ ] `[region]-room-salon-guide/index.astro`
- [ ] `[region]-shirtsroom-guide.astro`
- [ ] `[region]-kimono-room-guide.astro`
- [ ] `[region]-hostbar-guide.astro`

**FAQ 페이지 (6개):**
- [ ] `[region]-karaoke-guide/faq.astro`
- [ ] `[region]-highpublic-guide/faq.astro`
- [ ] `[region]-room-salon-guide/faq.astro`
- [ ] `[region]-shirtsroom-guide/faq.astro`
- [ ] `[region]-kimono-room-guide/faq.astro`
- [ ] `[region]-hostbar-guide/faq.astro`

**비교 페이지 (3개):**
- [ ] `[region]-karaoke-vs-highpublic.astro`
- [ ] `[region]-roomsalon-vs-hostbar.astro`
- [ ] `[region]-shirtsroom-vs-kimonoroom.astro`

**기타 (2개):**
- [ ] `[region]-entertainment-beginner-guide.astro`
- [ ] `[region]-entertainment-price-guide.astro`

### 검증

```bash
pnpm --filter @bamastro/[지역명] build
```

빌드 로그에서 "prerendering static routes" 섹션 확인:
```
 prerendering static routes
▶ src/pages/[region]-karaoke-guide/index.astro
  └─ /[지역ID]-karaoke-guide/index.html (+3ms)
```

---

**참고 문서:** [NEW_REGION_CREATION_LOG.md - Phase 8.9](./NEW_REGION_CREATION_LOG.md#phase-89-ssr-모드-동적-라우트-prerender-설정-2026-01-25-추가)

**스크립트 위치:** `/Users/deneb/bamAstro/scripts/copy-blog-posts-for-new-region.ts`

**작성일:** 2026-01-25
**최종 수정:** 2026-01-25
**버전:** 1.2

