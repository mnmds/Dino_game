from aiogram.filters import BaseFilter
from aiogram import types
from aiogram.fsm.state import StatesGroup, State

from db import DataBase

db = DataBase()


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
    waiting__newsletters = State()
    waiting__newsletters_link = State()
    waiting__promocode_remove = State()
    waiting__promocode_add = State()
    waiting__users = State()


class Admin:
    def __init__(self):
        pass

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
        db.connection__open()
        quests = db.quests__get()
        db.connection__cose()

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
            f"Напишите новое задание в формате: имя, цена, ссылка",
            reply_markup=self.cancel_keybord()
        )

    async def quests_add_state(self, message: types.Message):
        db.connection__open()
        text = message.text.split(', ')
        exists = any(quest['name'] == text[0] for quest in db.quests__get())

        if not exists:
            if len(text) == 3:
                db.quests__add_quest(text[0], text[1], text[2])
                await message.answer(
                    text=f"Задание '{text[0]}' добавлено"
                )
            else:
                await message.answer(
                    text=f'Неправельный формат ввода'
                )
        else:
            await message.answer(
                text=f"Задание с именем '{text[0]}' уже есть"
            )

    async def quests_remove(self, message: types.Message):
        await message.edit_text(
            f"Напишите имя задания, которое нужно убрать",
            reply_markup=self.cancel_keybord()
        )

    async def quests_remove_state(self, message: types.Message):
        db.connection__open()
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
        db.connection__open()
        products = db.products__get()
        db.connection__cose()

        output = []
        for product in products:
            output.append(f"{product['name']}, {product['description']}, {product['price']}, {product['resource_url']}")
        text = "\n".join(output)

        await message.edit_text(
            f"Герои (имя, цена, описание, изображение):\n"
            f"{text}",
            reply_markup=self.products_get_keyboard()
        )

    async def products_add(self, message: types.Message):
        await message.edit_text(
            f"Создайте персонажа в формате: имя, описание, цена, фото",
            reply_markup=self.cancel_keybord()
        )

    async def products_add_state(self, message: types.Message):
        db.connection__open()
        text = message.text.split(', ')
        exists = any(quest['name'] == text[0] for quest in db.products__get())

        if not exists:
            if len(text) == 4:
                db.products__add_product(text[0], text[1], text[2], text[3])
                await message.answer(
                    text=f"Продукт '{text[0]}' добавлено"
                )
            else:
                await message.answer(
                    text=f'Неправельный формат ввода'
                )
        else:
            await message.answer(
                text=f"Продукт с именем '{text[0]}' уже есть"
            )

    async def products_remove(self, message: types.Message):
        await message.edit_text(
            f"Напишите имя продукта, который нужно убрать",
            reply_markup=self.cancel_keybord()
        )

    async def products_remove_state(self, message: types.Message):
        db.connection__open()
        name = message.text
        exists = any(quest['name'] == name for quest in db.products__get())

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
        # db.connection__open()
        # newsletters = db.newsletters__get()
        # db.connection__cose()
        #
        # output = []
        # for newsletter in newsletters:
        #     output.append(f"{newsletter['name']}, {newsletter['description']}, {newsletter['url']}")
        # text = "\n".join(output)
        #
        # await message.edit_text(
        #     f"Рассылка (имя, описание, ссылка):\n"
        #     f"{text}",
        #     reply_markup=self.newsletters_get_keyboard()
        # )

    # async def newsletters_add(self, message: types.Message):
    #     await message.edit_text(
    #         f"Создайте рассылку в формате: имя, описание, ссылка",
    #         reply_markup=self.cancel_keybord()
    #     )

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
        db.connection__open()
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
        # exists = any(quest['name'] == text[0] for quest in db.newsletters__get())
        #
        # if not exists:
        #     if len(text) == 3:
        #         db.newsletters__add_newsletter(text[0], text[1], text[2])
        #         await message.answer(
        #             text=f"Рассылка '{text[0]}' добавлена"
        #         )
        #     else:
        #         await message.answer(
        #             text=f'Неправельный формат ввода'
        #         )
        # else:
        #     await message.answer(
        #         text=f"Рассылка с именем '{text[0]}' уже есть"
        #     )

    # async def newsletters_remove(self, message: types.Message):
    #     await message.edit_text(
    #         f"Напишите имя рассылки, который нужно убрать",
    #         reply_markup=self.cancel_keybord()
    #     )

    # async def newsletters_remove_state(self, message: types.Message):
    #     db.connection__open()
    #     name = message.text
    #     exists = any(quest['name'] == name for quest in db.newsletters__get())
    #
    #     if exists:
    #         db.table__remove_for_name('Newsletter', name)
    #         await message.answer(
    #             text=f"Рассылка удалёна"
    #         )
    #     else:
    #         await message.answer(
    #             text=f"Имя '{name}' не найдено в списке"
    #         )

    async def promocodes(self, message: types.Message):
        db.connection__open()
        products = db.promocodes__get()
        db.connection__cose()

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
        db.connection__open()
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

    async def promocodes_remove(self, message: types.Message):
        await message.edit_text(
            f"Напишите имя промокода, который нужно убрать",
            reply_markup=self.cancel_keybord()
        )

    async def promocodes_remove_state(self, message: types.Message):
        db.connection__open()
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

    async def users(self, message: types.Message):
        await message.edit_text(
            f"Напишите tg id пользователя (в формате цифр)",
            reply_markup=self.users_back_keyboard()
        )

    async def users_get(self, message: types.Message):
        if message.text.isdigit():
            info = db.user__get_info(message.text)
            if info:
                print(info)
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
