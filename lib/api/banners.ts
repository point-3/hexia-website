import { directus } from '../directus';
import { readItems } from '@directus/sdk';

/**
 * 获取所有已发布的首页轮播图 (Banners) 列表，按 sort 升序排序
 */
export async function getBanners() {
  return await directus.request(
    readItems('banners', {
      fields: ['id', 'image', 'category', 'title', 'subtitle', 'sort', 'status'],
      filter: {
        status: { _eq: 'published' }
      },
      sort: ['sort']
    })
  );
}
