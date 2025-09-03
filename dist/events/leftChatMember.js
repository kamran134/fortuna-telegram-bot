"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leftChatMember = void 0;
const registration_1 = require("../commands/registration");
const leftChatMember = async (msg, bot) => {
    const chatId = msg.chat.id;
    const leftMember = msg.left_chat_member;
    if (!leftMember)
        return;
    const firstName = leftMember.first_name;
    const lastName = leftMember.last_name || '';
    // Отправляем сообщение о том, что пользователь покинул чат
    bot.sendMessage(chatId, `👋 ${firstName} ${lastName} покинул чат. Ну и пожалуйста!`);
    await (0, registration_1.unregister)(msg, bot);
    // Если пользователь покинул группу, удаляем его из базы данных
};
exports.leftChatMember = leftChatMember;
//# sourceMappingURL=leftChatMember.js.map