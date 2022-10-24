const { MessageEmbed } = require('discord.js');
const request = require('../apiRequest');
const portfolioData = require('../../model/portfolioData');
module.exports = {
  execute: async function (bot, option, interaction) {
    if(!option){
      const dbData = await portfolioData.findOne({discordId: interaction.member.user.id});
      if(!dbData){
        const embed = new MessageEmbed()
          .setColor(bot.COLOR)
          .setTitle('Portfolio')
          .setDescription('You have not set your ETH address yet. Do so with /setwallet <address>')
          .setTimestamp();
        return embed;
      }
      option = dbData.ETHWallet;
    }

    //https://redditportfolio.com/api/finance/avatars?wallet=0x511A0342fD98d25083588aC8243c3065CfD2CcA5
    const data = await request.execute(`https://redditportfolio.com/api/finance/avatars?wallet=${option}`);

    if(!data.status){
      let errorEmbed = new MessageEmbed();
      errorEmbed.setColor(bot.COLOR);
      errorEmbed.setTitle('Error');
      errorEmbed.setDescription('Something went wrong, please try again later');
      return errorEmbed;
    }
    let ETHPriceLastSale = 0;
    let ETHPriceFloor = 0;
    data.data.avatars.forEach(avatar => {
      ETHPriceLastSale += data.data.prices[avatar].last_sale;
      ETHPriceFloor += data.data.prices[avatar].floor_price;
    });

    //map avatar array to object with avatar name and count amount of times avatar is in array, last_sale and floor_price
    const avatarMap = data.data.avatars.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});

    const avatarArray = [];
    for (const [key, value] of Object.entries(avatarMap)) {
      avatarArray.push({
        name: key,
        count: value,
        last_sale: data.data.prices[key].last_sale,
        floor_price: data.data.prices[key].floor_price,
        generation: data.data.prices[key].generation,
      });
    };

    //sort avatarArray by floor_price
    avatarArray.sort((a, b) => (b.floor_price > a.floor_price) ? 1 : -1);
    
    //generate embed field text, max 1024 characters
    let embedFieldTexts = [''];
    let embedFieldTextIndex = 0;
    avatarArray.forEach(avatar => {
      if(calculateTotalTextCharsInArray(embedFieldTexts) >= 5000) return;
      if(embedFieldTextIndex > 20) return;

      let newText = `**${avatar.name} (${avatar.count})** | Last sale price: **${avatar.last_sale} ETH** | Floor price: **${avatar.floor_price} ETH** | Generation: **${avatar.generation}**\n`;

      if(embedFieldTexts[embedFieldTextIndex].length + newText.length + 1 > 1024){
        embedFieldTextIndex++;
        embedFieldTexts.push('');
      }
      embedFieldTexts[embedFieldTextIndex] += newText;
    });



    let USDPriceLastSale = data.data.conversion * ETHPriceLastSale;
    let USDPriceFloor = data.data.conversion * ETHPriceFloor;

    const embed = new MessageEmbed();
    embed.setTitle(`Portfolio of ${option}`);
    embed.addField(`Total last sale value:`, `${USDPriceLastSale.toFixed(2)} USD | ${ETHPriceLastSale.toFixed(2)} ETH`);
    embed.addField(`Total floor value:`, `${USDPriceFloor.toFixed(2)} USD | ${ETHPriceFloor.toFixed(2)} ETH`);
    embed.addField(`Total avatars:`, `${avatarArray.length}`);
    embedFieldTexts.forEach((text, index) => {
      embed.addField(`Avatars (${index + 1}/${embedFieldTexts.length}):`, text);
    });
    embed.setFooter(`Powered by RedditPortfolio.com`);
    embed.setTimestamp(new Date(data.data.sync.toString()));
    embed.setAuthor(`${interaction.member.user.username}#${interaction.member.user.discriminator}`, 'https://i.imgur.com/Zstqe11.png', 'https://redditportfolio.com/');
    return embed;

  },
  description: 'Check the Reddit Avatars portfolio of a Ethereum/Polygon address',
};

function calculateTotalTextCharsInArray(array){
  let totalChars = 0;
  array.forEach(element => {
    totalChars += element.length;
  });
  return totalChars;
}

