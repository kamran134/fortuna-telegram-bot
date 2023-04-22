const moment = require('moment');

async function connectto(pool, msg, bot) {
    const messageText = msg.text.replace('@fortunaVolleybalBot', '');
    const chatId = messageText.replace('/connectto ', '');
    const adminChatId = msg.chat.id;
    const userId = msg.from.id;

    const groupInfo = await bot.getChat(chatId);
    const groupName = groupInfo ? groupInfo.title : 'noname';

    bot.getChatMember(chatId, userId).then(member => {
        if (member.status === 'administrator' || member.status === 'creator') {
            pool.query(`INSERT INTO admin_groups (chat_id, admin_chat_id, group_name) VALUES ($1, $2, $3)`,
            [chatId, adminChatId, groupName])
                .then(res => {
                    console.log('Connecting groups: ', JSON.stringify(res));
                    bot.sendMessage(adminChatId, `Группа ${groupName} успешно связана с текущей. Теперь вы можете создавать игры, редактировать пользователей и игры отсюда!`)
                })
        } else {
            bot.sendMessage(adminChatId, 'Дело пахнет жареным. Вряд-ли вы админ той группы');
        }
    }).catch(err => {
        console.error('Checking for group admin error: ', err);
    });
}

// async function 

module.exports = {
    connectto
}