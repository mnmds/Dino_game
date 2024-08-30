import os
import shutil
import zipfile
import re
import sys


from aiogram.filters import BaseFilter
from aiogram import types, Bot
from aiogram.fsm.state import StatesGroup, State

from config import TG_BOT_TOKEN
from db import DataBase

sys.path.append(os.path.abspath(os.path.join(os.path.dirname('admin.py'), '../Game_manager/')))
from Game_manager import Game_manager


db = DataBase()
bot = Bot(token=TG_BOT_TOKEN)


class IsAdmin(BaseFilter):
    def __init__(self, admin_ids) -> None:
        self.admin_ids = admin_ids

    async def __call__(self, message: types.Message) -> bool:
        return message.from_user.id in self.admin_ids


class AdminStates(StatesGroup):
    waiting = State()
    waiting__quest_remove = State()
    waiting__quest_add = State()
    waiting__product_remove = State()
    waiting__product_add = State()
    waiting__product_info = State()
    waiting__newsletters = State()
    waiting__newsletters_link = State()
    waiting__promocode_remove = State()
    waiting__promocode_add = State()
    waiting__users = State()


class Admin:
    def __init__(self):
        pass

    def is_valid_url(self, url):
        pattern = re.compile(
            r'^(?:http|ftp)s?://'  # http:// или https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # доменное имя
            r'localhost|'  # локальный хост
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|'  # IP-адрес
            r'\[?[A-F0-9]*:[A-F0-9:]+\]?)'  # IPv6
            r'(?::\d+)?'  # порт
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return re.match(pattern, url) is not None

    def is_digit(self, string):
        if string.isdigit():
            return True
        else:
            try:
                float(string)
                return True
            except ValueError:
                return False

    @staticmethod
    def get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Задания", callback_data="admin__quests"),
                types.InlineKeyboardButton(text="Персонажи", callback_data="admin__products")
            ],
            [
                types.InlineKeyboardButton(text="Рассылка", callback_data="admin___newsletters"),
                types.InlineKeyboardButton(text="Промокоды", callback_data="admin__promocodes")
            ],
            [types.InlineKeyboardButton(text="Статистика", callback_data="admin__statistics")],
            [types.InlineKeyboardButton(text="Пользователи", callback_data="admin___users")]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def quests_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Убрать", callback_data="admin___quest_remove"),
                types.InlineKeyboardButton(text="Добавить", callback_data="admin___quest_add")
            ],
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def products_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Убрать", callback_data="admin___product_remove"),
                types.InlineKeyboardButton(text="Добавить", callback_data="admin___product_add")
            ],
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def newsletters_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def promocodes_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Убрать", callback_data="admin___promocode_remove"),
                types.InlineKeyboardButton(text="Добавить", callback_data="admin___promocode_add")
            ],
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def statistics_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def quests_back_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__quests")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def users_back_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def cancel_keybord():
        buttons = [
            [
                types.InlineKeyboardButton(text="отмена", callback_data="cancel")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    async def quests(self, message: types.Message):
        quests = db.quests__get()

        output = []
        for quest in quests:
            output.append(f"{quest['name']}, {quest['description']}, {quest['url']}")
        text = "\n".join(output)

        await message.edit_text(
            f"Квесты (имя, награда, ссылка):\n"
            f"{text}",
            reply_markup=self.quests_get_keyboard()
        )

    async def quests_add(self, message: types.Message):
        await message.edit_text(
            f"Напишите новое задание в формате: имя|награда|ссылка",
            reply_markup=self.cancel_keybord()
        )

    async def quests_add_state(self, message: types.Message):
        try:
            if '|' in message.text:
                text = message.text.split('|')
                exists = any(quest['name'] == text[0] for quest in db.quests__get())

                if not exists:
                    if len(text) == 3 and self.isdigit(text[1]) and self.is_valid_url(text[2]):
                        db.quests__add_quest(text[0], text[1], text[2])
                        await message.answer(
                            text=f"Задание '{text[0]}' добавлено"
                        )
                    elif not self.isdigit(text[1]):
                        await message.answer(
                            text=f'Цена должна быть числом'
                        )
                    elif not self.is_valid_url(text[2]):
                        await message.answer(
                            text=f'Некорректная ссылка'
                        )
                    else:
                        await message.answer(
                            text=f'Неправельный формат ввода'
                        )
                else:
                    await message.answer(
                        text=f"Задание с именем '{text[0]}' уже есть"
                    )
            else:
                await message.answer(
                    text=f"Неправельный формат ввода"
                )
        except TypeError:
            await message.answer(
                text=f"Неправельный формат ввода"
            )

    async def quests_remove(self, message: types.Message):
        await message.edit_text(
            f"Напишите имя задания, которое нужно убрать",
            reply_markup=self.cancel_keybord()
        )

    async def quests_remove_state(self, message: types.Message):
        name = message.text
        exists = any(quest['name'] == name for quest in db.quests__get())

        if exists:
            db.table__remove_for_name('Quests', name)
            await message.answer(
                text=f"Задание удалено"
            )
        else:
            await message.answer(
                text=f"Имя '{name}' не найдено в списке"
            )

    async def products(self, message: types.Message):
        products = db.products__get()

        output = []
        for product in products:
            output.append(f"{product['name']}, {product['price']}")
        text = "\n".join(output)

        await message.edit_text(
            f"Герои (имя, цена):\n"
            f"{text}",
            reply_markup=self.products_get_keyboard()
        )

    async def products_remove_files(self, file_name):
        # video_path = os.path.join('video', file_name)
        # images_path = os.path.join('images', f'{file_name}.png')

        # Удаление папки
        if os.path.exists(f'../../../Storage/Videos/Game/{file_name}'):
            shutil.rmtree(f'../../../Storage/Videos/Game/{file_name}')
            # await message.answer(f"Папка {file_name} удалена")

        # Удаление файла
        if os.path.exists(f'../../../Storage/Images/Heroes/{file_name}.png'):
            os.remove(f'../../../Storage/Images/Heroes/{file_name}.png')
            # await message.answer(f"Файл {file_name} удален")

    async def archive_remove_files(self):
        archive_path = os.path.join('extracted_files')

        # Удаление папки
        if os.path.exists(archive_path):
            shutil.rmtree(archive_path)

    async def products_add(self, message: types.Message):
        await message.edit_text(
            f"Отправьте zip архив с файлами персонажа",
            reply_markup=self.cancel_keybord()
        )

    async def products_add_file(self, message: types.Message):
        file_id = message.document.file_id
        file_name = message.document.file_name
        file = await bot.get_file(file_id)
        hero_name = file_name.replace('.zip', '')

        # Скачиваем архив
        os.makedirs('archives', exist_ok=True)
        await bot.download_file(file.file_path, f'./archives/{file_name}')

        try:
            # Разархивируем
            with zipfile.ZipFile(f"./archives/{file_name}", 'r') as zip_ref:
                zip_ref.extractall('extracted_files')
                await self.archive_remove_files()

            # Проверяем файлы
            for file in os.listdir('extracted_files'):
                if file.endswith('.png'):
                    # image_name = file.replace('.png', '')
                    # os.makedirs(f'../../../Storage/Images/Heroes/{file_name}.png', exist_ok=True)
                    os.rename(f'extracted_files/{file}', f'../../../Storage/Images/Heroes/{file_name}.png')
                elif file.endswith('.gif'):
                    # image_name = file.replace('.webm', '.png')
                    os.makedirs(f'../../../Storage/Videos/Game/{hero_name}', exist_ok=True)
                    os.rename(f'extracted_files/{file}', f'../../../Storage/Videos/Game/{hero_name}/{file}')
                else:
                    await message.answer(f"Некорректый формат файла {file}")
                    await self.products_remove_files(hero_name)
                    return

            await message.reply("Файлы успешно обработаны!")

            await message.answer(
                f"Теперь отправьте стоимость персонажа",
                reply_markup=self.cancel_keybord()
            )

            return hero_name
        except FileExistsError:
            await message.reply(f"Файл {file} уже есть")
            await self.archive_remove_files()
            return

    async def products_add_state(self, message: types.Message, hero_name):
        text = message.text
        exists = any(quest['name'] == hero_name for quest in db.products__get())

        if not exists:
            if text.isdigit():
                db.products__add_product(hero_name, text)
                await message.answer(
                    text=f"Продукт '{hero_name}' добавлено"
                )
            else:
                await message.answer(
                    text=f'Неправельный формат ввода'
                )
                await self.products_remove_files(hero_name, message)
        else:
            await message.answer(
                text=f"Продукт с именем '{hero_name}' уже есть"
            )

    async def products_remove(self, message: types.Message):
        await message.edit_text(
            f"Напишите имя продукта, который нужно убрать",
            reply_markup=self.cancel_keybord()
        )

    async def products_remove_state(self, message: types.Message):
        name = message.text
        exists = any(quest['name'] == name for quest in db.products__get())

        await self.products_remove_files(name, message)

        if exists:
            db.table__remove_for_name('Products', name)
            await message.answer(
                text=f"Продукт удалён"
            )
        else:
            await message.answer(
                text=f"Имя '{name}' не найдено в списке"
            )

    async def newsletters(self, message: types.Message):
        await message.edit_text(
            f"Перешлите сообщение для рассылки",
            reply_markup=self.cancel_keybord()
        )

    async def newsletters_state_link(self, message: types.Message):
        await message.edit_text(
            f"Отправьте ссылку на источник",
            reply_markup=self.cancel_keybord()
        )

    async def newsletters_state_message(self, message: types.Message):
        await message.answer(
            f"Теперь перешлите сообщение для рассылки",
            reply_markup=self.cancel_keybord()
        )

    async def newsletters_state(self, message: types.Message, link_newsletters):
        users = db.users__get_all()
        buttons = [
            [
                types.InlineKeyboardButton(text="ПЕРЕХОДИ В ИСТОЧНИК!!!", url=link_newsletters)
            ]
        ]

        for user in users:
            await message.copy_to(
                chat_id=user['tg_id'],
                reply_markup=types.InlineKeyboardMarkup(inline_keyboard=buttons)
            )

    async def promocodes(self, message: types.Message):
        products = db.promocodes__get()

        output = []
        for product in products:
            output.append(f"{product['name']}")
        text = "\n".join(output)

        await message.edit_text(
            f"Промокоды (Промокод):\n"
            f"{text}",
            reply_markup=self.promocodes_get_keyboard()
        )

    async def promocodes_add(self, message: types.Message):
        await message.edit_text(
            f"Создайте промокод в формате: промокод",
            reply_markup=self.cancel_keybord()
        )

    async def promocodes_add_state(self, message: types.Message):
        try:
            text = message.text
            exists = any(quest['name'] == text[0] for quest in db.promocodes__get())

            if not exists:
                db.promocodes__add_promocode(text)
                await message.answer(
                    text=f"Промокод '{text}' добавлен"
                )
                # else:
                #     await message.answer(
                #         text=f'Неправельный формат ввода'
                #     )
            else:
                await message.answer(
                    text=f"Промокод с именем '{text[0]}' уже есть"
                )
        except TypeError:
            await message.answer(
                text=f'Неправельный формат ввода'
            )

    async def promocodes_remove(self, message: types.Message):
        await message.edit_text(
            f"Напишите имя промокода, который нужно убрать",
            reply_markup=self.cancel_keybord()
        )

    async def promocodes_remove_state(self, message: types.Message):
        try:
            name = message.text
            exists = any(quest['name'] == name for quest in db.promocodes__get())

            if exists:
                db.table__remove_for_name('PromoCodes', name)
                await message.answer(
                    text=f"Промокод удалён"
                )
            else:
                await message.answer(
                    text=f"Имя '{name}' не найдено в списке"
                )
        except TypeError:
            await message.answer(
                text=f'Неправельный формат ввода'
            )

    async def users(self, message: types.Message):
        await message.edit_text(
            f"Напишите tg id пользователя (в формате цифр)",
            reply_markup=self.users_back_keyboard()
        )

    async def users_get(self, message: types.Message):
        if message.text.isdigit():
            info = db.user__get_info(message.text)
            if info:
                await message.answer(

                    f"Баланс: {info['balance']}\n"
                    f"Дата регистрации: {info['date_registration']}\n"
                    f"Уровень: {info['level']}\n"
                    f"Текущий персонаж: {info['hero_name']}\n"
                    f"Количество тапов: {None}\n"
                )
            else:
                await message.answer(
                    f"Такого пользователя нет"
                )
        else:
            await message.answer(
                f"Неправельный формат ввода"
            )

    async def statistics(self, message: types.Message, max_level):
        result = []
        users_for_date = {'0': db.users__get_col_for_date()['col'], '1': db.users__get_col_for_date(1)['col'],
                          '7': db.users__get_col_for_date(7)['col']}
        online = Game_manager.clients_count__get()
        users_for_level = dict()

        for i in range(1, max_level + 1):
            users_for_level[str(i)] = db.users__get_col_for_level(i)['col']

        for level, count in users_for_level.items():
            result.append(f"{level} уровень: {count}")

        formatted_string = "\n".join(result)

        await message.edit_text(
            f"Статистика"
            f"\nПользователей за последние сутки: {users_for_date['1']}"
            f"\nПользователей за последнюю неделю: {users_for_date['7']}"
            f"\nПользователей за всё время: {users_for_date['0']}"
            f"\n"
            f"\nПользователей онлайн: {online}"
            f"\n"
            f"\nПользователей по уровням: "
            f"\n{formatted_string}",
            reply_markup=self.statistics_get_keyboard()
        )

    async def panel(self, message: types.Message):
        await message.edit_text(
            f"Админ панель",
            reply_markup=self.get_keyboard()
        )
