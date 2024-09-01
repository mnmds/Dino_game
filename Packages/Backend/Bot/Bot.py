import asyncio
import logging
from datetime import datetime
from multiprocessing import Process

from aiogram import Bot, Dispatcher, Router

from db import DataBase
from config import TG_BOT_TOKEN
from admin import Admin
from handlers import handlers

from apscheduler.schedulers.asyncio import AsyncIOScheduler

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


async def scheduler():
    posting_time = ['17:00']
    week_day = 1

    while True:
        referrals = await db.referral__get_all()

        if len(referrals):
            # if not type(referrals) == 'list':
            #     referrals = [referrals]
            # print(referrals)
            await db.referral__set_all(referrals)

        if datetime.now().strftime('%H:%M') in posting_time:
            await handlers.auto_posting()
        if datetime.now().isoweekday() == week_day and datetime.now().strftime('%H:%M') == '12:00':
            await handlers.promocodes_posting()
            db.week_shift()
        print(referrals)
        await asyncio.sleep(60)


def worker():
    asyncio.run((scheduler()))


async def main():
    # await dp.start_polling(bot)

    bot = Bot(token=TG_BOT_TOKEN)
    dp = Dispatcher()

    dp.include_routers(handlers.router)

    process = Process(target=worker)
    process.start()
    logging.basicConfig(level=logging.INFO)

    # Запускаем бота и пропускаем все накопленные входящие
    # Да, этот метод можно вызвать даже если у вас поллинг
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

    process.join()


if __name__ == "__main__":
    asyncio.run(main())
