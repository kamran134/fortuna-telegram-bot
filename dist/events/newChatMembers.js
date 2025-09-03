"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newChatMembers = void 0;
const commands_1 = require("../commands");
const newChatMembers = async (msg, bot) => {
    const chatId = msg.chat.id;
    const newMembers = msg.new_chat_members;
    if (!newMembers)
        return;
    for (const member of newMembers) {
        // Проверяем, не является ли новый участник ботом (чтобы избежать зацикливания)
        if (!member.is_bot) {
            const userId = member.id;
            const username = member.username;
            const firstName = member.first_name;
            const lastName = member.last_name;
            // Вызываем функцию register, передавая объект message, имитирующий сообщение от нового пользователя
            (0, commands_1.register)({
                chatId,
                user: {
                    id: userId,
                    user_id: userId,
                    username: username || undefined,
                    first_name: firstName,
                    last_name: lastName || undefined,
                }
            }, bot);
            // Опционально: Можно отправить приветственное сообщение новому пользователю
            bot.sendMessage(chatId, `✅\nXoş gördük, ${firstName}!\nOyunlar haqqında məlumatı şəxsi mesajda almaq üçün göstərilən linkə keçid edərək "Start" düyməsinə basın.\n
                Добро пожаловать, ${firstName}! 👋 Для получения личных уведомлений об играх перейдите по ссылке ниже и нажмите на кнопку "Start"\n t.me/fortunaVolleybalBot`, {
                reply_to_message_id: msg.message_id, // Отвечаем на сообщение о добавлении пользователя
                disable_web_page_preview: true // Отключаем предпросмотр ссылки
            });
        }
    }
};
exports.newChatMembers = newChatMembers;
//# sourceMappingURL=newChatMembers.js.map