const moment = require('moment');
const { addUserToDatabase } = require('../database');

async function register(msg, bot) {
    try {
        await addUserToDatabase(msg);
        bot.sendMessage(msg.chat.id, "Siz uğurla botda qeydiyyatdan keçdiniz / Вы успешно зарегистрировались в боте");
    } catch (error) {
        console.error('Inserting error', error);
    }
}

function tagRegistered(pool, msg, bot, command) {
    pool.query(`SELECT * FROM users WHERE chat_id = ${msg.chat.id} AND is_guest = FALSE;`, (err, res) => {
        if (err) {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Произошла ошибка: ' + err);
            return;
        }
        
        const users = res.rows.map(row => row.username ? `@${row.username}` :
            `<a href="tg://user?id=${row.user_id}">${row.first_name}</a>`);
        const usersWithoutTag = res.rows.map(row => `${row.username} — ${row.first_name}`);
        
        if (users.length === 0) {
            bot.sendMessage(msg.chat.id, 'Никто не зарегистрировался в боте? Капец.');
        } else {
            bot.sendMessage(msg.chat.id, 'Зарегистрированные участники:\n' + 
               (command === 'tag' ? users.join('\n') : usersWithoutTag.join('\n')), {parse_mode: 'HTML'});
        }
    });
}

module.exports = {
    register,
    tagRegistered
}