import { Client, Guild, REST, TextChannel } from "discord.js";

// DotEnv initialization
import * as dotenv from 'dotenv';
dotenv.config();

import { linkEmail, readStorage, removeUser, setupStorage, unlinkEmail } from "./storageManager";
import ImapConnector from "./imap/imapConnector";

interface DataObject {
  rest?: REST;
  client?: Client;
}

class MainStorage {
  
  rest?: REST;
  client?: Client;
  guild?: Guild;
  error_channel?: TextChannel | null;

  readonly client_id = process.env.CLIENT_ID!;
  readonly token = process.env.TOKEN!;
  readonly guild_id = process.env.GUILD_ID!;
  readonly error_channel_id = process.env.ERROR_CHANNEL_ID!;
  readonly storage = readStorage();
  
  linked_emails: {[key: string]: ImapConnector[]} = {};

  setData(data: DataObject) {
    this.rest = data.rest;
    this.client = data.client;

    // Converts JSON storage to readable linkedEmails storage with ImapConnector instances
    for (const user in this.storage) {
      this.linked_emails[user] = [];
      for (const linkedEmail of this.storage[user]) {
        this.linked_emails[user].push(new ImapConnector(linkedEmail.user, linkedEmail.password, linkedEmail.host, linkedEmail.port, linkedEmail.tls));
      }
    }
  }

  async setDataAfterLogin() {
    this.guild = await this.client?.guilds.fetch(this.guild_id);
    this.error_channel = await this.guild?.channels.fetch(this.error_channel_id) as TextChannel;

    for (const userId in this.linked_emails) {
      await this.guild?.members.fetch(userId).catch((_) => {
        this.removeUser(userId);
      });
    }
  }

  addEmailLink(userId: number | string, imapConnector: ImapConnector) {
    if (this.linked_emails[userId] === undefined) this.linked_emails[userId] = [];

    this.linked_emails[userId].push(imapConnector);
    linkEmail(userId, imapConnector);
    console.log(`Inserting email ${imapConnector.user} on user ${userId}`);
  }

  removeUser(userId: number | string) {
    if (!this.linked_emails[userId] === undefined) return;

    delete this.linked_emails[userId];
    removeUser(userId);
  }
  
  removeEmailLink(userId: number | string, imapConnector: ImapConnector) {
    if (!this.linked_emails[userId].includes(imapConnector)) return;

    this.linked_emails[userId].splice(this.linked_emails[userId].indexOf(imapConnector), 1);
    unlinkEmail(userId, imapConnector);
    console.log(`Removing email ${imapConnector.user} on user ${userId}`);
  }

  hasLinkedEmail(userId: number | string, email: string): ImapConnector | undefined {
    if (this.linked_emails[userId] !== undefined) {
      for (const linkInfo of this.linked_emails[userId]) {
        if (linkInfo['user'] === email) {
          return linkInfo;
        }
      }
    }
    return undefined;
  }

  getImapConnector(userId: number | string, email: string): ImapConnector | undefined {
    if (this.hasLinkedEmail(userId, email)) return undefined;
  }

  getLinkedEmails(userId: number | string): string[] {
    const emails: string[] = [];
    for (const imapConnector of this.linked_emails[userId]) {
      emails.push(imapConnector.user);
    }
    return emails;
  }
}

// Creates storage.json file if it absents
setupStorage();
const instance: MainStorage = new MainStorage();

export default instance;