/**
 * 슬러그 패턴 상세 분석
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrzeapykmyrsiqmkwjcf.supabase.co';
const supabaseKey = 'sb_publishable_PURbxvJKEEW_JSuH4NLHqQ_4QXKY71W';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeSlugPatterns() {
  console.log('=== 슬러그 패턴 상세 분석 ===\n');

  // 전체 슬러그 조회
  const { data: posts, error } = await supabase
    .from('bamastro_blog_posts')
    .select('slug, title, category')
    .order('created_at', { ascending: true });

  if (error || !posts) {
    console.error('조회 실패:', error?.message);
    return;
  }

  // 패턴 분류
  const patterns = {
    withNumber: [] as string[],        // 숫자 포함
    goodLongtail: [] as string[],      // 좋은 롱테일
    generic: [] as string[],           // 일반적
    comparison: [] as string[],        // 비교형
  };

  posts.forEach(post => {
    const slug = post.slug;

    if (/-\d+[-]?/.test(slug)) {
      patterns.withNumber.push(slug);
    } else if (slug.includes('-vs-') || slug.includes('-comparison')) {
      patterns.comparison.push(slug);
    } else if (
      slug.includes('-price') ||
      slug.includes('-tips') ||
      slug.includes('-guide') ||
      slug.includes('-best') ||
      slug.includes('-recommendation')
    ) {
      patterns.goodLongtail.push(slug);
    } else {
      patterns.generic.push(slug);
    }
  });

  console.log(`총 ${posts.length}개 슬러그 분석 완료\n`);

  console.log(`📊 패턴별 분포:`);
  console.log(`  ❌ 숫자 포함: ${patterns.withNumber.length}개`);
  console.log(`  ✅ 좋은 롱테일: ${patterns.goodLongtail.length}개`);
  console.log(`  🔄 비교형: ${patterns.comparison.length}개`);
  console.log(`  ⚪ 일반: ${patterns.generic.length}개`);

  if (patterns.withNumber.length > 0) {
    console.log('\n❌ 숫자 포함 슬러그 (수정 필요):');
    patterns.withNumber.slice(0, 10).forEach(s => console.log(`  - ${s}`));
    if (patterns.withNumber.length > 10) {
      console.log(`  ... 외 ${patterns.withNumber.length - 10}개`);
    }
  }

  console.log('\n✅ 좋은 롱테일 슬러그 예시:');
  patterns.goodLongtail.slice(0, 10).forEach(s => console.log(`  - ${s}`));

  console.log('\n🔄 비교형 슬러그 예시:');
  patterns.comparison.slice(0, 5).forEach(s => console.log(`  - ${s}`));

  // 카테고리별 슬러그 다양성 체크
  console.log('\n📁 카테고리별 슬러그 샘플:');
  const byCat: Record<string, string[]> = {};
  posts.forEach(p => {
    if (!byCat[p.category]) byCat[p.category] = [];
    if (byCat[p.category].length < 5) byCat[p.category].push(p.slug);
  });

  Object.entries(byCat).forEach(([cat, slugs]) => {
    console.log(`\n  [${cat}]`);
    slugs.forEach(s => console.log(`    - ${s}`));
  });
}

analyzeSlugPatterns().catch(console.error);
