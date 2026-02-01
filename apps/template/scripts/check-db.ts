/**
 * DB 구조 및 샘플 데이터 확인 스크립트
 *
 * 실행: npx tsx scripts/check-db.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrzeapykmyrsiqmkwjcf.supabase.co';
const supabaseKey = 'sb_publishable_PURbxvJKEEW_JSuH4NLHqQ_4QXKY71W';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('=== 데이터베이스 확인 ===\n');

  // 1. 테이블 존재 확인 및 샘플 데이터 조회
  const { data: posts, error } = await supabase
    .from('bamastro_blog_posts')
    .select('id, slug, title, category, excerpt')
    .limit(5);

  if (error) {
    console.error('테이블 조회 실패:', error.message);
    return;
  }

  console.log(`샘플 포스트 ${posts?.length || 0}개:\n`);

  posts?.forEach((post, i) => {
    console.log(`${i + 1}. [${post.category}] ${post.title}`);
    console.log(`   슬러그: ${post.slug}`);
    console.log(`   요약: ${post.excerpt?.substring(0, 50)}...`);
    console.log('');
  });

  // 2. 전체 개수 확인
  const { count } = await supabase
    .from('bamastro_blog_posts')
    .select('*', { count: 'exact', head: true });

  console.log(`\n총 포스트 수: ${count}개`);

  // 3. 카테고리별 분포
  const { data: categories } = await supabase
    .from('bamastro_blog_posts')
    .select('category');

  if (categories) {
    const categoryCount: Record<string, number> = {};
    categories.forEach(c => {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });

    console.log('\n카테고리별 분포:');
    Object.entries(categoryCount).forEach(([cat, cnt]) => {
      console.log(`  ${cat}: ${cnt}개`);
    });
  }

  // 4. 슬러그 패턴 분석
  console.log('\n슬러그 패턴 분석:');
  const slugPatterns = {
    withNumber: 0,
    withoutNumber: 0,
    examples: [] as string[],
  };

  posts?.forEach(post => {
    if (/-\d+/.test(post.slug)) {
      slugPatterns.withNumber++;
      if (slugPatterns.examples.length < 3) {
        slugPatterns.examples.push(post.slug);
      }
    } else {
      slugPatterns.withoutNumber++;
    }
  });

  console.log(`  숫자 포함 슬러그: ${slugPatterns.withNumber}개`);
  console.log(`  숫자 없는 슬러그: ${slugPatterns.withoutNumber}개`);
  console.log(`  예시: ${slugPatterns.examples.join(', ')}`);
}

checkDatabase().catch(console.error);
