const { MessageEmbed } = require('discord.js');
const request = require('../apiRequest');
const portfolioData = require('../../model/portfolioData');
module.exports = {
  execute: async function (bot, address, redditUsername, interaction) {
    if (!address && !redditUsername) {
      const data = await portfolioData.findOne({ discordId: interaction.member.user.id });
      if (!data || !data.RedditUsername) {
        const embed = new MessageEmbed()
          .setColor(bot.COLOR)
          .setTitle('Portfolio')
          .setDescription('You have not set your Reddit username yet. Do so with /setusername <address>')
          .setTimestamp();
        return embed;
      }
      redditUsername = data.RedditUsername;
    }

    if (address && !redditUsername) {
      const data = await portfolioData.findOne({ ETHWallet: address });
      if (!data || !data.RedditUsername) {
        const embed = new MessageEmbed()
          .setColor(bot.COLOR)
          .setTitle('Portfolio')
          .setDescription('This address has not set their Reddit username yet.')
          .setTimestamp();
        return embed;
      }
      redditUsername = data.RedditUsername;
    }

    if (redditUsername.startsWith('u/')) {
      redditUsername = redditUsername.split('u/')[1];
    }
    const response = await request.execute(`https://www.reddit.com/user/${redditUsername}/about.json`);
    if (!response || !response.data) {
      let errorEmbed = new MessageEmbed();
      errorEmbed.setColor(bot.COLOR);
      errorEmbed.setTitle('Error');
      errorEmbed.setDescription('Something went wrong, are you sure the user exists on Reddit? Please try again later');
      return errorEmbed;
    }
    const avatar = response.data.data.snoovatar_img;

    if (!avatar || avatar.length == 0) {
      let errorEmbed = new MessageEmbed();
      errorEmbed.setColor(bot.COLOR);
      errorEmbed.setTitle('Error');
      errorEmbed.setDescription('Something went wrong, are you sure the user has a Reddit avatar? Please try again later');
      return errorEmbed;
    }

    const embed = new MessageEmbed();
    embed.setColor(bot.COLOR);
    embed.setTitle(`Reddit Avatar for ${redditUsername}`);
    embed.setImage(avatar);
    embed.setTimestamp();
    embed.setAuthor(`u/${redditUsername}`, avatar, `https://www.reddit.com/user/${redditUsername}`);
    return embed;
  },
  description: 'Check the Reddit avatar of a user',
};
