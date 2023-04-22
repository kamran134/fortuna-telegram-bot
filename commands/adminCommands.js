const moment = require('moment');

function connectto(pool, msg, bot) {

    bot.onText(/\/connectto (.+)/, async (msg, match) => {
        const groupName = match[1];
        const groupInfo = await bot.getChat(groupName);
      
        // Проверяем, что получили информацию о группе
        if (!groupInfo) {
          bot.sendMessage(msg.chat.id, `Не удалось найти группу ${groupName}`);
          return;
        }
      
        // Получаем информацию о пользователях, которые являются администраторами группы
        const admins = await bot.getChatAdministrators(mainGroupId);
      
        // Проверяем, является ли пользователь, написавший команду, администратором основной группы
        const isAdmin = admins.some(admin => admin.user.id === msg.from.id);
      
        if (!isAdmin) {
          bot.sendMessage(msg.chat.id, 'Вы не являетесь администратором основной группы');
          return;
        }
      
        // Если пользователь - администратор основной группы, добавляем информацию о соединении групп в базу данных
        const adminChatId = msg.chat.id;
        const chatId = groupInfo.id;
        // здесь нужно выполнить SQL-запрос на добавление информации о соединении в таблицу admin_groups
      
        bot.sendMessage(msg.chat.id, `Группа ${groupName} была успешно связана с основной группой`);
      });      

    // const messageText = msg.text.replace('@fortunaVolleybalBot', '');
    // const groupName = messageText.replace('/connectto ', '');
    // const adminChatId = msg.chat.id;

    // bot.getChat(groupName).then(chat => {
    //     const chatId = chat.id;
    //     const userId = msg.from.id;

    //     bot.getChatMember(chatId, userId).then(member => {
    //         if (member.status === 'administrator' || member.status === 'creator') {
    //             pool.query(`INSERT INTO admin_groups (chat_id, admin_chat_id) VALUES ($1, $2)`, [chatId, adminChatId])
    //                 .then(res => {
    //                     console.log('Connecting groups: ', JSON.stringify(res));
    //                     bot.sendMessage(adminChatId, `Группа успешно связана с текущей. Теперь вы можете создавать игры, редактировать пользователей и игры отсюда!`)
    //                 })
    //         } else {
    //             bot.sendMessage(adminChatId, 'Дело пахнет жареным. Вряд-ли вы админ той группы');
    //         }
    //     }).catch(err => {
    //         console.error('Checking for group admin error: ', err);
    //     });

    // }).catch(err => {
    //     console.error('Find group by name error, ', err);
    // });
}

module.exports = {
    connectto
}