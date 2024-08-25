import time
import asyncio
import logging
from random import randint

from aiogram import Bot, Dispatcher, types, F, Router
from aiogram.dispatcher import router
from aiogram.filters.command import Command
from aiogram.utils.chat_action import ChatActionSender

from aiogram.utils.keyboard import InlineKeyboardBuilder

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


@dp.message(Command('ref'))
async def cmd_ref(message: types.Message):
    async with ChatActionSender.typing(bot=bot, chat_id=message.from_user.id):
        text = (f'🚀 Вот твоя персональная ссылка на приглашение: '
                f'https://t.me/testmmn_bot?start={message.from_user.id}')
    await message.answer(text)


@dp.message(Command('start'))
async def process_start_command(message: types.Message, bot: Bot):
    db.connection__open()
    tg_id = message.from_user.id
    user = db.user__get(tg_id)
    referral = db.referral__get(tg_id)
    # print(user)

    if not user:
        db.user__add(tg_id)
        await message.answer(f'Вы зарегестрировались')
    # elif len(message.text.split()) == 1:
    #     await message.answer(f'Вы уже авторизованы')

    # else:
    #     await message.answer(f'Вы уже авторизованы')
    #
    #     return

    if len(message.text.split()) != 2:
        await message.answer(f'Вы уже авторизованы')
        db.connection__cose()

        return

    host_tg_id = message.text.split()[-1]
    print(host_tg_id)

    if int(host_tg_id) != int(tg_id):
        # invitation_date = time.time()
        # payment = 50

        # if message.from_user.is_premium:
        #     payment = 200

        db.referral__add(host_tg_id, tg_id)
        host_tg_info = await bot.get_chat(host_tg_id)
        await message.answer(f'Вас добавил пользователь @{host_tg_info.username}')
    elif host_tg_id == tg_id:
        await message.answer(f'Нельзя добавить самого себя')
    elif referral:
        await message.answer(f'Вас уже добавил пользователь')

    db.connection__cose()


@dp.message(Command('start'))
async def cmd_start(message: types.Message):
    await message.answer('Привет! Я бот!')


@dp.message(Command('help'))
async def cmd_help(message: types.Message):
    await message.answer('Можешь воспользоваться мини приложением, нажав на кнопку')


@dp.message(IsAdmin(ADMINS), Command("admin"))
async def cmd_admin(message: types.Message):
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@dp.callback_query(F.data.startswith("admin__"))
async def callbacks_num(callback: types.CallbackQuery):
    action = callback.data.split("__")[1]

    if action == "quests":
        await admin.quests(callback.message)
    if action == "heroes":
        await admin.heroes(callback.message)
    if action == "newsletter":
        await admin.newsletter(callback.message)
    if action == "promocodes":
        await admin.promocodes(callback.message)
    if action == "statistics":
        await admin.statistics(callback.message)
    if action == "back":
        await admin.panel(callback.message)

    await callback.answer()


@dp.message(Command("test"))
async def send_welcome(message: types.Message):
    global last_message_id
    if last_message_id:
        await bot.delete_message(chat_id=message.chat.id, message_id=last_message_id)

    new_message = await message.answer("Привет! Это новое сообщение.")
    last_message_id = new_message.message_id


@dp.message(F.text)
async def echo_with_time(message: types.Message):
    await message.answer('Не понял тебя... \nНапиши /help чтобы узнать мои возможности')


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
