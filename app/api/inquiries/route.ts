import { NextResponse } from 'next/server';
import { directus } from '@/lib/directus';
import { createItem } from '@directus/sdk';

/**
 * 询盘接口 POST /api/inquiries
 * 接收前端询盘提交，并转发至 Directus 后台
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 必填参数校验，禁止任何隐式兜底默认值
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: '姓名 (name) 不能为空' }, { status: 400 });
    }
    if (!body.email || !body.email.trim()) {
      return NextResponse.json({ error: '邮箱 (email) 不能为空' }, { status: 400 });
    }
    if (!body.message || !body.message.trim()) {
      return NextResponse.json({ error: '留言内容 (message) 不能为空' }, { status: 400 });
    }

    // 插入数据到 Directus inquiries 集合中，设置初始状态为 new
    const created = await directus.request(
      createItem('inquiries', {
        name: body.name.trim(),
        email: body.email.trim(),
        country: body.country?.trim() || null,
        product_interest: body.product_interest?.trim() || null,
        quantity: body.quantity?.trim() || null,
        message: body.message.trim(),
        source_page: body.source_page?.trim() || null,
        source_product_slug: body.source_product_slug?.trim() || null,
        status: 'new'
      })
    );

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    console.error('API /api/inquiries error:', err);
    return NextResponse.json(
      { error: err.message || '内部服务错误，无法保存询盘' },
      { status: 500 }
    );
  }
}
