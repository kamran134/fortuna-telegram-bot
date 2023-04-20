const moment = require('moment');

function connectto(pool, msg, bot) {
    const messageText = msg.text.replace('@fortunaVolleybalBot', '');
    const groupName = messageText.replace('/connectto ', '');
    const adminChatId = msg.chat.id;

    bot.getChat(groupName).then(chat => {
        const chatId = chat.id;
        const userId = msg.from.id;

        bot.getChatMember(chatId, userId).then(member => {
            if (member.status === 'administrator' || member.status === 'creator') {
                pool.query(`INSERT INTO admin_groups (chat_id, admin_chat_id) VALUES ($1, $2)`, [chatId, adminChatId])
                    .then(res => {
                        console.log('Connecting groups: ', JSON.stringify(res));
                        bot.sendMessage(adminChatId, `Группа успешно связана с текущей. Теперь вы можете создавать игры, редактировать пользователей и игры отсюда!`)
                    })
            } else {
                bot.sendMessage(adminChatId, 'Дело пахнет жареным. Вряд-ли вы админ той группы');
            }
        }).catch(err => {
            console.error('Checking for group admin error: ', err);
        });

    }).catch(err => {
        console.error('Find group by name error, ', err);
    });
}

module.exports = {
    connectto
}