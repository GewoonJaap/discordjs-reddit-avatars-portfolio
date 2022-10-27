const { MessageEmbed } = require('discord.js');
const portfolioData = require('../../model/portfolioData');
module.exports = {
  execute: async function (bot, option, interaction) {
    //update or insert portfolioData
    await portfolioData.findOneAndUpdate(
      { discordId: interaction.member.user.id },
      { discordId: interaction.member.user.id, ETHWallet: option },
      { upsert: true }
    );

    const embed = new MessageEmbed()
      .setColor(bot.COLOR)
      .setTitle('Wallet updated')
      .setDescription(`Your ETH address has been set to ${option}`)
      .setTimestamp();
    return embed;
  },
  description: 'Update your ETH/Polygon address',
};
