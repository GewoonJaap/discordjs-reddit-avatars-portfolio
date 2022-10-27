const slashCommand = require('../util/slashcommand/index');
const setRedditUsername = require('../util/universalCommands/setredditusername');
module.exports = {
  registerCommand: function (bot) {
    slashCommand.registerCommand(bot, {
      name: 'setusername',
      description: setRedditUsername.description,
      options: [
        {
          name: 'redditusername',
          description: 'Your Reddit username',
          type: 3,
          required: true,
        },
      ],
    });
  },

  execute: async function (bot, interaction) {
    const address = interaction.data.options[0].value;
    const embed = await setRedditUsername.execute(bot, address, interaction);

    slashCommand.execute(bot, interaction, {
      embeds: [embed],
    });
  },
};
