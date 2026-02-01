-- Blog Posts Table for BamAstro
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/rrzeapykmyrsiqmkwjcf/sql

CREATE TABLE IF NOT EXISTS bamastro_blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '5분',
  featured BOOLEAN DEFAULT FALSE,
  gradient TEXT DEFAULT 'from-purple-600 to-indigo-600',
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bamastro_blog_posts_slug ON bamastro_blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_bamastro_blog_posts_published ON bamastro_blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_bamastro_blog_posts_featured ON bamastro_blog_posts(featured);

-- Enable Row Level Security
ALTER TABLE bamastro_blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published posts
CREATE POLICY "Public can read published posts" ON bamastro_blog_posts
  FOR SELECT
  USING (published = true);

-- Insert sample data
INSERT INTO bamastro_blog_posts (title, slug, excerpt, content, category, read_time, featured, gradient, published) VALUES
(
  '첫 방문 전 알아야 할 에티켓 7가지',
  'first-visit-etiquette',
  '프리미엄 라운지를 처음 방문하시나요? 당황하지 않고 품격 있게 즐기는 필수 매너를 정리했습니다.',
  '## 첫 방문 에티켓 가이드

프리미엄 라운지를 처음 방문하시는 분들을 위한 필수 에티켓 가이드입니다.

### 1. 예약은 필수
인기 있는 업소는 사전 예약이 필수입니다. 최소 하루 전에 예약하시는 것을 권장합니다.

### 2. 복장 규정
캐주얼하지만 단정한 복장을 권장합니다. 슬리퍼나 반바지는 피해주세요.

### 3. 시간 엄수
예약 시간을 지키는 것은 기본 예절입니다.

### 4. 매너 있는 대화
상대방을 존중하는 대화 매너가 중요합니다.

### 5. 적절한 팁 문화
서비스에 만족하셨다면 적절한 감사 표현을 해주세요.

### 6. 개인정보 보호
다른 손님의 프라이버시를 존중해주세요.

### 7. 음주 조절
과음은 피하고, 즐거운 분위기를 유지해주세요.',
  '초보 가이드',
  '5분',
  true,
  'from-violet-600 to-purple-600',
  true
),
(
  '2025 분당 유흥 트렌드 리포트',
  'bundang-trend-report-2025',
  '올해 분당 프리미엄 시장의 변화와 새로운 트렌드를 분석했습니다. 스마트한 선택을 위한 인사이트.',
  '## 2025 분당 유흥 트렌드

### 프리미엄화 가속
고급 서비스에 대한 수요가 지속적으로 증가하고 있습니다.

### 예약 시스템 디지털화
온라인 예약 시스템 도입이 빨라지고 있습니다.

### 프라이버시 강화
VIP룸과 독립된 공간에 대한 수요가 증가했습니다.',
  '트렌드',
  '7분',
  false,
  'from-fuchsia-600 to-pink-600',
  true
),
(
  '비즈니스 접대, 성공하는 장소 선택법',
  'business-meeting-guide',
  '중요한 비즈니스 미팅을 위한 완벽한 장소 선택 기준과 예약 팁을 공개합니다.',
  '## 비즈니스 접대 장소 선택 가이드

### 위치 선정
접근성이 좋고, 주차가 편리한 곳을 선택하세요.

### 분위기
비즈니스 미팅에 적합한 조용하고 고급스러운 분위기가 중요합니다.

### 프라이버시
대화 내용이 외부로 새어나가지 않는 독립된 공간을 확보하세요.',
  '비즈니스',
  '4분',
  false,
  'from-indigo-600 to-violet-600',
  true
),
(
  '예산별 추천 코스 완벽 정리',
  'budget-guide',
  '30만원부터 100만원대까지, 예산에 맞는 최적의 코스와 구성을 안내해 드립니다.',
  '## 예산별 추천 코스

### 30만원대 코스
기본적인 서비스를 경험할 수 있는 입문 코스입니다.

### 50만원대 코스
가장 인기 있는 스탠다드 코스로, 만족도가 높습니다.

### 100만원대 코스
프리미엄 서비스와 VIP 대우를 받을 수 있는 최고급 코스입니다.',
  '가격 가이드',
  '6분',
  false,
  'from-purple-600 to-indigo-600',
  true
);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_bamastro_blog_posts_updated_at ON bamastro_blog_posts;
CREATE TRIGGER update_bamastro_blog_posts_updated_at
  BEFORE UPDATE ON bamastro_blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
