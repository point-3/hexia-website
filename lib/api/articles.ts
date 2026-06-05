import { directus, directusFileField, type Article } from '../directus';
import { readItems } from '@directus/sdk';

const ARTICLE_FIELDS = [
  'id',
  'slug',
  directusFileField('image'),
  'is_featured',
  'status',
  'date_published',
  {
    translations: [
      'id',
      'languages_code',
      'title',
      'excerpt',
      'content',
      'category',
    ],
  },
] as const;

/**
 * 获取所有已发布的新闻/文章列表，按发布日期降序排序
 */
export async function getArticles(): Promise<Article[]> {
  return (await directus.request(
    readItems('articles', {
      fields: [...ARTICLE_FIELDS],
      filter: {
        status: { _eq: 'published' },
      },
      sort: ['-date_published'],
    }),
  )) as unknown as Article[];
}

/**
 * 获取已发布的推荐 (Featured) 文章列表，按发布日期降序排序
 */
export async function getFeaturedArticles(): Promise<Article[]> {
  return (await directus.request(
    readItems('articles', {
      fields: [...ARTICLE_FIELDS],
      filter: {
        status: { _eq: 'published' },
        is_featured: { _eq: true },
      },
      sort: ['-date_published'],
    }),
  )) as unknown as Article[];
}

/**
 * 根据唯一的 slug 获取已发布的文章详情
 */
export async function getArticleBySlug(slug: string): Promise<Article> {
  if (!slug) {
    throw new Error('参数错误: slug 必须提供且不能为空！');
  }

  const items = (await directus.request(
    readItems('articles', {
      fields: [...ARTICLE_FIELDS],
      filter: {
        slug: { _eq: slug },
        status: { _eq: 'published' },
      },
      limit: 1,
    }),
  )) as unknown as Article[];

  if (!items || items.length === 0) {
    throw new Error(`找不到 Slug 为 "${slug}" 的已发布新闻文章！`);
  }

  return items[0];
}
