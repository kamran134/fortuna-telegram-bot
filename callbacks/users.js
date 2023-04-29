const { getUsersFromDatabase } = require("../database");

async function sendMessage(bot, chatId, message) {
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

async function showUsersInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    try {
        const users = await getUsersFromDatabase(selectedGroupChatId);

        if (users && users.length > 0) {
            const usersString = users.map(user =>
                `ID: ${user.id} | Имя: ${user.first_name} | Фамилия: ${user.last_name} | username: ${user.username} |\n` +
                `На азербайджанском: ${user.fullname_az}`
            ).join('\n----------------------------------\n');

            await sendMessage(bot, adminChatId, usersString + "\n\nДля редактирования данных кого-то введите команду '/adminedituser [имя]/[фамилия]/[полное имя на азербайджанском]'");
        } else {
            bot.sendMessage(adminChatId, 'Ты не можешь редактировать игроков, если игроков игр нет');
        }
    } catch (error) {
        console.error('SHOW USERS ERROR', error);
    }
}

module.exports = {
    showUsersInSelectedGroup
}