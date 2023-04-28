const { getUsersFromDatabase } = require("../database");

async function showUsersInSelectedGroup(query, bot) {
    const adminChatId = query.message.chat.id;
    const selectedGroupChatId = parseInt(query.data.split('_')[1]);

    let gameDeactiveButtons = [];

    try {
        const users = await getUsersFromDatabase(selectedGroupChatId);

        if (users && users.length > 0) {
            const usersString = users.map(user =>
                `ID: ${user.id} | Имя: ${user.first_name} | Фамилия: ${user.last_name} | username: ${user.username} |\n` +
                `На азербайджанском: ${user.fullname_az}`
            ).join('\n----------------------------------\n');

            bot.sendMessage(adminChatId, usersString + "\n\nДля редактирования данных кого-то введите команду '/adminedituser [имя]/[фамилия]/[полное имя на азербайджанском]'");
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