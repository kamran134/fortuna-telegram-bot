import { unregister } from "../commands/registration.js";

export const leftChatMember = async (msg, bot) => {
    const chatId = msg.chat.id;
    const leftMember = msg.left_chat_member;
    const firstName = leftMember.first_name;
    const lastName = leftMember.last_name || '';

    // Отправляем сообщение о том, что пользователь покинул чат
    bot.sendMessage(chatId, `👋 ${firstName} ${lastName} покинул чат. Ну и пожалуйста!`);

    await unregister(msg, bot);
    // Если пользователь покинул группу, удаляем его из базы данных
}