import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Blog post type definition
export interface BlogPost {
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
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all published blog posts (with scheduled filter)
export async function getBlogPosts(): Promise<BlogPost[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('bamastro_blog_posts')
    .select('*')
    .eq('status', 'published')
    .lte('published_at', now)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

// Pagination result type
export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Fetch paginated blog posts (with scheduled filter)
export async function getBlogPostsPaginated(
  page = 1,
  pageSize = 9
): Promise<PaginatedResult<BlogPost>> {
  const now = new Date().toISOString();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Get total count
  const { count, error: countError } = await supabase
    .from('bamastro_blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .lte('published_at', now);

  if (countError) {
    console.error('Error counting blog posts:', countError);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  // Get paginated data
  const { data, error } = await supabase
    .from('bamastro_blog_posts')
    .select('*')
    .eq('status', 'published')
    .lte('published_at', now)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching paginated blog posts:', error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  const totalCount = count || 0;
  return {
    data: data || [],
    count: totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

// Fetch single blog post by slug (with scheduled filter)
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('bamastro_blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', now)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data;
}

// Fetch featured blog post (with scheduled filter)
export async function getFeaturedPost(): Promise<BlogPost | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('bamastro_blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .lte('published_at', now)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching featured post:', error);
    return null;
  }

  return data;
}

// Blog image pool type (for admin/creation)
export interface BlogImagePool {
  id: string;
  storage_path: string;
  alt_text: string | null;
  category: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

// Get random image from pool using least-used algorithm (for post creation)
export async function getRandomImageFromPool(): Promise<{ storage_path: string; alt_text: string | null } | null> {
  const { data, error } = await supabase
    .rpc('bamastro_get_random_image');

  if (error) {
    console.error('Error getting random image:', error);
    return null;
  }

  if (data && data.length > 0) {
    return {
      storage_path: data[0].storage_path,
      alt_text: data[0].alt_text
    };
  }

  return null;
}

// Increment usage count for an image (call after assigning to post)
export async function incrementImageUsage(imageId: string): Promise<void> {
  const { error } = await supabase
    .from('bamastro_blog_images')
    .update({ usage_count: supabase.rpc('increment_usage', { row_id: imageId }) })
    .eq('id', imageId);

  if (error) {
    console.error('Error incrementing image usage:', error);
  }
}

// Get public URL for storage path
export function getStoragePublicUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from('bamastro-blog')
    .getPublicUrl(storagePath);

  return data.publicUrl;
}
