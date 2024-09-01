select `date_quest`
from `User_quests`
where `tg_id` = :tg_id
    and `quest_name` = :quest_name;
