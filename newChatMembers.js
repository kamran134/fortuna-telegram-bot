import { register } from "./commands";

export const newChatMembers = async (msg, bot) => {
    const chatId = msg.chat.id;
    const newMembers = msg.new_chat_members;

    for (const member of newMembers) {
        // Проверяем, не является ли новый участник ботом (чтобы избежать зацикливания)
        if (!member.is_bot) {
            const userId = member.id;
            const username = member.username;
            const firstName = member.first_name;
            const lastName = member.last_name;

            // Вызываем функцию register, передавая объект message, имитирующий сообщение от нового пользователя
            register({
                chat: {
                    id: chatId
                },
                from: {
                    id: userId,
                    username: username,
                    first_name: firstName,
                    last_name: lastName
                },
                // text: '/register' // Имитируем, что пользователь отправил команду /register
            }, bot);

            // Опционально: Можно отправить приветственное сообщение новому пользователю
            bot.sendMessage(chatId, `✅\nXoş gördük, ${firstName}!\nOyunlar haqqında məlumatı şəxsi mesajda almaq üçün göstərilən linkə keçid edərək "Start" düyməsinə basın.\n
                Добро пожаловать, ${firstName}! 👋 Для получения личных уведомлений об играх перейдите по ссылке ниже и нажмите на кнопку "Start"\n t.me/${bot.options.username}`, {
                reply_to_message_id: msg.message_id, // Отвечаем на сообщение о добавлении пользователя
                disable_web_page_preview: true // Отключаем предпросмотр ссылки
            });
        }
    }
}
