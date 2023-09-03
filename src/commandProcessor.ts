import { ApplicationCommandOptionType, ApplicationCommandType, CacheType, ChatInputCommandInteraction, Routes } from "discord.js";

import mainStorage from "./mainStorage";
import Command from "./commands/commandType";
import TestCommand from "./commands/TestCommand";
import LinkIMAPCommand from "./commands/linkIMAPCommand";
import UnlinkIMAPCommand from "./commands/unlinkIMAPCommand";
import listIMAPCommand from "./commands/listIMAPCommand";

// Command registration
const discord_commands = [
  {
    name: 'test',
    description: 'Test slash command.'
  },
  {
    name: 'link_email',
    description: 'Links an email to your discord account.',
    options: [
      {
        name: 'email',
        description: 'The email you want to link.',
        required: true,
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'password',
        description: 'The correct password to the email\'s address',
        required: true,
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'host',
        description: 'The domain to the IMAP server that\'s providing the email.',
        required: true,
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'port',
        description: 'The port for the running process on the IMAP server domain.',
        required: true,
        type: ApplicationCommandOptionType.Integer
      },
      {
        name: 'tls',
        description: 'The specification for TLS (SSL) support.',
        required: true,
        type: ApplicationCommandOptionType.Boolean
      }
    ]
  },
  {
    name: 'unlink_email',
    description: 'Unlinks an email from your discord account.',
    options: [
      {
        name: 'email',
        description: 'The email you want to unlink.',
        required: true,
        type: ApplicationCommandOptionType.String
      }
    ]
  },
  {
    name: 'linked_emails',
    description: 'Shows emails linked to your discord account.'
  }
];

const commands = {
  test: new TestCommand(),
  link_email: new LinkIMAPCommand(),
  unlink_email: new UnlinkIMAPCommand(),
  linked_emails: new listIMAPCommand()
} as Record<string, Command>;

async function registerCommands() {
  console.log('Started refreshing application (/) commands.');

  await mainStorage.rest!.put(Routes.applicationCommands(mainStorage.client_id), { body: discord_commands });

  console.log('Successfully reloaded application (/) commands.');
}

// Command processor
function processCommand(interaction: ChatInputCommandInteraction<CacheType>) {
  commands[interaction.commandName].execute(interaction);
}

export { registerCommands, processCommand };