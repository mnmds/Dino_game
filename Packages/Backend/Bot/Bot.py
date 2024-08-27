import asyncio
import logging

from aiogram import Bot, Dispatcher, types, F, Router
from aiogram.enums import ParseMode
from aiogram.filters.command import Command
from aiogram.types import FSInputFile

from db import DataBase
from config import TG_BOT_TOKEN, ADMINS
from admin import IsAdmin, Admin

bot = Bot(token=TG_BOT_TOKEN)
db = DataBase()
# db.db__clear()
db.init()
dp = Dispatcher()
logging.basicConfig(level=logging.INFO)

last_message_id = None
admin = Admin()

max_level = 9


def start__get_keyboard():
    buttons = [
        [
            types.InlineKeyboardButton(text="Наш тг канал", url="https://t.me/genshindropcom"),
            types.InlineKeyboardButton(text="Купить гемы", url="genshindrop.com"),
            types.InlineKeyboardButton(text="Играть", callback_data="a")
        ],
    ]
    return types.InlineKeyboardMarkup(inline_keyboard=buttons)


# @dp.message(Command('ref'))
# async def cmd_ref(message: types.Message):
#     async with ChatActionSender.typing(bot=bot, chat_id=message.from_user.id):
#         text = (f'🚀 Вот твоя персональная ссылка на приглашение: '
#                 f'https://t.me/testmmn_bot?start={message.from_user.id}')
#     await message.answer(text)


@dp.message(Command('start'))
async def process_start_command(message: types.Message, bot: Bot):
    db.connection__open()
    tg_id = message.from_user.id
    user = db.user__get(tg_id)
    referral = db.referral__get(tg_id)

    image_from_pc = FSInputFile("images/start.jpg")
    await message.answer_photo(
        image_from_pc,

        caption=f"*ПОМОГИ ГДЗАВРИКУ ДОСТАВИТЬ ГЕМЫ\!* 💎\n\n"
                f"Команда [genshindrop\.com](https://genshindrop.top/gdshop) "
                f"каждый день доставляет больше и больше гемов на аккаунты\.\n"
                f"*И нашим гдзаврикам нужна твоя помощь\!*\n\n"
                f"🔸 Помогай гдзаврику доставлять гемы\n"
                f"🔸 Прокачивай его уровень\n"
                f"🔸 Приглашай друзей\n"
                f"🔸 Получай награды за это\!\n\n"
                f"Будь лучшим гдзавриком в этой вселенной\! 💚\n\n"
                f"А если нужны гемы на аккаунт 👇",

        parse_mode=ParseMode.MARKDOWN_V2,
        reply_markup=start__get_keyboard()
    )

    if not user:
        db.user__add(tg_id)
        # await message.answer(f'Вы зарегестрировались')

    if len(message.text.split()) != 2:
        # await message.answer(f'Вы уже авторизованы')
        db.connection__cose()

        return

    host_tg_id = message.text.split()[-1]

    if int(host_tg_id) != int(tg_id):
        # invitation_date = time.time()
        # payment = 50

        # if message.from_user.is_premium:
        #     payment = 200

        db.referral__add(host_tg_id, tg_id)
        host_tg_info = await bot.get_chat(host_tg_id)
    #     await message.answer(f'Вас добавил пользователь @{host_tg_info.username}')
    # elif host_tg_id == tg_id:
    #     await message.answer(f'Нельзя добавить самого себя')
    # elif referral:
    #     await message.answer(f'Вас уже добавил пользователь')

    db.connection__cose()


@dp.message(IsAdmin(ADMINS), Command("admin"))
async def cmd_admin(message: types.Message):
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@dp.callback_query(F.data.startswith("admin__"))
async def callbacks_num(callback: types.CallbackQuery):
    action = callback.data.split("__")[1]

    if action == "quests":
        await admin.quests(callback.message)
    if action == "quest_add":
        await admin.quests_add(callback.message)
    if action == "quest_remove":
        await admin.quests_remove(callback.message)

    if action == "heroes":
        await admin.heroes(callback.message)
    if action == "newsletter":
        await admin.newsletter(callback.message)
    if action == "promocodes":
        await admin.promocodes(callback.message)
    if action == "statistics":
        await admin.statistics(callback.message, max_level)
    if action == "back":
        await admin.panel(callback.message)

    await callback.answer()


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
