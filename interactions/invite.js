const slashCommand = require('../util/slashcommand/index');
const invite = require('../util/universalCommands/invite');
module.exports = {
  registerCommand: function (bot) {
    slashCommand.registerCommand(bot, {
      name: 'invite',
      description: invite.description,
    });
  },

  execute: async function (bot, interaction) {
    const embed = await invite.execute(bot);
    slashCommand.execute(bot, interaction, {
      embeds: [embed],
    });
  },
};
