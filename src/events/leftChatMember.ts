import { Message } from 'node-telegram-bot-api';
import { unregister } from "../commands/registration";

export const leftChatMember = async (msg: Message, bot: any): Promise<void> => {
    const chatId = msg.chat.id;
    const leftMember = msg.left_chat_member;
    
    if (!leftMember) return;

    const firstName = leftMember.first_name;
    const lastName = leftMember.last_name || '';

    // Отправляем сообщение о том, что пользователь покинул чат
    bot.sendMessage(chatId, `👋 ${firstName} ${lastName} покинул чат. Ну и пожалуйста!`);

    await unregister(msg, bot);
    // Если пользователь покинул группу, удаляем его из базы данных
}
