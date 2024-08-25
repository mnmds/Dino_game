from aiogram.filters import BaseFilter
from aiogram import types


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
            [types.InlineKeyboardButton(text="Статистика", callback_data="admin__statistics")]
        ]
        return types.InlineKeyboardMarkup(inline_keyboard=buttons)

    @staticmethod
    def quests_get_keyboard():
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

    async def quests(self, message: types.Message):
        await message.edit_text(
            f"Квесты",
            reply_markup=self.quests_get_keyboard()
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

    async def statistics(self, message: types.Message):
        await message.edit_text(
            f"Статистика",
            reply_markup=self.statistics_get_keyboard()
        )

    async def panel(self, message: types.Message):
        await message.edit_text(
            f"Админ панель",
            reply_markup=self.get_keyboard()
        )
