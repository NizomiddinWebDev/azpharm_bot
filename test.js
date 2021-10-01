const {Telegraf} = require('telegraf')
const fs = require('fs');

const token = "1632531175:AAFoAGdG10a60-C2R9ZWA2cq_YYU548waFk"

const bot = new Telegraf(token)

bot.start((ctx)=>{
    ctx.reply("Assalomu alaykum "+ctx.from.username)
})

bot.launch()


