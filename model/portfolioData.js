const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema(
  {
    discordId: String,
    ETHWallet: String,
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

module.exports = mongoose.model('portfolioData', portfolioSchema);
