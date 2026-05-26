import { directus } from '../directus';
import { readItems } from '@directus/sdk';

/**
 * 获取所有已发布的新闻/文章列表，按发布日期降序排序
 */
export async function getArticles() {
  return await directus.request(
    readItems('articles', {
      fields: ['id', 'slug', 'title', 'excerpt', 'content', 'image', 'category', 'is_featured', 'status', 'date_published'],
      filter: {
        status: { _eq: 'published' }
      },
      sort: ['-date_published']
    })
  );
}

/**
 * 获取已发布的推荐 (Featured) 文章列表，按发布日期降序排序
 */
export async function getFeaturedArticles() {
  return await directus.request(
    readItems('articles', {
      fields: ['id', 'slug', 'title', 'excerpt', 'content', 'image', 'category', 'is_featured', 'status', 'date_published'],
      filter: {
        status: { _eq: 'published' },
        is_featured: { _eq: true }
      },
      sort: ['-date_published']
    })
  );
}

/**
 * 根据唯一的 slug 获取已发布的文章详情
 * 
 * @param slug 文章唯一标识
 */
export async function getArticleBySlug(slug: string) {
  if (!slug) {
    // 显式暴露参数缺失错误，禁止默认值或兜底逻辑
    throw new Error('参数错误: slug 必须提供且不能为空！');
  }

  const items = await directus.request(
    readItems('articles', {
      fields: ['id', 'slug', 'title', 'excerpt', 'content', 'image', 'category', 'is_featured', 'status', 'date_published'],
      filter: {
        slug: { _eq: slug },
        status: { _eq: 'published' }
      },
      limit: 1
    })
  );

  if (!items || items.length === 0) {
    throw new Error(`找不到 Slug 为 "${slug}" 的已发布新闻文章！`);
  }

  return items[0];
}
