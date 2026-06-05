import { NextResponse } from 'next/server';
import { getSiteConfig, type SitePageKey } from '@/lib/api/site-config';
import { cmsCacheControlHeader } from '@/lib/cms-cache';

const PAGE_KEYS = new Set<SitePageKey>(['home', 'products', 'service', 'about', 'contact', 'news']);

function pageKeyFromRequest(request: Request): SitePageKey {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 'home';
  return PAGE_KEYS.has(page as SitePageKey) ? (page as SitePageKey) : 'home';
}

export async function GET(request: Request) {
  try {
    const siteConfig = await getSiteConfig(pageKeyFromRequest(request));
    return NextResponse.json(siteConfig, {
      headers: {
        'Cache-Control': cmsCacheControlHeader(),
      },
    });
  } catch (error) {
    console.error('API /api/cms/site-config error:', error);
    return new NextResponse('获取站点配置失败', { status: 502 });
  }
}
