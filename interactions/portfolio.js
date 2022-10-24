const slashCommand = require('../util/slashcommand/index');
const portfolio = require('../util/universalCommands/portfolio');
module.exports = {
  registerCommand: function (bot) {
    slashCommand.registerCommand(bot, {
      name: 'portfolio',
      description: portfolio.description,
      options: [
        {
          name: 'ethaddress',
          description: 'The ETH/Polygon address of the user',
          type: 3,
          required: true,
        },
      ],
    });
  },

  execute: async function (bot, interaction) {
    const address = interaction.data.options[0].value;
    const embed = await portfolio.execute(bot, address, interaction);

    slashCommand.execute(bot, interaction, {
      embeds: [embed],
    });
  },
};
