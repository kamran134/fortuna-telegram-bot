const { addGroupAdminToDatabase, getGroupsFromDataBase } = require('../database');

async function connectTo(msg, bot) {
    const messageText = msg.text.replace('@fortunaVolleybalBot', '');
    const chatId = messageText.replace('/connectto ', '');
    const adminChatId = msg.chat.id;
    const userId = msg.from.id;

    const groupInfo = await bot.getChat(chatId);
    const groupName = groupInfo ? groupInfo.title : 'noname';

    bot.getChatMember(chatId, userId).then(member => {
        if (member.status === 'administrator' || member.status === 'creator') {
            try {
                const result = addGroupAdminToDatabase({ chatId, adminChatId, groupName });

                if (!result) {
                    console.error('RESULT ERROR: ', result);
                    throw result;
                } else {
                    bot.sendMessage(adminChatId, `Группа ${groupName} успешно связана с текущей. Теперь вы можете создавать игры, редактировать пользователей и игры отсюда!`);
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        } else {
            bot.sendMessage(adminChatId, 'Дело пахнет жареным. Вряд-ли вы админ той группы');
        }
    }).catch(err => {
        console.error('Checking for group admin error: ', err);
    });
}

async function showGroups(adminChatId, bot) {
    try {
        const groups = await getGroupsFromDataBase(adminChatId);

        if (!groups || !Array.isArray(groups)) {
            console.error('groups is not an array!', groups);
        } else if (groups.length === 0) {
            bot.sendMessage(adminChatId, `У вас нет подчинённых групп`);
        } else {
            bot.sendMessage(adminChatId, `Группы, которые вы админите: \n\n${groups.map(group => group.group_name).join('\n')}`);
        }
    } catch (error) {
        console.error('SHOW GROUP ERROR: ', error);
    }
}

async function showYourGroups(adminChatId, bot, command) {
    try {
        const groups = await getGroupsFromDataBase(adminChatId);

        if (!groups || !Array.isArray(groups)) {
            console.error('groups is not an array!', groups);
        } else if (groups.length === 0) bot.sendMessage(adminChatId, `У вас нет подчинённых групп`);
        else {
            const groupsButtons = groups.map(group => ([{text: group.group_name, callback_data: `selectedGroupFor${command}_${group.chat_id}`}]));
            bot.sendMessage(adminChatId, `Выберите группу, которая подчиняется вам`, {
                reply_markup: {
                    inline_keyboard: [...groupsButtons]
                }
            });
        }
    } catch (error) {
        console.log('START GAME ERROR: ', error);
    }
}

async function editUser(msg, bot) {

}

module.exports = {
    connectTo,
    showGroups,
    showYourGroups,
    editUser
}