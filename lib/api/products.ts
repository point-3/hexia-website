import { directus } from '../directus';
import { readItems } from '@directus/sdk';

/**
 * 获取所有已发布的产品列表，按 sort 升序排序，并包含分类和子分类详情
 */
export async function getProducts() {
  return await directus.request(
    readItems('products', {
      fields: [
        'id',
        'slug',
        'image',
        'sort',
        'status',
        { category_id: ['id', 'name', 'name_cn', 'slug'] },
        { subcategory_id: ['id', 'name', 'name_cn', 'slug'] },
        { translations: ['id', 'languages_code', 'product_title', 'product_description'] }
      ],
      filter: {
        status: { _eq: 'published' }
      },
      sort: ['sort']
    })
  );
}

/**
 * 根据唯一的 slug 查找对应的已发布产品，并包含分类和子分类详情
 * 
 * @param slug 产品唯一标识
 */
export async function getProductBySlug(slug: string) {
  if (!slug) {
    // 显式暴露参数缺失错误，禁止默认值或兜底逻辑
    throw new Error('参数错误: slug 必须提供且不能为空！');
  }

  const items = await directus.request(
    readItems('products', {
      fields: [
        'id',
        'slug',
        'image',
        'sort',
        'status',
        { category_id: ['id', 'name', 'name_cn', 'slug'] },
        { subcategory_id: ['id', 'name', 'name_cn', 'slug'] },
        { translations: ['id', 'languages_code', 'product_title', 'product_description'] }
      ],
      filter: {
        slug: { _eq: slug },
        status: { _eq: 'published' }
      },
      limit: 1
    })
  );

  if (!items || items.length === 0) {
    throw new Error(`找不到 Slug 为 "${slug}" 的已发布产品！`);
  }

  return items[0];
}

/**
 * 获取所有已发布的分类列表，按 sort 排序
 */
export async function getCategories() {
  return await directus.request(
    readItems('categories', {
      fields: ['id', 'name', 'name_cn', 'slug', 'image', 'sort', 'status'],
      filter: {
        status: { _eq: 'published' }
      },
      sort: ['sort']
    })
  );
}

/**
 * 获取所有二级分类列表，按 sort 排序
 */
export async function getSubcategories() {
  return await directus.request(
    readItems('subcategories', {
      fields: ['id', 'name', 'name_cn', 'slug', 'sort', { category_id: ['id', 'name', 'name_cn', 'slug', 'image', 'sort', 'status'] }],
      sort: ['sort']
    })
  );
}
