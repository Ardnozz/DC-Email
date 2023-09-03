import { REST, Client, GatewayIntentBits, Events } from 'discord.js';

import mainStorage from './src/mainStorage';
import { registerCommands, processCommand } from './src/commandProcessor';
import TimingWorker from './src/timingWorker';

// Inserting data into main storage
mainStorage.setData({
  rest: new REST({ version: '10' }).setToken(mainStorage.token),
  client: new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ] })
});

//testing area
//testing area
//testing area



//testing area
//testing area
//testing area
//testing area

// Register basic events
let client: Client = mainStorage.client!;

// onReady confirmation
client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  mainStorage.setDataAfterLogin();
  registerCommands();

  new TimingWorker(60);
});

// Registering slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  processCommand(interaction);
});

// Logging into discord bot
client.login(mainStorage.token);