export async function sendEmail(
  subject: string,
  body: string,
): Promise<{ success: boolean; messageId: string; timestamp: number }> {
  console.log(`[MOCK EMAIL] Sending email:`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);

  return {
    success: true,
    messageId: `msg_${Math.random().toString(36).substring(7)}`,
    timestamp: Date.now(),
  };
}
