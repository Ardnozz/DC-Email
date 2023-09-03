import { ChatInputCommandInteraction, CacheType } from "discord.js";
import Command from "./commandType";
import { getUnreadEmails } from "../imap/imapRetriever";
import ImapConnector from "../imap/imapConnector";
import mainStorage from "../mainStorage";

class TestCommand implements Command {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    console.log(await getUnreadEmails(mainStorage.linked_emails[interaction.user.id][0], interaction.user.id));
  }
}

export default TestCommand;