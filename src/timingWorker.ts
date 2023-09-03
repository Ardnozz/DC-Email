import { APIEmbed, DiscordAPIError } from "discord.js";
import EmailEmbedBulder from "./emailEmbedBuilder";
import { logIfPresent, notify } from "./errorHandler";
import { getUnreadEmails } from "./imap/imapRetriever";
import mainStorage from "./mainStorage";

class TimingWorker {

  readonly interval: NodeJS.Timeout;

  constructor (seconds: number) {
    this.interval = setInterval(() => {
      
    }, seconds * 1000);
    this.sendEmailsToPm();
  }

  private async sendEmailsToPm() {
    const users = Object.keys(mainStorage.linked_emails);

    // Loop over all users
    for (let i = 0; i < users.length; i++) {
      // Loop over all linked emails of user
      for (let linkedEmail of mainStorage.linked_emails[users[i]]) {
        const emails = await getUnreadEmails(linkedEmail, users[i]);
        const embededEmails: APIEmbed[] = [];

        // Loop over all unseed emails
        for (const email of emails) {
          embededEmails.push(
            new EmailEmbedBulder({
              subject: email.subject,
              from: email.from,
              to: email.to,
              cc: email.cc,
              date: email.date,
              text: email.text
            }).build() as APIEmbed
          );
        }

        if (embededEmails.length === 0) continue;

        const member = await mainStorage.client!.users.fetch(users[i]);
        // Send all emails one by one
        for (const embededEmail of embededEmails) {
          await member.send({
            embeds: [embededEmail]
          }).catch(async (error: DiscordAPIError) => {
            let messageToSend: string;

            const errorMatch = /\[(\D+)\]/.exec(error.message);
            
            if (errorMatch) {
              switch (errorMatch[1]) {
                case 'MAX_EMBED_SIZE_EXCEEDED':
                  messageToSend = 'Your email is too large. Check your inbox instead.';
                  break;
                case 'BASE_TYPE_MAX_LENGTH':
                  messageToSend = 'Some part of the email is really long. Check your inbox inbox instead.';
                  break;
                default:
                  messageToSend = error.message;
                  break;
              }
            } else {
              switch (error.message) {
                case 'Cannot send messages to this user':
                  messageToSend = 'MEMBER_UNAVAILABLE';
                  break;
                default:
                  messageToSend = error.message;
                  break;
              }
            }
  
            if (messageToSend !== 'MEMBER_UNAVAILABLE') {
              member.send({
                content: messageToSend
              }).catch();
            } else {
              notify(member, 'You need to allow direct messages from this server!');
            }
          });
        }
      }
      await new Promise<void>(promiseResolve => setTimeout(() => promiseResolve(), i * 1000));
    }
  }
}

export default TimingWorker;