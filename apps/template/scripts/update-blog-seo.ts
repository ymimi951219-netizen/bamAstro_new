/**
 * 블로그 SEO 업데이트 스크립트 v2
 *
 * 실행 방법:
 * 1. 미리보기: npx tsx scripts/update-blog-seo.ts
 * 2. 실제 적용: APPLY=true npx tsx scripts/update-blog-seo.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://rrzeapykmyrsiqmkwjcf.supabase.co';
const supabaseKey = 'sb_publishable_PURbxvJKEEW_JSuH4NLHqQ_4QXKY71W';

const supabase = createClient(supabaseUrl, supabaseKey);

// 카테고리별 롱테일 키워드 풀 (더 다양하게)
const LONGTAIL_KEYWORDS: Record<string, string[]> = {
  '가라오케': [
    'price-guide', 'first-visit', 'team-dinner', 'date-spot', 'late-night',
    'vip-service', 'best-facilities', 'budget-friendly', 'premium-room',
    'weekend-special', 'after-work', 'birthday-party', 'group-booking',
    'sound-system', 'song-list', 'drink-menu', 'private-room', 'karaoke-etiquette',
    'seohyeon-station', 'yatap-station', 'pangyo-area', 'beginner-tips',
    'dress-code', 'reservation-method', 'popular-songs', 'atmosphere-review',
    'corporate-event', 'friends-gathering', 'couples-night', 'solo-singing',
  ],
  '하이퍼블릭': [
    'tc-system', 'price-breakdown', 'first-timer', 'business-meeting',
    'weekend-crowd', 'weekday-quiet', 'vip-treatment', 'dress-requirements',
    'reservation-tips', 'seohyeon-best', 'yatap-hidden', 'pangyo-new',
    'atmosphere-guide', 'service-quality', 'drink-selection', 'music-vibe',
    'late-night-scene', 'early-bird', 'group-discount', 'member-benefits',
    'premium-lounge', 'casual-spot', 'trendy-place', 'classic-style',
    'newcomer-friendly', 'regular-perks', 'special-event', 'anniversary-spot',
  ],
  '룸살롱': [
    'etiquette-guide', 'price-range', 'business-hosting', 'premium-service',
    'reservation-process', 'first-time-tips', 'dress-code-strict', 'vip-room',
    'seohyeon-premium', 'yatap-classic', 'pangyo-modern', 'membership-tier',
    'service-levels', 'drink-pairing', 'atmosphere-elegant', 'private-dining',
    'corporate-hosting', 'client-entertainment', 'luxury-experience', 'exclusive-access',
    'manager-selection', 'time-extension', 'group-party', 'celebration-venue',
    'weekend-booking', 'weekday-special', 'annual-membership', 'referral-benefits',
  ],
  '호빠': [
    'solo-visit', 'ladies-night', 'price-system', 'host-selection',
    'birthday-package', 'group-booking', 'first-time-guide', 'dress-tips',
    'seohyeon-popular', 'yatap-cozy', 'pangyo-trendy', 'atmosphere-fun',
    'drink-unlimited', 'game-activities', 'photo-zone', 'karaoke-included',
    'vip-treatment', 'regular-benefits', 'event-night', 'theme-party',
    'safe-environment', 'transportation-tips', 'late-night-open', 'early-closing',
    'weekend-vibe', 'weekday-calm', 'special-occasion', 'anniversary-plan',
  ],
  '셔츠룸': [
    'casual-vibe', 'after-work-spot', 'price-value', 'dress-code-relaxed',
    'beginner-friendly', 'cozy-atmosphere', 'seohyeon-hidden', 'yatap-popular',
    'pangyo-new-spot', 'first-visit-tips', 'reservation-easy', 'group-welcome',
    'drink-variety', 'music-selection', 'private-space', 'clean-facilities',
    'friendly-service', 'comfortable-seating', 'ventilation-good', 'parking-available',
    'late-night-option', 'early-bird-discount', 'weekday-quiet', 'weekend-lively',
    'regular-discount', 'membership-perks', 'birthday-special', 'team-building',
  ],
  '기모노룸': [
    'traditional-style', 'unique-experience', 'service-premium', 'atmosphere-elegant',
    'japanese-theme', 'cultural-fusion', 'seohyeon-authentic', 'first-time-guide',
    'dress-appreciation', 'etiquette-traditional', 'tea-ceremony', 'sake-pairing',
    'photo-worthy', 'special-occasion', 'anniversary-romantic', 'vip-exclusive',
    'reservation-advance', 'group-experience', 'private-tatami', 'seasonal-menu',
  ],
};

// 지역 키워드 (슬러그에 이미 있으면 스킵)
const LOCATIONS = ['seohyeon', 'yatap', 'pangyo', 'bundang'];

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
}

interface UpdatePlan {
  id: string;
  oldSlug: string;
  newSlug: string;
  reason: string;
}

function needsUpdate(slug: string): boolean {
  // 끝에 숫자가 있거나, -숫자- 패턴이 있으면 업데이트 필요
  return /-\d+$/.test(slug) || /-\d+-/.test(slug);
}

function generateImprovedSlug(
  oldSlug: string,
  category: string,
  usedSlugs: Set<string>,
  categoryCounter: number
): string {
  // 숫자 제거
  let baseSlug = oldSlug
    .replace(/-\d+$/, '')      // 끝의 숫자 제거
    .replace(/-\d+-/g, '-')    // 중간의 숫자 제거
    .replace(/--+/g, '-')      // 중복 하이픈 제거
    .replace(/-$/, '');        // 끝 하이픈 제거

  // 카테고리별 키워드 가져오기
  const keywords = LONGTAIL_KEYWORDS[category] || LONGTAIL_KEYWORDS['가라오케'];

  // 이미 좋은 키워드가 있는지 확인
  const hasGoodKeyword = keywords.some(kw =>
    baseSlug.includes(kw.replace(/-/g, ''))
  );

  if (hasGoodKeyword && !usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  // 새 키워드 추가
  const keywordIndex = categoryCounter % keywords.length;
  const newKeyword = keywords[keywordIndex];

  // 지역이 없으면 추가
  const hasLocation = LOCATIONS.some(loc => baseSlug.includes(loc));
  const locationPrefix = hasLocation ? '' : 'bundang-';

  // 새 슬러그 생성
  let newSlug = `${locationPrefix}${baseSlug}-${newKeyword}`;

  // 중복 방지
  let counter = 1;
  let finalSlug = newSlug;
  while (usedSlugs.has(finalSlug)) {
    finalSlug = `${newSlug}-v${counter}`;
    counter++;
  }

  return finalSlug;
}

async function main() {
  const applyChanges = process.env.APPLY === 'true';

  console.log('=== 블로그 SEO 업데이트 ===\n');
  console.log(applyChanges ? '🔴 실제 적용 모드' : '🟡 미리보기 모드');
  console.log('');

  // 1. 모든 포스트 조회
  const { data: posts, error } = await supabase
    .from('bamastro_blog_posts')
    .select('id, slug, title, category, excerpt')
    .order('created_at', { ascending: true });

  if (error || !posts) {
    console.error('조회 실패:', error?.message);
    return;
  }

  console.log(`총 ${posts.length}개 포스트 분석 중...\n`);

  // 2. 업데이트 계획 수립
  const usedSlugs = new Set<string>();
  const categoryCounters: Record<string, number> = {};
  const updatePlans: UpdatePlan[] = [];
  const skipCount = { good: 0, duplicate: 0 };

  // 먼저 업데이트 불필요한 슬러그 등록
  posts.forEach(post => {
    if (!needsUpdate(post.slug)) {
      usedSlugs.add(post.slug);
      skipCount.good++;
    }
  });

  // 업데이트 필요한 것들 처리
  posts.forEach(post => {
    if (!needsUpdate(post.slug)) return;

    const category = post.category || '가라오케';
    categoryCounters[category] = (categoryCounters[category] || 0) + 1;

    const newSlug = generateImprovedSlug(
      post.slug,
      category,
      usedSlugs,
      categoryCounters[category]
    );

    usedSlugs.add(newSlug);

    updatePlans.push({
      id: post.id,
      oldSlug: post.slug,
      newSlug,
      reason: '숫자 제거 + 롱테일 키워드 추가',
    });
  });

  console.log(`📊 분석 결과:`);
  console.log(`  ✅ 이미 최적화됨: ${skipCount.good}개`);
  console.log(`  🔄 업데이트 필요: ${updatePlans.length}개\n`);

  // 3. 미리보기 출력
  console.log('=== 변경 미리보기 (처음 20개) ===\n');
  updatePlans.slice(0, 20).forEach((plan, i) => {
    console.log(`${i + 1}. ${plan.oldSlug}`);
    console.log(`   → ${plan.newSlug}`);
    console.log('');
  });

  if (updatePlans.length > 20) {
    console.log(`... 외 ${updatePlans.length - 20}개\n`);
  }

  // 4. 리다이렉트 맵 생성
  const redirects = updatePlans.map(plan => ({
    source: `/blog/${plan.oldSlug}`,
    destination: `/blog/${plan.newSlug}`,
    permanent: true,
  }));

  fs.writeFileSync(
    'scripts/redirects.json',
    JSON.stringify(redirects, null, 2)
  );
  console.log('📄 redirects.json 생성 완료\n');

  // 5. 실제 적용
  if (!applyChanges) {
    console.log('⚠️  미리보기 모드입니다.');
    console.log('실제 적용하려면: APPLY=true npx tsx scripts/update-blog-seo.ts');
    return;
  }

  console.log('=== 데이터베이스 업데이트 시작 ===\n');

  let successCount = 0;
  let errorCount = 0;

  // 배치 처리 (50개씩)
  const batchSize = 50;
  for (let i = 0; i < updatePlans.length; i += batchSize) {
    const batch = updatePlans.slice(i, i + batchSize);

    const results = await Promise.all(
      batch.map(async plan => {
        const { error } = await supabase
          .from('bamastro_blog_posts')
          .update({ slug: plan.newSlug })
          .eq('id', plan.id);

        return { plan, error };
      })
    );

    results.forEach(({ plan, error }) => {
      if (error) {
        console.error(`❌ ${plan.oldSlug}: ${error.message}`);
        errorCount++;
      } else {
        successCount++;
      }
    });

    const progress = Math.min(i + batchSize, updatePlans.length);
    console.log(`진행: ${progress}/${updatePlans.length} (${Math.round(progress / updatePlans.length * 100)}%)`);

    // Rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=== 완료 ===');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${errorCount}개`);

  if (successCount > 0) {
    console.log('\n⚠️  다음 단계:');
    console.log('1. redirects.json을 Vercel/Astro에 적용');
    console.log('2. Google Search Console에서 사이트맵 재제출');
  }
}

main().catch(console.error);
