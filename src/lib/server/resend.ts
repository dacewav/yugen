import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

let _resend: Resend;

function getResend(): Resend {
  if (!_resend) {
    const key = env.RESEND_API_KEY;
    if (!key) throw new Error('Missing RESEND_API_KEY');
    _resend = new Resend(key);
  }
  return _resend;
}

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}): Promise<void> {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await getResend().emails.send({
        from: 'YUGEN <noreply@yugen.store>',
        to: params.to,
        subject: params.subject,
        html: params.html,
        replyTo: params.replyTo,
        tags: params.tags,
      });
      return;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
