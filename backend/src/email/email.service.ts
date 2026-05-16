import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  isConfigured(): boolean {
    return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
  }

  async sendTransactional(to: string, subject: string, html: string): Promise<void> {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!key || !from) {
      this.logger.debug("Email não configurado (RESEND_API_KEY / EMAIL_FROM).");
      return;
    }
    try {
      await axios.post(
        "https://api.resend.com/emails",
        { from, to: [to], subject, html },
        { headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" } },
      );
    } catch (e: any) {
      this.logger.warn(`Resend falhou: ${e?.response?.data?.message ?? e?.message}`);
    }
  }
}
