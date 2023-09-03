import { GuildMember, User } from "discord.js";
import mainStorage from "./mainStorage";

function throwIfPresent(error: Error | null) {
  if (error) throw error;
}

function logIfPresent(error: Error) {
  if (!error) return false; 

  console.error(error);
  return true;
}

function notify(member: GuildMember | User | undefined, errorMessage: string) {
  if (member === undefined) return;
  mainStorage.error_channel?.send({content: `${member.toString()} ${errorMessage}`});
}

async function notifyById(userId: string | number, errorMessage: string) {
  notify(await mainStorage.guild?.members.fetch(userId as string), errorMessage);
}

export { throwIfPresent, logIfPresent, notify, notifyById }