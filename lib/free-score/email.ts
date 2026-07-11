export type ScoreReadyEmail = { to: string; companyName: string; score: number; tier: string; keyInsight: string; scorecardUrl: string };
export interface TransactionalEmailProvider { sendScoreReady(input: ScoreReadyEmail, idempotencyKey: string): Promise<void>; }
export class DisabledEmailProvider implements TransactionalEmailProvider { async sendScoreReady() { return; } }
export class ResendEmailProvider implements TransactionalEmailProvider {
  async sendScoreReady(input: ScoreReadyEmail, idempotencyKey: string) {
    if (!process.env.RESEND_API_KEY) throw new Error('Resend is not configured.');
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || 'The Redditrepreneur <no-reply@theredditrepreneur.com>', reply_to: process.env.RESEND_REPLY_TO || 'theredditrepreneur@gmail.com', to: [input.to], subject: 'Your Community Intelligence Score is ready', html: `<div style="font-family:Arial,sans-serif;color:#071f3d;max-width:620px"><h1>${escapeHtml(input.companyName)}: ${input.score}/100</h1><p><strong>${escapeHtml(input.tier)}</strong></p><p>${escapeHtml(input.keyInsight)}</p><p><a href="${escapeHtml(input.scorecardUrl)}" style="background:#ff4b0b;color:white;padding:14px 20px;text-decoration:none;border-radius:8px">Open your full scorecard</a></p><p><a href="https://app.theredditrepreneur.com/app/dashboard">Open dashboard</a> · <a href="https://blog.theredditrepreneur.com/the-redditrepreneur-community-intelligence-scorecard/">Read the research</a></p></div>` }) });
    if (!response.ok) throw new Error('Transactional email delivery failed.');
  }
}
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[character]!)); }
