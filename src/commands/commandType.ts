import { ChatInputCommandInteraction, CacheType } from "discord.js";

export default interface Command {
  execute(interaction: ChatInputCommandInteraction<CacheType>);
}