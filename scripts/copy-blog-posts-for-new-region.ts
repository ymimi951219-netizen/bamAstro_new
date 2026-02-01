/**
 * 신규 지역 블로그 포스트 생성 스크립트
 *
 * 기능:
 * 1. 기존 지역(bundang)의 블로그 포스트 복사
 * 2. 지역명만 변경
 * 3. 6개 카테고리별 시간 차이 스케줄링 (9시, 11시, 13시, 15시, 17시, 19시 KST)
 * 4. Supabase blog-images/shared에서 최근 이미지 랜덤 배정
 *
 * 사용법:
 *   NEW_REGION=suwon APPLY=true npx tsx scripts/copy-blog-posts-for-new-region.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrzeapykmyrsiqmkwjcf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyemVhcHlrbXlyc2lxbWt3amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDI0MzIsImV4cCI6MjA4NDQ3ODQzMn0.1syiV186n8K4pJnCqMXNBR4N4fr0BHnSba5sBrtMjGk';

const supabase = createClient(supabaseUrl, supabaseKey);

// 소스 지역 (복사할 원본)
const SOURCE_REGION = 'bundang';
const SOURCE_REGION_KR = '분당';

// 지역 한글명 매핑
const REGION_KR_MAP: Record<string, string> = {
  'bundang': '분당',
  'gangnam': '강남',
  'suwon': '수원',
  'ingedong': '인계동',
};

// 카테고리 순서
const CATEGORIES = ['하이퍼블릭', '가라오케', '셔츠룸', '룸살롱', '기모노룸', '호빠'];

// 오픈 시간 (KST 기준)
const OPEN_HOURS_KST = [9, 11, 13, 15, 17, 19];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  featured: boolean;
  gradient: string;
  featured_image: string | null;
  status: string;
  region: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogImage {
  id: string;
  storage_path: string;
  alt_text: string | null;
  category: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

async function main() {
  const newRegion = process.env.NEW_REGION;
  const applyChanges = process.env.APPLY === 'true';

  if (!newRegion) {
    console.error('❌ NEW_REGION 환경변수가 필요합니다.');
    console.log('사용법: NEW_REGION=suwon APPLY=true npx tsx scripts/copy-blog-posts-for-new-region.ts');
    return;
  }

  console.log('=== 신규 지역 블로그 포스트 생성 ===\n');
  console.log(`소스 지역: ${SOURCE_REGION}`);
  console.log(`타겟 지역: ${newRegion}`);
  console.log(applyChanges ? '🔴 실제 적용 모드' : '🟡 미리보기 모드');
  console.log('');

  // 1. 소스 지역의 블로그 포스트 조회
  console.log(`1️⃣  ${SOURCE_REGION} 블로그 포스트 조회 중...`);

  const { data: sourcePosts, error: fetchError } = await supabase
    .from('bamastro_blog_posts')
    .select('*')
    .eq('region', SOURCE_REGION)
    .order('category', { ascending: true })
    .order('created_at', { ascending: true });

  if (fetchError) {
    console.error('조회 실패:', fetchError.message);
    return;
  }

  if (!sourcePosts || sourcePosts.length === 0) {
    console.error(`${SOURCE_REGION} 지역에 블로그 포스트가 없습니다.`);
    return;
  }

  console.log(`✅ ${sourcePosts.length}개 포스트 발견\n`);

  // 카테고리별 분류
  const postsByCategory: Record<string, BlogPost[]> = {};
  CATEGORIES.forEach(cat => postsByCategory[cat] = []);

  sourcePosts.forEach(post => {
    if (postsByCategory[post.category]) {
      postsByCategory[post.category].push(post);
    }
  });

  console.log('카테고리별 포스트 수:');
  CATEGORIES.forEach(cat => {
    console.log(`  ${cat}: ${postsByCategory[cat].length}개`);
  });
  console.log('');

  // 2. blog-images/shared에서 최근 이미지 목록 조회
  console.log('2️⃣  Supabase Storage에서 이미지 목록 조회 중...');

  const { data: files, error: storageError } = await supabase.storage
    .from('blog-images')
    .list('shared', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (storageError) {
    console.error('이미지 조회 실패:', storageError.message);
    return;
  }

  const imageFiles = files?.filter(f => f.name.match(/\.(jpg|jpeg|png|webp)$/i)) || [];
  console.log(`✅ ${imageFiles.length}개 이미지 발견\n`);

  const useSourceImages = imageFiles.length === 0;
  if (useSourceImages) {
    console.log('⚠️  Storage 이미지 없음 - 소스 포스트의 이미지를 그대로 사용합니다.\n');
  }

  // 3. 새 포스트 생성 준비
  console.log('3️⃣  새 포스트 생성 중...\n');

  const nowUTC = new Date();
  const nowKST = new Date(nowUTC.getTime() + 9 * 60 * 60 * 1000);

  const newPosts: any[] = [];
  let imageIndex = 0;

  // 오늘 6개 (카테고리별 1개) 즉시 오픈
  console.log('📅 오늘 오픈할 포스트 (6개):');
  CATEGORIES.forEach((category, catIndex) => {
    const sourceCatPosts = postsByCategory[category];
    if (sourceCatPosts && sourceCatPosts.length > 0) {
      const sourcePost = sourceCatPosts[0]; // 첫 번째 포스트

      // 지역명 변경 (영문 + 한글)
      const newRegionKr = REGION_KR_MAP[newRegion] || newRegion;
      const newTitle = sourcePost.title
        .replace(new RegExp(SOURCE_REGION, 'gi'), newRegion)
        .replace(new RegExp(SOURCE_REGION_KR, 'g'), newRegionKr);
      const newSlug = sourcePost.slug.replace(new RegExp(SOURCE_REGION, 'g'), newRegion);
      const newExcerpt = sourcePost.excerpt
        .replace(new RegExp(SOURCE_REGION, 'gi'), newRegion)
        .replace(new RegExp(SOURCE_REGION_KR, 'g'), newRegionKr);
      const newContent = sourcePost.content
        .replace(new RegExp(SOURCE_REGION, 'gi'), newRegion)
        .replace(new RegExp(SOURCE_REGION_KR, 'g'), newRegionKr);

      // 이미지 선택 (Storage 이미지 또는 소스 이미지)
      let featuredImage = sourcePost.featured_image; // 기본: 소스 이미지 사용
      if (!useSourceImages && imageFiles.length > 0) {
        const selectedImage = imageFiles[imageIndex % imageFiles.length];
        const imagePath = `shared/${selectedImage.name}`;
        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(imagePath);
        featuredImage = publicUrlData.publicUrl;
      }

      const publishTime = new Date(nowKST);
      publishTime.setUTCHours(OPEN_HOURS_KST[catIndex], 0, 0, 0);
      const publishUTC = new Date(publishTime.getTime() - 9 * 60 * 60 * 1000);

      newPosts.push({
        title: newTitle,
        slug: newSlug,
        excerpt: newExcerpt,
        content: newContent,
        category: sourcePost.category,
        read_time: sourcePost.read_time,
        featured: sourcePost.featured && catIndex === 0, // 첫 포스트만 featured
        gradient: sourcePost.gradient,
        featured_image: featuredImage,
        status: 'published',
        region: newRegion,
        published_at: publishUTC.toISOString(),
      });

      console.log(`  [${category}] ${OPEN_HOURS_KST[catIndex]}:00 KST - ${newTitle.substring(0, 40)}...`);
      imageIndex++;
    }
  });

  // 나머지 포스트는 스케줄링
  console.log('\n📅 스케줄링할 포스트:');
  let dayOffset = 1; // 내일부터 시작
  let slotIndex = 0;

  CATEGORIES.forEach(category => {
    const sourceCatPosts = postsByCategory[category];
    if (sourceCatPosts && sourceCatPosts.length > 1) {
      // 첫 번째는 오늘 오픈했으므로 두 번째부터
      for (let i = 1; i < sourceCatPosts.length; i++) {
        const sourcePost = sourceCatPosts[i];

        // 지역명 변경 (영문 + 한글)
        const newRegionKr = REGION_KR_MAP[newRegion] || newRegion;
        const newTitle = sourcePost.title
          .replace(new RegExp(SOURCE_REGION, 'gi'), newRegion)
          .replace(new RegExp(SOURCE_REGION_KR, 'g'), newRegionKr);
        const newSlug = sourcePost.slug.replace(new RegExp(SOURCE_REGION, 'g'), newRegion);
        const newExcerpt = sourcePost.excerpt
          .replace(new RegExp(SOURCE_REGION, 'gi'), newRegion)
          .replace(new RegExp(SOURCE_REGION_KR, 'g'), newRegionKr);
        const newContent = sourcePost.content
          .replace(new RegExp(SOURCE_REGION, 'gi'), newRegion)
          .replace(new RegExp(SOURCE_REGION_KR, 'g'), newRegionKr);

        // 이미지 선택 (Storage 이미지 또는 소스 이미지)
        let featuredImage = sourcePost.featured_image;
        if (!useSourceImages && imageFiles.length > 0) {
          const selectedImage = imageFiles[imageIndex % imageFiles.length];
          const imagePath = `shared/${selectedImage.name}`;
          const { data: publicUrlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(imagePath);
          featuredImage = publicUrlData.publicUrl;
        }

        const publishTime = new Date(nowKST);
        publishTime.setUTCHours(0, 0, 0, 0);
        publishTime.setUTCDate(publishTime.getUTCDate() + dayOffset);
        publishTime.setUTCHours(OPEN_HOURS_KST[slotIndex], 0, 0, 0);
        const publishUTC = new Date(publishTime.getTime() - 9 * 60 * 60 * 1000);

        newPosts.push({
          title: newTitle,
          slug: newSlug,
          excerpt: newExcerpt,
          content: newContent,
          category: sourcePost.category,
          read_time: sourcePost.read_time,
          featured: false,
          gradient: sourcePost.gradient,
          featured_image: featuredImage,
          status: 'published',
          region: newRegion,
          published_at: publishUTC.toISOString(),
        });

        imageIndex++;

        // 다음 슬롯
        slotIndex++;
        if (slotIndex >= OPEN_HOURS_KST.length) {
          slotIndex = 0;
          dayOffset++;
        }
      }
    }
  });

  console.log(`총 ${newPosts.length}개 포스트 생성 준비 완료`);
  console.log(`스케줄 기간: ${dayOffset}일\n`);

  // 미리보기
  console.log('=== 처음 12개 포스트 미리보기 ===');
  newPosts.slice(0, 12).forEach((post, i) => {
    const kstTime = new Date(new Date(post.published_at).getTime() + 9 * 60 * 60 * 1000);
    const kstStr = `${kstTime.getUTCMonth() + 1}/${kstTime.getUTCDate()} ${kstTime.getUTCHours()}:00`;
    console.log(`  ${i + 1}. [${post.category}] ${kstStr} KST - ${post.title.substring(0, 40)}...`);
  });
  console.log('');

  if (!applyChanges) {
    console.log('⚠️  미리보기 모드입니다.');
    console.log(`실제 적용하려면: NEW_REGION=${newRegion} APPLY=true npx tsx scripts/copy-blog-posts-for-new-region.ts`);
    return;
  }

  // 4. 실제 적용
  console.log('=== 데이터베이스에 삽입 시작 ===\n');

  let successCount = 0;
  let errorCount = 0;

  for (const post of newPosts) {
    const { error } = await supabase
      .from('bamastro_blog_posts')
      .insert([post]);

    if (error) {
      console.error(`❌ 실패: ${post.title} - ${error.message}`);
      errorCount++;
    } else {
      successCount++;
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 100));

    if (successCount % 10 === 0) {
      console.log(`진행: ${successCount}/${newPosts.length}`);
    }
  }

  console.log('\n=== 완료 ===');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${errorCount}개`);
  console.log(`\n📅 오늘 6개 즉시 오픈, 나머지 ${newPosts.length - 6}개 스케줄됨`);
}

main().catch(console.error);
