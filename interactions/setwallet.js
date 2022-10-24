const slashCommand = require('../util/slashcommand/index');
const setwallet = require('../util/universalCommands/setwallet');
module.exports = {
  registerCommand: function (bot) {
    slashCommand.registerCommand(bot, {
      name: 'setwallet',
      description: setwallet.description,
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
    const embed = await setwallet.execute(bot, address, interaction);

    slashCommand.execute(bot, interaction, {
      embeds: [embed],
    });
  },
};
