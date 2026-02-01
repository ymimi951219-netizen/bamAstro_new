# SEO Component Configuration Guide

## Overview

**File**: `/packages/ui/src/components/common/SEO.astro`

The SEO component is centralized and uses region configuration to generate meta tags. Below is the complete reference guide for understanding and extending it.

---

## Current Implementation

### Props Interface

```typescript
interface Props {
  title: string;                    // Page title (meta tag + <title>)
  description?: string;             // Meta description (uses region.seo.description as fallback)
  canonical?: string;               // Canonical URL (defaults to current page)
  ogImage?: string;                 // OG image path (defaults to /og-home.jpg)
  ogType?: 'website' | 'article';   // OG type (website for pages, article for blog posts)
  keywords?: string[];              // Meta keywords (uses region.seo.mainKeywords as fallback)
  noindex?: boolean;                // Control indexing (false = index, true = noindex)
  region: RegionConfig;             // Region configuration object (required)

  // Article-specific props
  datePublished?: string;           // ISO 8601 date (article:published_time)
  dateModified?: string;            // ISO 8601 date (article:modified_time)
  author?: string;                  // Article author (defaults to '서우실장')

  // Cross-regional linking
  alternateRegions?: Array<{        // For hreflang alt regions
    domain: string;
    lang: string;
  }>;
}
```

### Meta Tags Generated

#### Search Engine Verification
```html
<meta name="naver-site-verification" content={naverVerification} />
<meta name="google-site-verification" content={googleVerification} />
```

#### Primary Meta Tags
```html
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<meta name="keywords" content={keywords.join(', ')} />
<meta name="author" content="서우실장" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href={canonical} />
```

#### Open Graph Tags
```html
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={fullOgImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:site_name" content="{region.name} 유흥 가이드" />
```

#### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={fullOgImage} />
```

#### Article Meta Tags (Blog posts)
```html
<meta property="article:published_time" content={datePublished} />
<meta property="article:modified_time" content={dateModified} />
<meta property="article:author" content={author} />
<meta property="article:section" content="유흥 가이드" />
<meta property="article:tag" content={keywords} />
```

#### Hreflang Tags (Cross-regional)
```html
<link rel="alternate" hreflang="ko-KR" href={canonical} />
<link rel="alternate" hreflang={alt.lang} href={alt.domain} />
<link rel="alternate" hreflang="x-default" href={canonical} />
```

---

## Configuration Structure

### Region Configuration (`region.ts`)

```typescript
export const region: RegionConfig = {
  // ... other properties ...

  seo: {
    mainKeyword: string;           // Primary keyword (1-2 words)
    mainKeywords: string[];        // Keyword array (for meta keywords)
    description: string;           // Fallback description (used in SEO component)

    // SEO Metadata
    homeTitle?: string;            // Home page title (50-60 chars recommended)
    homeDescription?: string;      // Home page description (150-160 chars recommended)
    blogListTitle?: string;        // Blog list page title
    blogListDescription?: string;  // Blog list page description

    // Search Engine Verification
    naverVerification?: string;    // Naver verification code (32 chars)
    googleVerification?: string;   // Google verification code (43 chars)

    // Long-tail & Location Keywords
    longTailKeywords?: string[];   // Extended keyword coverage
    locationKeywords?: string[];   // Location-specific keywords
  }
}
```

---

## Usage Examples

### Home Page

```astro
---
import SEO from '@ui/components/common/SEO.astro';
import { region } from '../config/region';

const title = region.seo.homeTitle;
const description = region.seo.homeDescription;
---

<SEO
  {title}
  {description}
  ogImage="/og-home.jpg"
  ogType="website"
  {region}
/>
```

### Blog List Page

```astro
---
import SEO from '@ui/components/common/SEO.astro';
import { region } from '../config/region';

const title = region.seo.blogListTitle;
const description = region.seo.blogListDescription;
const currentPage = parseInt(Astro.url.searchParams.get('page') || '1');
const canonical = currentPage === 1
  ? `https://${region.domain}/blog`
  : `https://${region.domain}/blog?page=${currentPage}`;
---

<SEO
  {title}
  {description}
  {canonical}
  ogImage="/og-blog.jpg"
  ogType="website"
  {region}
/>
```

### Blog Post Page

```astro
---
import SEO from '@ui/components/common/SEO.astro';
import { region } from '../config/region';
import { getCollection } from 'astro:content';

const { slug } = Astro.params;
const post = await getCollection('blog').then(
  p => p.find(item => item.slug === slug)
);

const title = post.data.title;
const description = post.data.excerpt;
const canonical = `https://${region.domain}/blog/${slug}`;
const ogImage = post.data.image || '/og-blog.jpg';
const keywords = post.data.tags || [];

// Format dates as ISO 8601
const datePublished = new Date(post.data.publishedAt).toISOString();
const dateModified = post.data.updatedAt
  ? new Date(post.data.updatedAt).toISOString()
  : datePublished;
---

<SEO
  {title}
  {description}
  {canonical}
  {ogImage}
  ogType="article"
  {keywords}
  {region}
  {datePublished}
  {dateModified}
  author="서우실장"
/>
```

### Guide/Category Page

```astro
---
import SEO from '@ui/components/common/SEO.astro';
import { region } from '../config/region';

const venueId = Astro.params.venue;
const venue = region.venueTypes.find(v => v.id === venueId);

const title = `${region.name} ${venue.name} 완벽 가이드 | ${venue.subtitle}`;
const description = `${venue.description} 최신 가격, 예약 방법, 에티켓 총정리. 서우실장 24시간 무료 상담.`;
const canonical = `https://${region.domain}/guides/${venue.slug}`;
const ogImage = `/og-${venueId}.jpg`;
const keywords = venue.keywords;
---

<SEO
  {title}
  {description}
  {canonical}
  {ogImage}
  ogType="website"
  {keywords}
  {region}
/>
```

---

## Recommended Field Values

### Meta Keywords Placement

```typescript
// In SEO component call
keywords={[
  region.seo.mainKeywords[0],           // Primary keyword
  region.seo.mainKeywords[1],           // Secondary keyword
  ...region.seo.longTailKeywords.slice(0, 3)  // Top 3 long-tail
]}
```

**Why**: Limits to 5 most important keywords (Google recommends 3-7)

### Image Dimensions

```
og:image optimal: 1200x630px (1.91:1 aspect ratio)
og:image min: 600x315px
og:image max: 4000x2100px
File size: <8MB (recommended <300KB for performance)
```

### Language Tags

```typescript
const alternateRegions = [
  // If future international expansion
  { domain: 'high-karaoke.com', lang: 'ko' },
  { domain: 'high-karaoke.co.kr', lang: 'ko-KR' },
];
```

---

## Missing Features (To Implement)

### 1. Pagination Rel Tags

**Add to blog template**:

```astro
---
const currentPage = Astro.url.searchParams.get('page') || '1';
const prevLink = currentPage > 1
  ? currentPage === 2
    ? '/blog'
    : `/blog?page=${parseInt(currentPage) - 1}`
  : null;
const nextLink = hasMorePages ? `/blog?page=${parseInt(currentPage) + 1}` : null;
---

{prevLink && <link rel="prev" href={`https://${region.domain}${prevLink}`} />}
{nextLink && <link rel="next" href={`https://${region.domain}${nextLink}`} />}
```

### 2. Schema Markup

**Add to SEO.astro before closing**:

```astro
<!-- LocalBusiness Schema -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${region.name} 유흥 가이드`,
    "url": `https://${region.domain}`,
    "telephone": region.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": region.address.city,
      "addressRegion": region.address.region,
      "addressCountry": "KR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": region.geo.lat,
      "longitude": region.geo.lng
    }
  }
</script>
```

### 3. Article Schema

**For blog posts**:

```astro
{ogType === 'article' && datePublished && (
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "image": fullOgImage,
      "datePublished": datePublished,
      "dateModified": dateModified || datePublished,
      "author": {
        "@type": "Person",
        "name": author
      }
    }
  </script>
)}
```

---

## SEO Component Modifications Needed

### Current Line 1-95 Additions

Add after line 94 (after hreflang):

```astro
<!-- Schema.org Structured Data -->
{/* LocalBusiness - renders on all pages */}
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${region.name} 유흥 가이드`,
    "url": `https://${region.domain}`,
    "telephone": region.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": region.address.city,
      "addressRegion": region.address.region,
      "addressCountry": "KR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": region.geo.lat,
      "longitude": region.geo.lng
    }
  }
</script>

{/* BlogPosting - renders only for articles */}
{ogType === 'article' && datePublished && (
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": fullTitle,
      "description": description,
      "image": fullOgImage,
      "datePublished": datePublished,
      "dateModified": dateModified || datePublished,
      "author": {
        "@type": "Person",
        "name": author
      }
    }
  </script>
)}
```

---

## Character Count Reference

### For Developers

When manually checking title/description lengths:

**Korean Text**: Each Korean character = 1 unit (displayed as 2 pixels in most fonts)
**English Text**: Each letter = 1 unit (displayed as 1 pixel)
**Punctuation**: Varies
  - Pipe (|) = 1 char
  - Middot (·) = 1 char
  - Star (★) = 1 char
  - Space = 1 char

### Browser DevTools Check

```javascript
// Open browser console, paste:
const title = "강남 유흥 완벽 가이드 | 가라오케·하이퍼블릭·셔츠룸 추천 | 서우실장";
console.log(`Length: ${title.length} characters`);
console.log(`Width estimate: ${title.length * 0.9}px`);
```

**Result**: 60 characters = approximately 54px on desktop

---

## Testing Checklist

### Before Publishing Changes

- [ ] Character count validated (title 50-60, description 150-160)
- [ ] SERP preview tested in Google Search Console
- [ ] Mobile preview (375px) checked for truncation
- [ ] OG images verified (1200x630px minimum)
- [ ] Verification codes filled (not empty strings)
- [ ] Canonical URLs correct (no duplicates)
- [ ] Keywords relevant to content
- [ ] No special characters causing encoding issues
- [ ] Social sharing preview checked (Facebook, Twitter)
- [ ] Schema validation passed (Rich Results Test)

---

## Common Mistakes to Avoid

1. **Keyword stuffing**: More than 7-8 keywords = spam risk
2. **Duplicate descriptions**: Copy-paste across regions
3. **Empty verification codes**: Leaves as empty strings ("")
4. **Missing OG images**: Falls back to generic image
5. **Truncated CTAs**: CTA cut off on mobile (use early placement)
6. **Wrong canonical**: Points to wrong URL or external site
7. **Encoding issues**: Special characters breaking HTML
8. **No article dates**: Blog posts missing publishedTime schema
9. **Generic descriptions**: Not specific to page content
10. **Noindex by accident**: noindex: true on important pages

---

## Files Modified in This Configuration

**Main SEO Component**:
- `/packages/ui/src/components/common/SEO.astro`

**Region Configurations** (9 files):
- `/apps/gangnam/src/config/region.ts`
- `/apps/bundang/src/config/region.ts`
- `/apps/dongtan/src/config/region.ts`
- `/apps/ingedong/src/config/region.ts`
- `/apps/suwon/src/config/region.ts`
- `/apps/pyeongtaek/src/config/region.ts`
- `/apps/anyang/src/config/region.ts`
- `/apps/suji/src/config/region.ts`
- `/apps/ansan/src/config/region.ts`

**Template Pages** (where SEO component is imported):
- `/apps/{region}/src/pages/index.astro` (home)
- `/apps/{region}/src/pages/blog.astro` (blog list)
- `/apps/{region}/src/pages/blog/[...slug].astro` (blog posts)
- `/apps/{region}/src/pages/guides/[venue].astro` (guide pages)

---
