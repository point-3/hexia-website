import { Inquiry } from '../directus';

export type SubmitInquiryInput = Omit<Inquiry, 'id' | 'status'>;

/**
 * 提交客户询盘数据到前端 Next.js 后端路由 /api/inquiries
 * 
 * @param data 询盘表单数据
 */
export async function createInquiry(data: SubmitInquiryInput) {
  // 参数非空校验，禁止隐式兜底
  if (!data.name || !data.name.trim()) {
    throw new Error('姓名 (name) 不能为空！');
  }
  if (!data.email || !data.email.trim()) {
    throw new Error('邮箱 (email) 不能为空！');
  }
  if (!data.message || !data.message.trim()) {
    throw new Error('留言内容 (message) 不能为空！');
  }

  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`询盘提交失败: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result;
}
