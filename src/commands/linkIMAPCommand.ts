import { ChatInputCommandInteraction, CacheType } from "discord.js";
import Command from "./commandType";
import ImapConnector from "../imap/imapConnector";
import mainStorage from "../mainStorage";

class LinkIMAPCommand implements Command {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const email = interaction.options.getString('email', true);
    const password = interaction.options.getString('password', true);
    const host = interaction.options.getString('host', true);
    const port = interaction.options.getInteger('port', true);
    const tls = interaction.options.getBoolean('tls', true);

    if (mainStorage.hasLinkedEmail(interaction.user.id, email) !== undefined) {
      await interaction.reply({
        content: 'You\'ve already linked this email.',
        ephemeral: true
      });
      return;
    }

    const linkedEmail = new ImapConnector(email, password, host, port, tls);

    if (!await linkedEmail.validateImap()) {
      await interaction.reply({
        content: 'You\'ve provided wrong inputs. Don\'t make a fool out of me! Try again...',
        ephemeral: true
      });
      return;
    }

    mainStorage.addEmailLink(interaction.user.id, new ImapConnector(email, password, host, port, tls));
    await interaction.reply({
      content: 'You\'ve successfully linked **' + email + '** email.',
      ephemeral: true
    });
  }
}

export default LinkIMAPCommand;