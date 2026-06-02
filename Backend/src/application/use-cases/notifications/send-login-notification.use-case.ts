import type { IEmailService } from "../../../domain/ports/services/email.service.js";

export interface SendLoginNotificationCommand {
  userEmail: string;
  userName: string;
  htmlBody: string;
}

export class SendLoginNotificationUseCase {
  constructor(private readonly emailService: IEmailService) {}

  async execute(command: SendLoginNotificationCommand): Promise<void> {
    await this.emailService.send({
      to: command.userEmail,
      subject: "Novo acesso à sua conta - CampusConnect",
      html: command.htmlBody,
    });
  }
}
