import nodemailer, { Transporter } from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import path from 'path';
import pug from 'pug';

interface sendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    mailerService: string,
    mailEmail: string,
    senderEmailPassword: string,
    private readonly postToProvider: boolean
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailEmail,
        pass: senderEmailPassword,
      },
    });
  }

  async sendEmail(options: sendEmailOptions) {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        //attachments: attachments,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async sendRegistrationConfirmation(to: string, name: string) {
    // 1. Construimos la ruta al archivo de la plantilla
    const templatePath = path.join(
      __dirname,
      '../templates/email/registration-confirmation.pug'
    );

    try {
      // 2. Usamos pug.renderFile para leer el archivo y reemplazar las variables
      const html = pug.renderFile(templatePath, {
        name: name, // Le pasamos la variable 'name' a la plantilla
      });

      // 3. Llamamos a nuestro método genérico para enviar el correo con el HTML ya generado
      await this.sendEmail({
        to: to,
        subject: '¡Bienvenido a Tu App Bancaria!',
        htmlBody: html,
      });

      console.log(`Confirmation email sent successfully to ${to}`);
    } catch (error) {
      console.error('Error rendering Pug template or sending email:', error);
    }
  }
}
