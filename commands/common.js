export function tagUsers(users) {
    return Array.isArray(users) ? users.map(user =>
        user.username ? `@${user.username}` : 
        `<a href="tg://user?id=${user.user_id}">${user.first_name} ${user.last_name}</a>`).join(', ') : '';
}

export function listUsers(users) {
    return users.map((user, index) => `${(index + 1)}. ${user.username} — ${user.first_name} ${user.last_name}`).join('\n');
}

export function tagUsersByCommas(users) {
    return Array.isArray(users) ? users.map(user => 
        user.username ? `@${user.username}` :
        `<a href="tg://user?id=${user.user_id}">${user.first_name} ${user.last_name}</a>`).join(', ') : '';
}

export function showMenu(msg, bot) {
    const keyboard = {
        inline_keyboard: [
            [
                { text: 'Показать игры', callback_data: 'showgames' },
                { text: 'Показать список', callback_data: 'list' }
            ],
            [
                { text: 'Зарегистрироваться в боте', callback_data: 'register' },
                { text: 'Ağıllı ol', callback_data: 'agilliol' }
            ]
        ]
    };

    bot.sendMessage(msg.chat.id, 'Выберите действие:', {
        reply_markup: keyboard,
        // parse_mode: 'HTML'
    });
}