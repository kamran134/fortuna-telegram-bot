import { addGroupAdminToDatabase, getGroupsFromDataBase, editUserInDatabase, getUserChatFromDatabase } from '../database/index.js';

export async function connectTo(msg, bot) {
    const messageText = msg.text.replace('@fortunaVolleybalBot', '');
    const chatId = messageText.replace('/connectto ', '');
    const adminChatId = msg.chat.id;
    const userId = msg.from.id;

    try {
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
    } catch (error) {
        console.error('CHAT INFO ERROR: ', error);
    }
    
}

export async function showGroups(adminChatId, bot) {
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

export async function showYourGroups(adminChatId, bot, command) {
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
        console.error('START GAME ERROR: ', error);
    }
}

export async function editUser(msg, bot) {
    const chatId = msg.chat.id;
    const adminId = msg.from.id;
    const userOptionsString = msg.text.replace('/adminedituser ', '').replace('/adminedituser@fortunaVolleybalBot ', '');
    const [userId, firstName, lastName, ...rest] = userOptionsString.split('/');
    const fullnameAz = rest[0] || null;

    try {
        const result = await getUserChatFromDatabase(userId);
        
        if (result) {
            const userChatId = result.chat_id;
            const chatMember = await bot.getChatMember(userChatId, adminId);

            if (chatMember) {
                const isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';

                if (isAdmin) {
                    const user = await editUserInDatabase({ userId, firstName, lastName, fullnameAz });
    
                    if (user) {
                        bot.sendMessage(chatId, `Данные игрока успешно отредактированы!\n` +
                        `ID: ${user.id}\nИмя: ${user.first_name}\nФамилия: ${user.last_name}\nНа азербайджанском: ${user.fullname_az}`);
                    } else {
                        bot.sendMessage(chatId, 'Если честно, мы в шоке 😳 Пока вы редактировали пользователя, он пропал. ' +
                         'Возможно вы что-то напутали с ID-шкой.');
                    }
                } else {
                    bot.sendMessage(chatId, `Вы не одмэн в той группе. Может вам подойдёт команда /agilliol ?`);
                }
            } else {
                bot.sendMessage(chatId, `Вас ваще в той группе нет, умный штоле?`);
            }
        } else {
            bot.sendMessage(chatId, `Кажется, ваш пользователь не в той группе, где вы админ!`);
        }
    } catch (error) {
        console.error('EDIT USER ERROR: ', error);
    }
}

export async function sendMessageToTheGamers(msg, bot) {
    try {
        const chatId = msg.chat.id;
        const adminId = msg.from.id;

        try {
            const [command, text] = msg.text.split(' ');

            showYourGroups(chatId, bot, 'TagGamers');

        } catch (error) {
            bot.sendMessage(chatId, `Неверный формат!`);
        }
        
    } catch (error) {
        console.error('ADMIN SEND MESSAGE ERROR: ', error);
    }
}