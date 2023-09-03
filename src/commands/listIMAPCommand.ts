import { ChatInputCommandInteraction, CacheType } from "discord.js";
import Command from "./commandType";
import mainStorage from "../mainStorage";

class ListIMAPCommand implements Command {
  execute(interaction: ChatInputCommandInteraction<CacheType>) {
    interaction.reply({
      content: 'Your linked emails are: ' + (mainStorage.getLinkedEmails(interaction.user.id).join(', ') || 'nothing :('),
      ephemeral: true
    });
  }
}

export default ListIMAPCommand;