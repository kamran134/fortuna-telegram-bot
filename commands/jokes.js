import moment from 'moment';
import { getGamesTimesFromDatabase, getRandomUserFromDatabase, addJokeToDataBase, deleteJokeFromDataBase, getJokesFromDataBase, updateJokeInDataBase } from '../database/index.js';

export async function agilliOl(chatId, bot) {
    try {
        const randomUser = await getRandomUserFromDatabase(chatId);

        if (randomUser) {
            bot.sendMessage(chatId, `@${randomUser.username ? randomUser.username :
                '<a href="tg://user?id=${user.user_id}">' + randomUser.first_name + '</a>'}, ağıllı ol! 🧠`,
                {parse_mode: 'HTML'});
        } else {
            bot.sendMessage(chatId, 'Печально, когда некому говорить "Ağıllı ol" 🥲');
        }
    } catch (error) {
        console.error('AGILLI OL ERROR: ', error);
    }
}

export async function whatTime(msg, bot) {
    const chatId = msg.chat.id;

    try {
        const gamesTimes = await getGamesTimesFromDatabase(chatId);

        if (gamesTimes && gamesTimes.length > 0) {
            const gamesTimesString = gamesTimes.map(game => `${game.label}: ${moment(game.game_starts, 'HH:mm:ss').format('HH:mm')}`).join(', ');
            bot.sendMessage(chatId, `Мэээх. Сколько можно спрашивать? 😒\n${gamesTimesString}`);
        }
    } catch (error) {
        console.error('WHAT TIME ERROR: ', error);
    }
}

export async function addJoke(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (checkCreatorId(userId)) {
        try {
            const parts = msg.text.replace('/adminaddjoke ', '').split('/');
            const [joke, jokeType = 0] = parts;
            await addJokeToDataBase(joke, jokeType);
            bot.sendMessage(chatId, `Ваша гениальная "шутка" добавлена в базу данных. Полюбуйтесь на неё ещё раз: ${joke}`);
            
        } catch (error) {
            bot.sendMessage(chatId, `Ваша гениальная "шутка" не добавилась. Возможно она слишком тупая. А возможно возникла вот такая ошибка: ${error}`);
        }
    } else {
        bot.sendMessage(chatId, `Такую ответственную работу, как пополнить базу шутками мы могли доверить только истинным юмористам. Поэтому никто кроме создателей бота не может увлекаться этим!`);
    }
}

export async function deleteJoke(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (checkCreatorId(userId)) {
        const jokeId = +msg.text.replace('/admindeletejoke ', '');
        if (Number.isInteger(jokeId)) {
            try {
                await deleteJokeFromDataBase(jokeId);
                bot.sendMessage(chatId, 'Видимо шутка была не очень. Вы её успешно удалили!');
            } catch (error) {
                bot.sendMessage(chatId, `Не удалось удалить шутку. Либо она слишком гениальна, либо есть ошибка. Например, такая: ${error}`);
            }
        } else {
            bot.sendMessage(chatId, 'Чеееел, у нас в базе id-шки это целые числа, а ты какую-то хероту написал!');
        }
    } else {
        bot.sendMessage(chatId, `Гениальные шутки создателей могут удалять только такие же гениальные юмористы, то есть сами создатели!`);
    }
}

export async function listJokes(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (checkCreatorId(userId)) {
        const jokeType = +msg.text.replace('/adminlistjokes ', '');
        if (Number.isInteger(jokeType)) {
            try {
                const result = await getJokesFromDataBase(jokeType);
                bot.sendMessage(chatId, result.map(joke => `id: ${joke.id} - шутка: ${joke.joke} - категория: ${joke.type}`).join('\n'));
            } catch (error) {
                bot.sendMessage(chatId, `Шутки от нас скрываются из-за вот этой ошибки: ${error}`)
            }
        } else {
            bot.sendMessage(chatId, `Номер категории шуток это целые числа. А ты ввёл фиг знает что!`);
        }
    } else {
        bot.sendMessage(chatId, 'Только истинным юмористам разрешается посетить этот тайный мир шуток!');
    }
}

export async function editJoke(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (checkCreatorId(userId)) {
        const parts = msg.text.replace('/admineditjoke ', '').split('/');

        try {
            const [id, joke, jokeType = 0] = parts;
            if (Number.isInteger(+id) && Number.isInteger(+jokeType)) {
                await updateJokeInDataBase(id, joke, jokeType);
                bot.sendMessage(chatId, 'Видимо шутка была не очень. Вы её сделали очень!');
            } else {
                bot.sendMessage(chatId, 'Либо id-шка, либо категория шуток не целочисленное выражение. Исправь!');
            }
        } catch (error) {
            bot.sendMessage(chatId, `Эта шутка не подлежит редактированию из-за гениальности, либо у вас вот эта ошибка: ${error}`);
        }
    } else {
        bot.sendMessage(chatId, 'Только истинные юмористы могут редактировать шутки друг друга. А остальным следует пройти курс у лучших!');
    }
}

export async function sayPrivate(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const parts = msg.text.split(' ');
    if (parts.length < 3) {
        bot.sendMessage(chatId, '❌ Использование: /sayprivate @username сообщение или /sayprivate user_id сообщение');
        return;
    }

    const target = parts[1];
    const privateMsg = parts.slice(2).join(' ');

    let targetId = null;
    let displayName = target;

    if (target.startsWith('@')) {
        try {
            const targetUser = await bot.getChat(target);
            targetId = targetUser.user_id;
            displayName = `@${targetUser.username || targetUser.first_name}`;
        }
        catch (error) {
            console.error('Error fetching user by username:', error);
            bot.sendMessage(chatId, '❌ Ошибка: Не удалось найти пользователя с таким именем.');
            return;
        }
    } else if (!isNaN(target)) {
        targetId = parseInt(target, 10);
    }

    if (!targetId) {
        bot.sendMessage(chatId, '❌ Ошибка: Не удалось определить ID пользователя.');
        return;
    }

    const callbackData = 'showPrivate_' + userId + '_' + targetId + '_' + encodeURIComponent(privateMsg);
    console.log('Callback data:', callbackData);

    bot.sendMessage(chatId, `Это сообщение для ${displayName}`, {
        reply_to_message_id: msg.message_id,
        reply_markup: {
            inline_keyboard: [[
                { text: '🔐 Посмотреть', callback_data: callbackData }
            ]]
        }
    });
}

async function checkCreatorId(userId) {
    return (userId === 963292126 || userId === 112254199);
}