from aiogram.filters import BaseFilter
from aiogram import types
from db import DataBase

db = DataBase()


class IsAdmin(BaseFilter):
    def __init__(self, admin_ids) -> None:
        self.admin_ids = admin_ids

    async def __call__(self, message: types.Message) -> bool:
        return message.from_user.id in self.admin_ids


class Admin:
    def __init__(self):
        pass

    @staticmethod
    def get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Задания", callback_data="admin__quests"),
                types.InlineKeyboardButton(text="Персонажи", callback_data="admin__heroes")
            ],
            [
                types.InlineKeyboardButton(text="Рассылка", callback_data="admin__newsletter"),
                types.InlineKeyboardButton(text="Промокоды", callback_data="admin__promocodes")
            ],
            [types.InlineKeyboardButton(text="Статистика", callback_data="admin__statistics")],
            [types.InlineKeyboardButton(text="Пользователи", callback_data="admin__users")]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def quests_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Убрать", callback_data="admin__quest_remove"),
                types.InlineKeyboardButton(text="Добавить", callback_data="admin__quest_add")
            ],
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def heroes_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Убрать", callback_data="admin__"),
                types.InlineKeyboardButton(text="Добавить", callback_data="admin__")
            ],
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def newsletter_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Убрать", callback_data="admin__"),
                types.InlineKeyboardButton(text="Добавить", callback_data="admin__")
            ],
            [
                types.InlineKeyboardButton(text="Назад", callback_data="admin__back")
            ]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def promocodes_get_keyboard():
        buttons = [
            [
                types.InlineKeyboardButton(text="Убрать", callback_data="admin__"),
                types.InlineKeyboardButton(text="Добавить", callback_data="admin__")
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

    async def quests(self, message: types.Message):
        quests = db.quests__get()
        output = []
        for quest in quests:
            output.append(f"{quest['name']}, {quest['description']}, {quest['url']}")
        text = "\n".join(output)

        await message.edit_text(
            f"Квесты (имя, цена, ссылка):\n"
            f"{text}",
            reply_markup=self.quests_get_keyboard()
        )

    async def quests_add(self, message: types.Message):
        await message.edit_text(
            f"Квесты",
            reply_markup=self.quests_back_keyboard()
        )

    async def quests_remove(self, message: types.Message):
        await message.answer(
            f"Напишите имя задания, которое нужно убрать"
        )

    async def heroes(self, message: types.Message):
        await message.edit_text(
            f"Герои",
            reply_markup=self.heroes_get_keyboard()
        )

    async def newsletter(self, message: types.Message):
        await message.edit_text(
            f"Рассылка",
            reply_markup=self.newsletter_get_keyboard()
        )

    async def promocodes(self, message: types.Message):
        await message.edit_text(
            f"Промокоды",
            reply_markup=self.promocodes_get_keyboard()
        )

    async def statistics(self, message: types.Message, max_level):
        result = []
        users_for_date = {'0': db.users__get_col_for_date()['col'], '1': db.users__get_col_for_date(1)['col'],
                          '7': db.users__get_col_for_date(7)['col']}
        online = 0
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
