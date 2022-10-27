const { MessageEmbed } = require('discord.js');
const portfolioData = require('../../model/portfolioData');
const request = require('../apiRequest');
module.exports = {
  execute: async function (bot, option, interaction) {
    if (option.startsWith('u/')) {
      option = option.split('u/')[1];
    }

    const response = await request.execute(`https://www.reddit.com/user/${option}/about.json`);
    if (!response || !response.data) {
      let errorEmbed = new MessageEmbed();
      errorEmbed.setColor(bot.COLOR);
      errorEmbed.setTitle('Error');
      errorEmbed.setDescription('Something went wrong, are you sure the user exists on Reddit? Please try again later');
      return errorEmbed;
    }
    const publicDescription = response.data.data.subreddit.public_description;

    if (!publicDescription || !publicDescription.includes(interaction.member.user.id)) {
      let errorEmbed = new MessageEmbed();
      errorEmbed.setColor(bot.COLOR);
      errorEmbed.setTitle('Error');
      errorEmbed.setDescription(
        `Could not find your Discord ID (**${interaction.member.user.id}**) in the public description of u/${option}. Please add it and try again. [Click here to add](https://www.reddit.com/settings/profile)`
      );
      return errorEmbed;
    }

    //update or insert portfolioData
    await portfolioData.findOneAndUpdate(
      { discordId: interaction.member.user.id },
      { discordId: interaction.member.user.id, RedditUsername: option },
      { upsert: true }
    );

    const embed = new MessageEmbed()
      .setColor(bot.COLOR)
      .setTitle('Reddit username updated')
      .setDescription(`Your Reddit username has been set to ${option}`)
      .setTimestamp();
    return embed;
  },
  description: 'Update your Reddit username',
};
