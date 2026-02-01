/**
 * 블로그 포스트 상태 수정 스크립트 (순수 fetch 사용)
 *
 * 실행: node fix-blog-status.mjs
 */

const SUPABASE_URL = 'https://rrzeapykmyrsiqmkwjcf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PURbxvJKEEW_JSuH4NLHqQ_4QXKY71W';
const CATEGORIES = ['하이퍼블릭', '가라오케', '셔츠룸', '룸살롱', '기모노룸', '호빠'];

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

async function fetchAllPosts() {
  let allPosts = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/bamastro_blog_posts?select=id,region,category,status,created_at&order=created_at.asc&offset=${page * pageSize}&limit=${pageSize}`;
    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!data || data.length === 0) break;

    allPosts = [...allPosts, ...data];
    console.log(`페이지 ${page + 1} 로드: ${data.length}개 (누적: ${allPosts.length}개)`);

    if (data.length < pageSize) break;
    page++;
  }

  return allPosts;
}

async function updateStatus(ids, status) {
  // 배치로 나눠서 업데이트
  const batchSize = 50;
  let success = 0;
  let error = 0;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);

    // 각 ID에 대해 개별 업데이트 (Supabase REST API 제한)
    for (const id of batch) {
      const url = `${SUPABASE_URL}/rest/v1/bamastro_blog_posts?id=eq.${id}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        success++;
      } else {
        error++;
        const errText = await res.text();
        if (error <= 3) console.error(`  에러 (${id}):`, errText);
      }
    }

    if ((i + batchSize) % 200 === 0 || i + batchSize >= ids.length) {
      console.log(`  진행: ${Math.min(i + batchSize, ids.length)}/${ids.length}`);
    }

    // Rate limit 방지
    await new Promise(r => setTimeout(r, 100));
  }

  return { success, error };
}

async function main() {
  console.log('=== 블로그 포스트 상태 수정 스크립트 ===\n');

  // 1. 전체 포스트 조회
  const allPosts = await fetchAllPosts();
  console.log(`\n총 ${allPosts.length}개 포스트\n`);

  // 2. 지역 목록 확인
  const regions = [...new Set(allPosts.map(p => p.region))];
  console.log('지역 목록:', regions.join(', '));

  // 3. 지역/카테고리별 분류
  const postsByRegionCategory = {};
  regions.forEach(region => {
    postsByRegionCategory[region] = {};
    CATEGORIES.forEach(cat => {
      postsByRegionCategory[region][cat] = [];
    });
  });

  allPosts.forEach(post => {
    if (postsByRegionCategory[post.region]?.[post.category]) {
      postsByRegionCategory[post.region][post.category].push(post);
    }
  });

  // 4. 통계 출력
  console.log('\n=== 지역/카테고리별 포스트 수 ===');
  regions.forEach(region => {
    console.log(`\n[${region}]`);
    CATEGORIES.forEach(cat => {
      const count = postsByRegionCategory[region][cat]?.length || 0;
      console.log(`  ${cat}: ${count}개`);
    });
  });

  // 5. Step 1: 전체를 draft로 변경
  console.log('\n=== Step 1: 전체 포스트를 draft로 변경 ===');
  const allIds = allPosts.map(p => p.id);
  const draftResult = await updateStatus(allIds, 'draft');
  console.log(`✅ draft 변경: ${draftResult.success}개 성공, ${draftResult.error}개 실패`);

  // 6. Step 2: 각 지역/카테고리별 첫 1개씩 published로 변경
  console.log('\n=== Step 2: 오늘 오픈할 포스트 published로 변경 ===');
  console.log('(각 지역/카테고리별 1개씩)\n');

  const todayPublished = [];

  for (const region of regions) {
    for (const category of CATEGORIES) {
      const posts = postsByRegionCategory[region][category];
      if (posts && posts.length > 0) {
        const firstPost = posts[0];
        todayPublished.push(firstPost.id);
        console.log(`  [${region}/${category}] ${firstPost.id.slice(0, 8)}...`);
      }
    }
  }

  if (todayPublished.length > 0) {
    const pubResult = await updateStatus(todayPublished, 'published');
    console.log(`\n✅ ${pubResult.success}개 포스트 published로 변경 완료`);
  }

  // 7. 최종 상태 확인
  console.log('\n=== 최종 상태 ===');
  console.log(`published: ${todayPublished.length}개`);
  console.log(`draft: ${allPosts.length - todayPublished.length}개`);
  console.log('\n완료!');
}

main().catch(console.error);
