const slashCommand = require('../util/slashcommand/index');
const redditAvatar = require('../util/universalCommands/redditavatar');
module.exports = {
  registerCommand: function (bot) {
    slashCommand.registerCommand(bot, {
      name: 'redditavatar',
      description: redditAvatar.description,
      options: [
        {
          name: 'ethaddress',
          description: 'The ETH/Polygon address of the user',
          type: 3,
          required: false,
        },
        {
          name: 'redditusername',
          description: 'The Reddit username of the user',
          type: 3,
          required: false,
        },
      ],
    });
  },

  execute: async function (bot, interaction) {
    //option is nullable
    const options = interaction.data.options;
    let address = undefined;
    let redditUsername = undefined;
    if (options) {
      address = options.filter(option => option.name === 'ethaddress')[0]?.value;
      redditUsername = options.filter(option => option.name === 'redditusername')[0]?.value;
    }
    const embed = await redditAvatar.execute(bot, address, redditUsername, interaction);

    slashCommand.execute(bot, interaction, {
      embeds: [embed],
    });
  },
};
