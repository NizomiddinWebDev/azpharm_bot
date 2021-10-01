const {
  Telegraf,
  Markup,
  Scenes,
  Stage,
  Composer,
  session,
} = require("telegraf");
const express = require("express");
const postgres = require("./postgres");
const psql = postgres();
require("dotenv").config();

const bot = new Telegraf("1738150945:AAHsWOr-DFEvXvp2mOBdTqosE5w7FYRnTQU");

const startWizard = new Composer();
startWizard.start(async (ctx) => {
  let lang = await get_lang(ctx);
  let text = "";
  if (lang === "uz") {
    text = `1/3\n<i>Ismingizni kiriting</i>`;
  } else {
    text = `1/3\n<i>Введите ваше имя</i>`;
  }
  ctx.wizard.state.data = {};
  await ctx.replyWithHTML(text);
  return ctx.wizard.next();
});
startWizard.action(["uz", "ru"], async (ctx) => {
  let lang = await get_lang(ctx);
  let text = "";
  if (lang === "uz") {
    text = `1/3\n<i>Ismingizni kiriting</i>`;
  } else {
    text = `1/3\n<i>Введите ваше имя</i>`;
  }
  ctx.wizard.state.data = {};
  await ctx.replyWithHTML(text);
  return ctx.wizard.next();
});
const firstNameWizard = new Composer();
firstNameWizard.on("text", async (ctx) => {
  let lang = await get_lang(ctx);
  let text = "";
  let contactSend = "";
  if (lang === "uz") {
    contactSend = "Kontaktni yuborish";
    text = `2/3\n<i>${ctx.message.text} kontaktingizni jo'nating yoki telefon raqamingizni yozib yuboring</i>`;
  } else {
    contactSend = "Отправить контакт";
    text = `2/3\n<i>${ctx.message.text} отправьте свой контакт или запишите свой номер телефона</i>`;
  }
  ctx.wizard.state.data.firstName = ctx.message.text;
  ctx.wizard.state.data.name_id = ctx.message.chat.id;
  await ctx.replyWithHTML(
    text,
    Markup.keyboard([Markup.button.contactRequest(contactSend)])
      .oneTime()
      .resize()
  );
  return ctx.wizard.next();
});
const contactWizard = new Composer();
contactWizard.on(["contact", "text"], async (ctx) => {
  try {
    let lang = await get_lang(ctx);
    let text = "";
    let locat = "";
    if (lang === "uz") {
      locat = "📍 lokatsiya manzilini yuborish";
      text = `3/3\n<i>locatsiya manzilingizni yuboring</i>`;
    } else {
      locat = "📍 отправить адрес местонахождения";
      text = `3/3\n<i>отправь свой адрес местонахождения</i>`;
    }
    ctx.wizard.state.data.contact =
      ctx.message.contact.phone_number || ctx.message.text;
    ctx.wizard.state.data.contact_id = ctx.message.chat.id;
    await ctx.replyWithHTML(
      text,
      Markup.keyboard([Markup.button.locationRequest(locat)])
        .oneTime()
        .resize()
    );
    return ctx.wizard.next();
  } catch (error) {
    await ctx.replyWithHTML("Siz kontakt yubormadingiz!!!")
  }
});
const locationWizard = new Composer();
locationWizard.on(["location", "text"], async (ctx) => {
  try {
    ctx.wizard.state.data.longitude =
      ctx.message.location.longitude || ctx.message.text;
    ctx.wizard.state.data.latitude =
      ctx.message.location.latitude || ctx.message.text;
    console.log(ctx.wizard.state.data.firstName);
    console.log(ctx.wizard.state.data.contact);
    await psql
      .then(async (Appeal) => {
        let isUser = await Appeal.apeals.findOne({
          where: {
            chat_id: ctx.from.id,
          },
        });
        if (!isUser) {
          await Appeal.apeals.create({
            chat_id: ctx.chat.id,
            full_name: `${ctx.wizard.state.data.firstName}`,
            phone_number: ctx.wizard.state.data.contact,
            location_longitude: ctx.wizard.state.data.longitude,
            location_latitude: ctx.wizard.state.data.latitude,
          });
        }
      })
      .catch((e) => console.error(e));
    let lang = await get_lang(ctx);
    let text = "";
    if (lang === "uz") {
      text = `<b>Murojatingiz qabul qilindi,tez fursatda siz bilan bog'lanishadi!!!\nqayta murojat uchun /start bosing</b>`;
    } else {
      text = `<b>Ваш запрос принят, и мы свяжемся с вами в ближайшее время !!!</b>`;
    }
    console.log(ctx.message.chat.id);
    await ctx.telegram.sendVenue(
      -514648240,
      ctx.message.location.latitude,
      ctx.message.location.longitude,
      ctx.wizard.state.data.firstName,
      ctx.wizard.state.data.contact
    );
    await ctx.replyWithHTML(
      text,
      Markup.keyboard([["qayta murojat yuborish"]])
    );
    return ctx.scene.leave();
  } catch (error) {
    console.error(error);
    ctx.replyWithHTML(
      "<b>❌Xatolik yuz berdi iltimos locatsiyani tori yuboring!!!\n/start=>qayta boshlash</b>"
    );
    return ctx.scene.leave();
  }
});
const menuScene = new Scenes.WizardScene(
  "sceneWizard",
  startWizard,
  firstNameWizard,
  contactWizard,
  locationWizard
);
const stage = new Scenes.Stage([menuScene]);
bot.use(session());
bot.use(stage.middleware());
bot.start(async (ctx) => {
  const is_user = await get_user(ctx);
  if (is_user) {
    await ctx.scene.enter("sceneWizard");
  } else {
    ctx.replyWithHTML(
      `<b>Qaysi tilni tanlaysiz?</b>\n\n<b>Какой бы язык вы ни выбрали?</b>`,
      Markup.inlineKeyboard([
        Markup.button.callback("Ру 🇷🇺", "ru"),
        Markup.button.callback("Uz 🇺🇿", "uz"),
      ])
    );
  }
});

bot.action("uz", async (ctx) => {
  await userTableLang(ctx, "uz");
  await ctx.replyWithHTML("<b>O'zbek tili tanlandi</b>");
  await ctx.scene.enter("sceneWizard");
});

bot.action("ru", async (ctx) => {
  await userTableLang(ctx, "ru");
  await ctx.replyWithHTML("<b>Русский был выбран</b>");
  await ctx.scene.enter("sceneWizard");
});
bot.launch();
async function userTableLang(ctx, lang) {
  await psql
    .then(async (User) => {
      let isUser = await User.user.findOne({
        where: {
          chat_id: ctx.from.id,
        },
      });
      if (!isUser) {
        await User.user.create({
          chat_id: ctx.chat.id,
          language: lang,
        });
      } else if (isUser) {
        await User.user.update(
          {
            language: lang,
          },
          {
            where: {
              chat_id: ctx.chat.id,
            },
          }
        );
      }
    })
    .catch((e) => console.error(e));
}

async function get_lang(ctx) {
  await psql.then(async (User) => {
    is_user = await User.user.findOne({
      where: {
        chat_id: ctx.from.id,
      },
    });
  });
  return await is_user["dataValues"]["language"];
}

async function get_user(ctx) {
  await psql.then(async (User) => {
    is_user = await User.user.findOne({
      where: {
        chat_id: ctx.from.id,
      },
    });
  });
  return await is_user;
}
