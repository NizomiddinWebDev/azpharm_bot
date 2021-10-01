const {
  Telegraf,
  Markup,
  Scenes,
  Stage,
  Composer,
  session,
} = require("telegraf");
const translate = require("@vitalets/google-translate-api");
require("dotenv").config();
const { languages, languageBreak, kB } = require("./keyboard/keyboard");
const token = process.env.BOT_TOKEN;

const bot = new Telegraf(token);

const translate1 = new Composer();

translate1.action(
  [
    kB.uzb[1],
    kB.arab[1],
    kB.china[1],
    kB.eng[1],
    kB.frans[1],
    kB.german[1],
    kB.hindi[1],
    kB.italian[1],
    kB.japan[1],
    kB.kazak[1],
    kB.korea[1],
    kB.portugal[1],
    kB.russ[1],
    kB.turk[1],
    kB.ukrain[1],
    kB.usa[1],
  ],
  async (ctx) => {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.lang1 = ctx.update.callback_query.data
    await ctx.editMessageText("Tarjima tili:", languageBreak, {
      parse_mode: "HTML",
    });
    return ctx.wizard.next()
  }
)
const translate2 = new Composer()
translate2.action(
  [
    kB.uzb[1],
    kB.arab[1],
    kB.china[1],
    kB.eng[1],
    kB.frans[1],
    kB.german[1],
    kB.hindi[1],
    kB.italian[1],
    kB.japan[1],
    kB.kazak[1],
    kB.korea[1],
    kB.portugal[1],
    kB.russ[1],
    kB.turk[1],
    kB.ukrain[1],
    kB.usa[1],
  ],
  async (ctx) => {
    ctx.wizard.state.data.lang2 = ctx.update.callback_query.data
    await ctx.replyWithHTML(
      "So'zni kiriting",
      Markup.inlineKeyboard([Markup.button.callback(kB.back[0], kB.back[1])])
    );
  }
)
translate2.on("text", async (ctx) => {
  try {
    translateGoogle(ctx);
  } catch (error) {
    console.log(error + " tranlate2 da xatolik");
  }
})

const menuScene = new Scenes.WizardScene(
  "sceneWizard",
  translate1,
  translate2
);
const stage = new Scenes.Stage([menuScene]);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.replyWithHTML(
    "<i>Assalomu alaykum " +
      ctx.from.first_name +
      "\nBotimizga hush kelibsiz</i>"
  );
  await ctx.replyWithHTML("<b>Manba tilini tanlang:</b>", languages);
  await ctx.scene.enter("sceneWizard");
}).catch((err)=>{
  console.error(err+" bot startda xatolik")
});

bot.action(kB.back[1], async (ctx) => {
  await ctx.editMessageText("Manba tilini tanlang:", languages);
  await ctx.scene.enter("sceneWizard");
}).catch((err)=>{
  console.error(err+" bot actionda xatolik")
})

bot.launch();

function translateGoogle(ctx) {
  translate(ctx.message.text, { from: ctx.wizard.state.data.lang1, to: ctx.wizard.state.data.lang2 })
    .then((res) => {
      ctx.reply(res.text,Markup.inlineKeyboard([Markup.button.callback(kB.back[0], kB.back[1])]));
    })
    .catch((err) => {
      console.error(err);
    });
}
