update `User_quests`
set date_quest = current_timeStamp
where tg_id = :tg_id
    and `quest_name` = :quest_name;
