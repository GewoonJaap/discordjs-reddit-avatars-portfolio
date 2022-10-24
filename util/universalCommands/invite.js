const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
module.exports = {
  execute: async function (bot) {
    const embed = new MessageEmbed();
    embed.setTitle('Invite me to your server!');
    embed.setDescription(`Click [here](${config.BOT_INVITE}) to invite me to your server!`);
    embed.setColor(bot.COLOR);
    embed.setTimestamp();
    return embed;
  },
  description: 'Get my invite link',
};
