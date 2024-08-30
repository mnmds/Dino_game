import asyncio
import logging

from aiogram import Bot, Dispatcher, Router

from db import DataBase
from config import TG_BOT_TOKEN
from admin import Admin
from handlers import handlers

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


async def main():
    # await dp.start_polling(bot)

    bot = Bot(token=TG_BOT_TOKEN)
    dp = Dispatcher()

    dp.include_routers(handlers.router)

    # Запускаем бота и пропускаем все накопленные входящие
    # Да, этот метод можно вызвать даже если у вас поллинг
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
