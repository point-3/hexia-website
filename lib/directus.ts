import { createDirectus, rest } from '@directus/sdk';

export interface DirectusFile {
  id: string;
  filename_disk: string;
  filename_download: string;
  title?: string;
  type?: string;
}

export interface Category {
  id: number;
  name: string;
  name_cn: string;
  slug: string;
  image?: string | DirectusFile | null;
  sort?: number;
  status: 'published' | 'draft';
}

export interface Subcategory {
  id: number;
  name: string;
  name_cn: string;
  slug: string;
  category_id: number | Category;
  sort?: number;
}

export interface Product {
  id: number;
  slug: string;
  product_name: string;
  product_title: string;
  product_description?: string;
  image?: string | DirectusFile | null;
  category_id?: number | Category | null;
  subcategory_id?: number | Subcategory | null;
  sort?: number;
  status: 'published' | 'draft' | 'archived';
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string | DirectusFile | null;
  category?: string;
  is_featured?: boolean;
  status: 'published' | 'draft';
  date_published?: string;
}

export interface Banner {
  id: number;
  image: string | DirectusFile;
  category?: string;
  title: string;
  subtitle?: string;
  sort?: number;
  status: 'published' | 'draft';
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  country?: string;
  product_interest?: string;
  quantity?: string;
  message: string;
  source_page?: string;
  source_product_slug?: string;
  status: 'new' | 'processing' | 'replied' | 'closed';
}

export interface Schema {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  articles: Article[];
  banners: Banner[];
  inquiries: Inquiry[];
}

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
if (!directusUrl) {
  // 禁止兜底默认值，必须抛出错误暴露缺失
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL 环境变量未配置，请检查您的 .env 文件！');
}

export const directus = createDirectus<Schema>(directusUrl).with(rest());

/**
 * 拼装 Directus 文件的绝对 URL 链接
 * 
 * @param image 图像 UUID 或文件对象
 * @returns 完整的静态资源访问链接，若无则返回空字符串
 */
export function getFileUrl(image: string | DirectusFile | null | undefined): string {
  if (!image) return '';
  const id = typeof image === 'object' ? image.id : image;
  if (!id) return '';
  return `${directusUrl}/assets/${id}`;
}
