import { directusUrl, type Banner } from '../directus';

type DirectusListResponse<T> = {
  data?: T[];
};

/**
 * 获取所有已发布的首页轮播图 (Banners) 列表，按 sort 升序排序。
 * 轮播图是首页首屏内容，后台换图后必须绕开 Directus/Next 读缓存。
 */
export async function getBanners(): Promise<Banner[]> {
  const params = new URLSearchParams({
    fields: [
      'id',
      'sort',
      'status',
      'image.id',
      'image.modified_on',
      'image.uploaded_on',
      'image.filesize',
      'image.filename_download',
    ].join(','),
    'filter[status][_eq]': 'published',
    sort: 'sort',
    _: Date.now().toString(),
  });

  const response = await fetch(`${directusUrl}/items/banners?${params.toString()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store',
    },
  });

  if (!response.ok) {
    throw new Error(`获取首页轮播图失败：Directus 返回 ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as DirectusListResponse<Banner>;
  if (!Array.isArray(payload.data)) {
    throw new Error('获取首页轮播图失败：Directus 返回数据缺少 data 数组');
  }

  return payload.data;
}
