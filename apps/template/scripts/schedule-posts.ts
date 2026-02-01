/**
 * 블로그 포스트 스케줄링 스크립트 v3
 *
 * - 하루 6개 포스트 (카테고리별 1개)
 * - 9시, 11시, 13시, 15시, 17시, 19시 오픈 (KST)
 * - 현재 시간 기준 다음 슬롯부터 시작
 *
 * 실행: APPLY=true npx tsx scripts/schedule-posts.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrzeapykmyrsiqmkwjcf.supabase.co';
const supabaseKey = 'sb_publishable_PURbxvJKEEW_JSuH4NLHqQ_4QXKY71W';

const supabase = createClient(supabaseUrl, supabaseKey);

// 카테고리 순서 (하루에 이 순서대로 1개씩)
const CATEGORIES = ['하이퍼블릭', '가라오케', '셔츠룸', '룸살롱', '기모노룸', '호빠'];

// 오픈 시간 (KST 기준)
const OPEN_HOURS_KST = [9, 11, 13, 15, 17, 19];

interface BlogPost {
  id: string;
  category: string;
  created_at: string;
}

async function main() {
  const applyChanges = process.env.APPLY === 'true';

  console.log('=== 블로그 스케줄링 설정 v3 ===\n');
  console.log(applyChanges ? '🔴 실제 적용 모드' : '🟡 미리보기 모드');
  console.log('');

  // 현재 시간 (UTC 및 KST)
  const nowUTC = new Date();
  const nowKST = new Date(nowUTC.getTime() + 9 * 60 * 60 * 1000);

  console.log(`현재 시간 (UTC): ${nowUTC.toISOString()}`);
  console.log(`현재 시간 (KST): ${nowKST.toISOString().replace('Z', '+09:00')}`);
  console.log('');

  // 1. 모든 포스트 조회 (Supabase 기본 limit 1000 우회)
  let allPosts: BlogPost[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('bamastro_blog_posts')
      .select('id, category, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: true })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error('조회 실패:', error?.message);
      return;
    }

    if (!data || data.length === 0) break;

    allPosts = [...allPosts, ...data];
    console.log(`페이지 ${page + 1} 로드: ${data.length}개 (누적: ${allPosts.length}개)`);

    if (data.length < pageSize) break;
    page++;
  }

  const posts = allPosts;
  if (posts.length === 0) {
    console.error('포스트가 없습니다');
    return;
  }

  console.log(`총 ${posts.length}개 포스트 스케줄링 중...\n`);

  // 2. 카테고리별로 분류
  const postsByCategory: Record<string, BlogPost[]> = {};
  CATEGORIES.forEach(cat => postsByCategory[cat] = []);

  posts.forEach(post => {
    if (postsByCategory[post.category]) {
      postsByCategory[post.category].push(post);
    } else {
      postsByCategory['가라오케'].push(post);
    }
  });

  console.log('카테고리별 포스트 수:');
  CATEGORIES.forEach(cat => {
    console.log(`  ${cat}: ${postsByCategory[cat].length}개`);
  });
  console.log('');

  // 3. 스케줄 시작점 찾기
  // 현재 KST 시간 기준으로 다음 오픈 슬롯 찾기
  const currentHourKST = nowKST.getUTCHours();
  let startSlotIndex = OPEN_HOURS_KST.findIndex(h => h > currentHourKST);
  let startDayOffset = 0;

  if (startSlotIndex === -1) {
    // 오늘 슬롯 모두 지남 -> 내일 첫 슬롯부터
    startSlotIndex = 0;
    startDayOffset = 1;
  }

  console.log(`시작: ${startDayOffset === 0 ? '오늘' : '내일'} ${OPEN_HOURS_KST[startSlotIndex]}:00 KST부터`);
  console.log('');

  // 4. 스케줄 생성
  const updates: { id: string; published_at: string; day: number; hour: number; category: string }[] = [];

  const categoryIndexes: Record<string, number> = {};
  CATEGORIES.forEach(cat => categoryIndexes[cat] = 0);

  let dayOffset = startDayOffset;
  let slotIndex = startSlotIndex;
  let totalScheduled = 0;
  const totalPosts = posts.length;

  while (totalScheduled < totalPosts) {
    const category = CATEGORIES[slotIndex];
    const catPosts = postsByCategory[category];
    let catIndex = categoryIndexes[category];

    // 해당 카테고리에 포스트가 없으면 다른 카테고리에서 가져옴
    let post: BlogPost | undefined;
    let usedCategory = category;

    if (catIndex < catPosts.length) {
      post = catPosts[catIndex];
      categoryIndexes[category]++;
    } else {
      // 다른 카테고리에서 찾기
      for (const otherCat of CATEGORIES) {
        if (categoryIndexes[otherCat] < postsByCategory[otherCat].length) {
          post = postsByCategory[otherCat][categoryIndexes[otherCat]];
          usedCategory = otherCat;
          categoryIndexes[otherCat]++;
          break;
        }
      }
    }

    if (!post) break;

    const hour = OPEN_HOURS_KST[slotIndex];

    // KST 날짜/시간 생성 후 UTC로 변환
    const publishKST = new Date(nowKST);
    publishKST.setUTCHours(0, 0, 0, 0); // KST 자정
    publishKST.setUTCDate(publishKST.getUTCDate() + dayOffset);
    publishKST.setUTCHours(hour, 0, 0, 0);

    // KST -> UTC 변환 (9시간 빼기)
    const publishUTC = new Date(publishKST.getTime() - 9 * 60 * 60 * 1000);

    updates.push({
      id: post.id,
      published_at: publishUTC.toISOString(),
      day: dayOffset,
      hour,
      category: usedCategory,
    });

    totalScheduled++;

    // 다음 슬롯으로
    slotIndex++;
    if (slotIndex >= OPEN_HOURS_KST.length) {
      slotIndex = 0;
      dayOffset++;
    }

    if (dayOffset > 500) {
      console.error('안전장치: 500일 초과');
      break;
    }
  }

  console.log(`총 ${updates.length}개 포스트 스케줄 생성`);
  console.log(`필요한 일수: ${dayOffset + 1}일\n`);

  // 5. 미리보기
  const first12 = updates.slice(0, 12);
  console.log('=== 처음 12개 포스트 스케줄 ===');
  first12.forEach((u, i) => {
    const kstTime = new Date(new Date(u.published_at).getTime() + 9 * 60 * 60 * 1000);
    const kstStr = `${kstTime.getUTCMonth() + 1}/${kstTime.getUTCDate()} ${u.hour}:00`;
    console.log(`  ${i + 1}. [${u.category}] KST ${kstStr} → UTC ${u.published_at}`);
  });
  console.log('');

  // 현재 시간 이후 포스트 수 확인
  const futureCount = updates.filter(u => new Date(u.published_at) > nowUTC).length;
  const pastCount = updates.filter(u => new Date(u.published_at) <= nowUTC).length;
  console.log(`📊 현재 시간 기준:`);
  console.log(`   이미 오픈됨 (과거): ${pastCount}개`);
  console.log(`   예약됨 (미래): ${futureCount}개`);
  console.log('');

  if (!applyChanges) {
    console.log('⚠️  미리보기 모드입니다.');
    console.log('실제 적용하려면: APPLY=true npx tsx scripts/schedule-posts.ts');
    return;
  }

  // 6. 실제 적용
  console.log('=== 데이터베이스 업데이트 시작 ===\n');

  let successCount = 0;
  let errorCount = 0;

  const batchSize = 50;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    const results = await Promise.all(
      batch.map(async update => {
        const { error } = await supabase
          .from('bamastro_blog_posts')
          .update({ published_at: update.published_at })
          .eq('id', update.id);

        return { update, error };
      })
    );

    results.forEach(({ error }) => {
      if (error) errorCount++;
      else successCount++;
    });

    const progress = Math.min(i + batchSize, updates.length);
    console.log(`진행: ${progress}/${updates.length} (${Math.round(progress / updates.length * 100)}%)`);

    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=== 완료 ===');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${errorCount}개`);
  console.log(`\n📅 ${pastCount}개 즉시 오픈, ${futureCount}개 예약됨`);
}

main().catch(console.error);
