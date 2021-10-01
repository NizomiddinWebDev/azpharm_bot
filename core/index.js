const {Telegraf} = require('telegraf')
const fs = require('fs');
const path = require('path')
const ytdl = require('ytdl-core');
const { randomUUID } = require('crypto');
require("dotenv").config();
const token = process.env.BOT_TOKEN

const bot = new Telegraf(token)
bot.command('hi',async (ctx)=>{
    const fileName = ctx.from.id;
    await ctx.reply("Jonatilmoqda")
    await ctx.replyWithVideo({ source:`videos/${fileName}.mp4`})
    await ctx.reply("Jonatildi")
})
bot.on('message',async (ctx)=>{
    try {
        const msg = ctx.message.text;
        const fileName = ctx.from.id;
        console.log(msg.startsWith("https://youtu.be"))
        if(msg.startsWith("https://youtu.be")){
            await downloadVideoYoutube(msg,fileName)
            await ctx.reply("Yuklanmoqda...")
            await bot.telegram.editMessageText(
                ctx.chat.id,
                ctx.message.message_id + 1,
                0,
                `Yakunlandi...`
              );
        }else{
            ctx.reply("Xato Youtubedan link tashlang!")
        }
    } catch (error) {
        console.log(error+" xatolik message !!!")
    }
})

bot.launch()

async function downloadVideoYoutube(ctx,fileName) {
    // const fileName = randomUUID()
    console.log(fileName)
    ytdl(ctx)
    .pipe(fs.createWriteStream(`videos/${fileName}.mp4`))
    return
}
// async function facebookVideoDownload(urlName,ctx){
// const url = urlName
// facebookGetLink(url).then(async(response) => {
//     console.log(response)
//   await  ctx.replyWithVideo({url:response.link},{
//       caption:response.caption
//   })
// })


// }

