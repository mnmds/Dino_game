import asyncio
import logging
import os
import zipfile

from aiogram import Bot, Dispatcher, types, F, Router
from aiogram.enums import ParseMode
from aiogram.filters import StateFilter
from aiogram.filters.command import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import FSInputFile

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


def start__get_keyboard():
    buttons = [
        [
            types.InlineKeyboardButton(text="Наш тг канал", url="https://t.me/genshindropcom"),
            types.InlineKeyboardButton(text="Купить гемы", url="genshindrop.com"),
            types.InlineKeyboardButton(text="Играть", callback_data="a")
        ],
    ]
    return types.InlineKeyboardMarkup(inline_keyboard=buttons)


@router.message(Command('start'))
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
        await message.answer(f'Вы зарегестрировались')

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
    await admin.newsletters_state_message(message)
    await state.set_state(AdminStates.waiting__newsletters_link)


@router.message(AdminStates.waiting__newsletters_link)
async def newsletters_state(message: types.Message, state: FSMContext):
    global link_newsletters
    await admin.newsletters_state(message, link_newsletters)
    link_newsletters = ''
    await state.clear()
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
