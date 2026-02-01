-- =====================================================
-- 블로그 포스트 매일 자동 오픈 스케줄러
-- Supabase SQL Editor에서 실행
-- =====================================================

-- 1. pg_cron 확장 활성화 (Supabase에서 기본 제공)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. 매일 오픈할 포스트를 published로 변경하는 함수
CREATE OR REPLACE FUNCTION publish_daily_posts()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_regions TEXT[] := ARRAY['suwon', 'gangnam', 'bundang'];
    v_categories TEXT[] := ARRAY['하이퍼블릭', '가라오케', '셔츠룸', '룸살롱', '기모노룸', '호빠'];
    v_region TEXT;
    v_category TEXT;
    v_post_id UUID;
    v_published_count INT := 0;
    v_result jsonb := '[]'::jsonb;
BEGIN
    -- 각 지역/카테고리 조합별로 1개씩 published로 변경
    FOREACH v_region IN ARRAY v_regions LOOP
        FOREACH v_category IN ARRAY v_categories LOOP
            -- 해당 지역/카테고리에서 draft인 가장 오래된 포스트 1개 선택
            SELECT id INTO v_post_id
            FROM bamastro_blog_posts
            WHERE region = v_region
              AND category = v_category
              AND status = 'draft'
            ORDER BY created_at ASC
            LIMIT 1;

            -- 포스트가 있으면 published로 변경
            IF v_post_id IS NOT NULL THEN
                UPDATE bamastro_blog_posts
                SET status = 'published',
                    published_at = NOW()
                WHERE id = v_post_id;

                v_published_count := v_published_count + 1;

                -- 결과에 추가
                v_result := v_result || jsonb_build_object(
                    'region', v_region,
                    'category', v_category,
                    'post_id', v_post_id
                );
            END IF;
        END LOOP;
    END LOOP;

    -- 로그 테이블에 기록 (선택사항)
    INSERT INTO bamastro_publish_logs (published_count, details, created_at)
    VALUES (v_published_count, v_result, NOW())
    ON CONFLICT DO NOTHING;

    RETURN jsonb_build_object(
        'success', true,
        'published_count', v_published_count,
        'posts', v_result,
        'executed_at', NOW()
    );
END;
$$;

-- 3. 로그 테이블 생성 (실행 기록용)
CREATE TABLE IF NOT EXISTS bamastro_publish_logs (
    id SERIAL PRIMARY KEY,
    published_count INT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 매일 오전 9시 (KST = UTC+9, 즉 UTC 0시)에 실행하는 크론잡 등록
-- Supabase pg_cron은 UTC 기준입니다
SELECT cron.schedule(
    'daily-blog-publish',           -- 잡 이름
    '0 0 * * *',                    -- 매일 UTC 0시 = KST 9시
    $$SELECT publish_daily_posts()$$
);

-- 5. 크론잡 확인
SELECT * FROM cron.job;

-- =====================================================
-- 수동 테스트 (필요시)
-- =====================================================
-- SELECT publish_daily_posts();

-- =====================================================
-- 크론잡 삭제 (필요시)
-- =====================================================
-- SELECT cron.unschedule('daily-blog-publish');

-- =====================================================
-- 현재 상태 확인 쿼리
-- =====================================================
-- 상태별 개수
-- SELECT status, COUNT(*) FROM bamastro_blog_posts GROUP BY status;

-- 지역/카테고리별 draft 개수
-- SELECT region, category, COUNT(*)
-- FROM bamastro_blog_posts
-- WHERE status = 'draft'
-- GROUP BY region, category
-- ORDER BY region, category;

-- 실행 로그 확인
-- SELECT * FROM bamastro_publish_logs ORDER BY created_at DESC LIMIT 10;
