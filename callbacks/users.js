import { getUsersFromDatabase, getLastUserFromDatabase, searchUserInDatabase } from "../database/index.js";

export async function sendMessage(bot, chatId, message) {
    try {
      const maxLength = 4096;
      const messageLength = message.length;
      const numMessages = Math.ceil(messageLength / maxLength);
  
      for (let i = 0; i < numMessages; i++) {
        const start = i * maxLength;
        const end = (i + 1) * maxLength;
        const chunk = message.substring(start, end);
  
        await bot.sendMessage(chatId, chunk);
      }
    } catch (error) {
        console.error('SEND MESSAGE ERROR: ', error);
        throw error;
    }
}

export async function showUsersInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    try {
        const users = await getUsersFromDatabase(selectedGroupChatId);

        if (users && users.length > 0) {
            const usersString = users.map(user =>
                `ID: ${user.id} | Имя: ${user.first_name} | Фамилия: ${user.last_name} | username: ${user.username} |\n` +
                `На азербайджанском: ${user.fullname_az}`
            ).join('\n----------------------------------\n');

            await sendMessage(bot, adminChatId, usersString + "\n\nДля редактирования данных кого-то введите команду '/adminedituser [ID]/[имя]/[фамилия]/[полное имя на азербайджанском]'");
        } else {
            bot.sendMessage(adminChatId, 'Ты не можешь редактировать игроков, если игроков игр нет');
        }
    } catch (error) {
        console.error('SHOW USERS ERROR: ', error);
    }
}

export async function showLastUserInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    try {
        const user = await getLastUserFromDatabase(selectedGroupChatId);
        if (user) {
            await bot.sendMessage(adminChatId, `ID: ${user.id}\nИмя: ${user.first_name}\nФамилия: ${user.last_name}\nНа азербайджанском: ${user.fullname_az}`);
        }
    } catch (error) {
        console.error('SHOW LAST USER ERROR: ', error);
    }
}

export async function searchUserInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    bot.sendMessage(adminChatId, `Введите фразу для поиска!`);
    let waitForInput = true;

    bot.on('message', async (msg) => {
        if (!waitForInput) return;

        if (msg.text === '/cancel' && msg.chat.id === adminChatId) {
            waitForInput = false;
            bot.sendMessage(adminChatId, 'Поиск отменён!');
            return;
        } else if (msg.chat.id === adminChatId) {
            try {
                const users = await searchUserInDatabase(selectedGroupChatId, msg.text);
        
                if (users && users.length > 0) {
                    const usersString = users.map(user =>
                        `ID: ${user.id} | Имя: ${user.first_name} | Фамилия: ${user.last_name} | username: ${user.username} |\n` +
                        `На азербайджанском: ${user.fullname_az}`
                    ).join('\n----------------------------------\n');
        
                    await sendMessage(bot, adminChatId, usersString + "\n\nДля редактирования данных кого-то введите команду '/adminedituser [ID]/[имя]/[фамилия]/[полное имя на азербайджанском]'");
                    waitForInput = false;
                } else {
                    bot.sendMessage(adminChatId, 'Ты не можешь редактировать игроков, если игроков игр нет');
                }
            } catch (error) {
                console.error('SHOW USERS ERROR: ', error);
            }
        }
    });
}
