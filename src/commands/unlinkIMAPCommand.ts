import { ChatInputCommandInteraction, CacheType } from "discord.js";
import Command from "./commandType";
import mainStorage from "../mainStorage";

class UnlinkIMAPCommand implements Command {
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const email = interaction.options.getString('email', true);

    const linkedEmail = mainStorage.hasLinkedEmail(interaction.user.id, email);

    if (linkedEmail === undefined) {
      await interaction.reply({
        content: 'You\'ve not linked this email.',
        ephemeral: true
      });
      return;
    }

    mainStorage.removeEmailLink(interaction.user.id, linkedEmail);
    await interaction.reply({
      content: 'You\'ve successfully unlinked **' + email + '** email.',
      ephemeral: true
    });
  }
}

export default UnlinkIMAPCommand;