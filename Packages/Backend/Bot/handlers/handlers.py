import asyncio
import logging
import os
import time
import zipfile
from datetime import datetime

from aiogram import Bot, Dispatcher, types, F, Router
from aiogram.enums import ParseMode
from aiogram.filters.command import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import FSInputFile, WebAppInfo

from db import DataBase
from config import TG_BOT_TOKEN, ADMINS
from admin import IsAdmin, Admin, AdminStates

bot = Bot(token=TG_BOT_TOKEN)
db = DataBase()
db.connection__open()
# db.db__clear()
db.init()
dp = Dispatcher()
router = Router()
logging.basicConfig(level=logging.INFO)

last_message_id = None
admin = Admin()

max_level = 9
link_newsletters = ''
hero_name = ''


# async def scheduler(message):
#     while True:
#         # print(datetime.now().weekday())
#         now = datetime.now()
#         # Проверяем, если сегодня понедельник
#         if now.weekday() == 6:  # 0 - понедельник
#             print(123)
#             # await message.answer(f"{now}")
#         #     # Проверяем, если время 10:00
#         #     if now.hour == 0 and now.minute == 5 and now.second == 0:
#         #         tg_ids = [item['tg_id'] for item in db.users__get_top()]
#         #         for tg_id in tg_ids:
#         #             await bot.send_message(chat_id=tg_id, text="Сообщение отправлено!")
#         #         # Ждем 60 секунд, чтобы избежать повторной отправки в течение минуты
#         #         time.sleep(60)


# @router.message(Command("time"))
# async def cmd_admin(message: types.Message):
#     # await message.answer("123")
#     # await scheduler(message)
#     tg_ids = [item['tg_id'] for item in db.users__get_top()]
#     for tg_id in tg_ids:
#         await bot.send_message(chat_id=tg_id, text="Сообщение отправлено!")

async def auto_posting():
    tg_ids = [item['tg_id'] for item in db.users__get_post()]
    for tg_id in tg_ids:
        await bot.send_message(chat_id=tg_id, text=f"Началась раздача на сайте")


async def promocodes_posting():
    tg_ids = [item['tg_id'] for item in db.users__get_top()]
    codes = [item['name'] for item in db.promocodes__get()]
    for content in zip(tg_ids, codes):
        await bot.send_message(chat_id=content[0], text=f"Вот твой персональный промокод: {content[1]}")


@router.message(Command('ref'))
async def cmd_ref(message: types.Message):
    await message.answer((f'🚀 Вот твоя персональная ссылка на приглашение: '
                          f'https://t.me/testmmn_bot?start={message.from_user.id}'))


def start__get_keyboard():
    buttons = [
        [
            types.InlineKeyboardButton(text="Наш тг канал", url="https://genshindrop.top/gdchannel"),
            types.InlineKeyboardButton(text="Купить гемы", url="https://genshindrop.top/gdshop"),
            types.InlineKeyboardButton(text="Играть", web_app=WebAppInfo(url=f'https://mnmds.github.io/Dino_game/'))
        ],
    ]
    return types.InlineKeyboardMarkup(inline_keyboard=buttons)


@router.message(Command('start'))
async def process_start_command(message: types.Message, bot: Bot):
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
        await message.answer(f'Вы зарегестрировались')

    if len(message.text.split()) != 2:
        # await message.answer(f'Вы уже авторизованы')

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


@router.message(IsAdmin(ADMINS), Command("admin"))
async def cmd_admin(message: types.Message):
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.callback_query(F.data.startswith("cancel"))
async def cancel(callback: types.CallbackQuery, state: FSMContext):
    await admin.panel(callback.message)
    await state.clear()


@router.callback_query(F.data.startswith("admin___"))
async def admin___commands(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()

    action = callback.data.split("___")[1]

    if action == 'quest_remove':
        await admin.quests_remove(callback.message)
        await state.set_state(AdminStates.waiting__quest_remove)
    elif action == 'quest_add':
        await admin.quests_add(callback.message)
        await state.set_state(AdminStates.waiting__quest_add)
    elif action == 'product_remove':
        await admin.products_remove(callback.message)
        await state.set_state(AdminStates.waiting__product_remove)
    elif action == 'product_add':
        await admin.products_add(callback.message)
        await state.set_state(AdminStates.waiting__product_add)
    elif action == 'newsletters':
        await admin.newsletters_state_link(callback.message)
        await state.set_state(AdminStates.waiting__newsletters)
    elif action == 'promocode_remove':
        await admin.promocodes_remove(callback.message)
        await state.set_state(AdminStates.waiting__promocode_remove)
    elif action == 'promocode_add':
        await admin.promocodes_add(callback.message)
        await state.set_state(AdminStates.waiting__promocode_add)
    elif action == "users":
        await admin.users(callback.message)
        await state.set_state(AdminStates.waiting__users)


@router.message(AdminStates.waiting__quest_remove)
async def quests_remove_state(message: types.Message, state: FSMContext):
    await admin.quests_remove_state(message)
    await state.clear()
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__quest_add)
async def quests_add_state(message: types.Message, state: FSMContext):
    await admin.quests_add_state(message)
    await state.clear()
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__product_remove)
async def products_remove_state(message: types.Message, state: FSMContext):
    await admin.products_remove_state(message)
    await state.clear()
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__product_add)
async def products_add_state(message: types.Message, state: FSMContext):
    global hero_name

    key = await admin.products_add_file(message)
    if key:
        hero_name = key
        await state.set_state(AdminStates.waiting__product_info)
    else:
        await state.clear()
        await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__product_info)
async def products_add_state(message: types.Message, state: FSMContext):
    global hero_name

    await admin.products_add_state(message, hero_name)
    await state.clear()
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__newsletters)
async def newsletters_state(message: types.Message, state: FSMContext):
    global link_newsletters
    link_newsletters = message.text
    if '|' in link_newsletters:
        link_newsletters = link_newsletters.split('|')
        await admin.newsletters_state_message(message)
        await state.set_state(AdminStates.waiting__newsletters_link)
    else:
        await message.answer("Некорректный формат")
        await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__newsletters_link)
async def newsletters_state(message: types.Message, state: FSMContext):
    global link_newsletters
    if admin.is_valid_url(link_newsletters[1]):
        await admin.newsletters_state(message, link_newsletters[0], link_newsletters[1])
        link_newsletters = ''
        await state.clear()
    else:
        await message.answer("Некорректная ссылка")
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__promocode_remove)
async def quests_remove_state(message: types.Message, state: FSMContext):
    await admin.promocodes_remove_state(message)
    await state.clear()
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__promocode_add)
async def quests_add_state(message: types.Message, state: FSMContext):
    await admin.promocodes_add_state(message)
    await state.clear()
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.message(AdminStates.waiting__users)
async def quests_add_state(message: types.Message, state: FSMContext):
    await admin.users_get(message)
    await state.clear()
    await message.answer("Админ панель", reply_markup=admin.get_keyboard())


@router.callback_query(F.data.startswith("admin__"))
async def admin__commands(callback: types.CallbackQuery):
    action = callback.data.split("__")[1]

    if action == "quests":
        await admin.quests(callback.message)
    elif action == "products":
        await admin.products(callback.message)
    elif action == "newsletters":
        await admin.newsletters(callback.message)
    elif action == "promocodes":
        await admin.promocodes(callback.message)
    elif action == "statistics":
        await admin.statistics(callback.message, max_level)
    elif action == "back":
        await admin.panel(callback.message)

    await callback.answer()
