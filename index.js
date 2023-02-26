const { Client, Options, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ],
  makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		ReactionManager: 0,
    GuildMemberManager: {
			maxSize: 200,
			keepOverLimit: member => member.id === client.user.id,
		},
	}),
  sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3600,
			lifetime: 1800,
		},
		users: {
			interval: 3600,
			filter: user => user.bot && user.id !== client.user.id,
		},
	},
});

client.commands = new Collection();
client.config = require('./handler/config');

require('./handler')(client);
require('dotenv').config();
require('./website/index');

client.login(process.env.token);