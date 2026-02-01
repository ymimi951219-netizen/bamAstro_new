# bamAstro 프로젝트 가이드

## 중요 주의사항

1. **Vercel 프로젝트는 절대 삭제하지 않는다.** 기존에 동일한 이름의 프로젝트가 있는 경우, `bamastro_` 프리픽스를 붙여서 새 프로젝트를 생성한다. (예: `bamastro_anyang`)

2. **Vercel 환경변수 설정 주의**: `echo "값" | vercel env add` 방식은 값이 잘못 저장될 수 있음.
   - **권장**: `.env` 파일 생성 후 빌드 → `vercel deploy --prebuilt --prod`
   - 환경변수가 빌드에 하드코딩되므로 Vercel 환경변수 설정 불필요

## 도메인 목록

| 지역 | 앱 이름 | 도메인 |
|------|---------|--------|
| 강남 | gangnam | high-karaoke.com |
| 분당 | bundang | hikaraoke.com |
| 동탄 | dongtan | best-karaoke.com |
| 인계동 | ingedong | public-karaoke.net |
| 수원 | suwon | public-karaoke.com |
| 평택 | pyeongtaek | korea-karaoke.com |
| 안양 | anyang | nextkaraoke.com |
| 수지 | suji | hot-karaoke.com |
| 안산 | ansan | hot-karaoke.net |
| 판교 | pangyo | new-karaoke.com |
| 성남 | seongnam | new-karaoke.net |
| 용인 | yongin | new-hipublic.com |

## 새 지역 추가 시 필수 작업

새로운 지역 사이트를 추가할 때 반드시 아래 작업을 수행하세요:

1. **이 문서 갱신**: 위 도메인 목록에 새 지역 정보 추가
2. **region.ts 설정**: `apps/{지역}/src/config/region.ts` 파일에 도메인 설정
3. **⚠️ 이미지 교체 (매우 중요!)**:
   - **partners 이미지**: `apps/{지역}/public/images/partners/partner_1~10.webp`
     - 소스: `/Users/deneb/Downloads/제목을 입력해주세요_분류완료/gallery/` 에서 랜덤 선택
     - 다른 지역과 중복되지 않는 새 이미지로 교체 필수!
   - **venues 이미지**: `apps/{지역}/public/images/venues/` 폴더 전체
     - `karaoke_main.webp`, `hyperpublic_main.webp`, `hostbar_main.webp` 등
   - **og 이미지 생성**: partners 이미지 기반으로 og-*.jpg 6개 생성
     ```bash
     cd apps/{지역}/public
     convert images/partners/partner_1.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-karaoke.jpg
     convert images/partners/partner_2.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-highpublic.jpg
     convert images/partners/partner_3.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-hostbar.jpg
     convert images/partners/partner_4.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-roomsalon.jpg
     convert images/partners/partner_5.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-shirtsroom.jpg
     convert images/partners/partner_6.webp -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 og-kimonoroom.jpg
     ```
   - **기존 이미지 복사 금지**: 템플릿/다른 지역 이미지 그대로 사용 절대 금지
4. **Vercel 환경변수 설정 (필수!)**:
   ```bash
   cd apps/{지역}
   # SUPABASE_URL 추가
   printf 'https://rrzeapykmyrsiqmkwjcf.supabase.co' | vercel env add SUPABASE_URL production
   printf 'https://rrzeapykmyrsiqmkwjcf.supabase.co' | vercel env add SUPABASE_URL preview
   printf 'https://rrzeapykmyrsiqmkwjcf.supabase.co' | vercel env add SUPABASE_URL development
   # SUPABASE_KEY 추가
   printf 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyemVhcHlrbXlyc2lxbWt3amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDI0MzIsImV4cCI6MjA4NDQ3ODQzMn0.1syiV186n8K4pJnCqMXNBR4N4fr0BHnSba5sBrtMjGk' | vercel env add SUPABASE_KEY production
   printf 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyemVhcHlrbXlyc2lxbWt3amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDI0MzIsImV4cCI6MjA4NDQ3ODQzMn0.1syiV186n8K4pJnCqMXNBR4N4fr0BHnSba5sBrtMjGk' | vercel env add SUPABASE_KEY preview
   printf 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyemVhcHlrbXlyc2lxbWt3amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDI0MzIsImV4cCI6MjA4NDQ3ODQzMn0.1syiV186n8K4pJnCqMXNBR4N4fr0BHnSba5sBrtMjGk' | vercel env add SUPABASE_KEY development
   # 확인
   vercel env ls
   ```
   > ⚠️ **중요**: SSR 모드에서 환경변수가 없으면 `supabaseUrl is required` 에러 발생!
5. **vercel.json 빌드 설정 (필수!)**:
   ```json
   {
     "framework": null,
     "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
     "buildCommand": "cd ../.. && pnpm --filter @bamastro/{지역} build",
     "headers": [...]
   }
   ```
   > ⚠️ **중요**: 이 설정 없으면 Vercel 빌드 시 `astro: command not found` 에러 발생
6. **Vercel Root Directory 설정 (필수!)**:
   ```bash
   # .vercel/project.json에서 projectId 확인 후 API 호출
   PROJECT_ID=$(cat .vercel/project.json | python3 -c "import sys,json;print(json.load(sys.stdin)['projectId'])")
   VERCEL_TOKEN=$(cat "/Users/deneb/Library/Application Support/com.vercel.cli/auth.json" | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")
   curl -X PATCH "https://api.vercel.com/v9/projects/$PROJECT_ID" \
     -H "Authorization: Bearer $VERCEL_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"rootDirectory": "apps/{지역}"}'
   ```
   > ⚠️ **중요**: monorepo 구조에서 Root Directory 미설정 시 빌드 실패
6. **pnpm-lock.yaml 업데이트 및 커밋**: 새 지역 추가 후 반드시 실행
   ```bash
   pnpm install --no-frozen-lockfile
   git add pnpm-lock.yaml
   git commit -m "chore: update pnpm-lock.yaml"
   git push
   ```
   > ⚠️ **중요**: Vercel 빌드는 `--frozen-lockfile` 사용. lock 파일이 package.json과 불일치하면 빌드 실패

## 프로젝트 구조

```
bamAstro/
├── apps/
│   ├── gangnam/      # 강남 사이트
│   ├── bundang/      # 분당 사이트
│   ├── dongtan/      # 동탄 사이트
│   ├── ingedong/     # 인계동 사이트
│   ├── suwon/        # 수원 사이트
│   ├── pyeongtaek/   # 평택 사이트
│   ├── anyang/       # 안양 사이트
│   ├── suji/         # 수지 사이트
│   ├── ansan/        # 안산 사이트
│   ├── pangyo/       # 판교 사이트
│   ├── seongnam/     # 성남 사이트
│   ├── yongin/       # 용인 사이트
│   └── template/     # 새 지역 템플릿
├── packages/
│   └── ui/           # 공통 UI 컴포넌트
└── CLAUDE.md         # 이 파일
```

## 공통 UI 컴포넌트 (packages/ui)

- `IntroSection`: region prop 필수 (지역별 이미지 표시)
- `VenuePreviewSection`: region prop 필수 (제휴 업소 6개 표시)
- `HeroSection`, `FeaturesSection`, `GallerySection` 등

## 참고 사항

- 모든 앱은 Supabase 동일 DB 사용 (bamastro_blog_posts 테이블)
- SSR 모드로 운영 (블로그 포스트 동적 로딩)
- pnpm workspace 모노레포 구조

## 블로그 포스트 주의사항

**status 필드는 반드시 'published'로 설정**:
- 블로그 코드에서 `.eq('status', 'published')` 필터링 사용
- status가 'draft'면 published_at 날짜와 상관없이 블로그에 표시 안 됨
- 새 지역 블로그 복사 시 INSERT 문에 `status = 'published'` 반드시 포함
