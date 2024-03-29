import fs from 'fs';
import { Client, Intents } from 'discord.js';

import config from '../config';
import data from './data';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    // Ignore self
    if (msg.author.id === client.user.id) return;

    data.setLast(msg.guild.id, msg.author.id);

    const tokens = msg.content.split(/\s+/);

    if (tokens.length < 2) return;

    if (tokens[0].toLowerCase() === 'my') {
        const getRes = data.get(msg.author.id, tokens.slice(1));
        if (getRes.length) {
            msg.channel.send(getRes.join(' '));
        } else if (tokens.length > 2) {
            data.set(msg.author.id, tokens.slice(1));
        }
    }

    if (/^(yo)?ur$/i.test(tokens[0])) {
        const userId = data.getLast(msg.guild.id, msg.author.id);
        const getRes = data.get(userId, tokens.slice(1));
        if (getRes.length) {
            msg.channel.send(getRes.join(' '));
        }
    }

    if (/('s|s')$/i.test(tokens[0])) {
        const match = tokens[0].match(/^(.+)'s?$/i);
        if (match) {
            const userId = data.getAlias(match[1].toLowerCase());
            const getRes = data.get(userId, tokens.slice(1));
            if (getRes.length) {
                msg.channel.send(getRes.join(' '));
            }
        }
    }

    if (tokens.length < 3) return;

    if (tokens[0].toLowerCase() === 'alias' && (msg.author.id === config.ownerId || msg.author.id === tokens[2])) {
        data.setAlias(tokens[1].toLowerCase(), tokens[2]);
    }

    if (tokens[0].toLowerCase() === 'reset' && tokens[1].toLowerCase() === 'my') {
        data.reset(msg.author.id, tokens.slice(2));
    }
});

data.loadData((res) => {
    if (res) {
        data.saveBackup();
        setInterval(() => data.saveData(), 1000 * 60 * 60);
        setInterval(() => data.saveBackup(), 7 * 24 * 1000 * 60 * 60);
        client.login(config.token);
    } else {
        console.log('Exiting...');
    }
});
