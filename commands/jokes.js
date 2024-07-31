const moment = require('moment');
const { getGamesTimesFromDatabase, getRandomUserFromDatabase, addJokeToDataBase, deleteJokeFromDataBase, getJokesFromDataBase, updateJokeInDataBase } = require('../database');

async function agilliOl(msg, bot) {
    const chatId = msg.chat.id;

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

async function whatTime(msg, bot) {
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

async function addJoke(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (checkCreatorId(userId)) {
        try {
            const parts = msg.text.replace('/adminaddjoke ', '').split('/');
            if (parts.length == 2) {
                const [joke, jokeType] = parts;
                await addJokeToDataBase(joke, jokeType);
    
                bot.sendMessage(chatId, `Ваша гениальная "шутка" добавлена в базу данных. Полюбуйтесь на неё ещё раз: ${joke}`);
            } else {
                bot.sendMessage(chatId, `Дед, ты что-то напортачил. Вот какой формат: /adminaddjoke [шутка]/[номер категории шутки]`);
            }
            
        } catch (error) {
            bot.sendMessage(chatId, `Ваша гениальная "шутка" не добавилась. Возможно она слишком тупая. А возможно возникла вот такая ошибка: ${error}`);
        }
    } else {
        bot.sendMessage(chatId, `Такую ответственную работу, как пополнить базу шутками мы могли доверить только истинным юмористам. Поэтому никто кроме создателей бота не может увлекаться этим!`);
    }
}

async function deleteJoke(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (checkCreatorId(userId)) {
        const jokeId = +msg.text.replace('/admindeletejoke ', '');
        if (Number.isInteger(jokeId)) {
            try {
                const result = await deleteJokeFromDataBase(jokeId);
                return result;
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

async function listJokes(msg, bot) {
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

async function editJoke(msg, bot) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (checkCreatorId(userId)) {
        const parts = msg.text.replace('/admineditjoke ', '').split('/');

        try {
            if (parts.length == 3) {
                const [id, joke, jokeType] = parts;
                if (Number.isInteger(+id) && Number.isInteger(+jokeType)) {
                    const result = await updateJokeInDataBase(id, joke, jokeType);
                    return result;
                } else {
                    bot.sendMessage(chatId, 'Либо id-шка, либо категория шуток не целочисленное выражение. Исправь!');
                }
            }
            else if (parts.length == 2) {
                const [id, joke] = parts;
                if (Number.isInteger(+id)) {
                    const result = await updateJokeInDataBase(id, joke, 0);
                    return result;
                } else {
                    bot.sendMessage(chatId, 'Какое-то левое id ты написал');
                }
            }
        } catch (error) {
            bot.sendMessage(chatId, `Эта шутка не подлежит редактированию из-за гениальности, либо у вас вот эта ошибка: ${error}`);
        }
    } else {
        bot.sendMessage(chatId, 'Только истинные юмористы могут редактировать шутки друг друга. А остальным следует пройти курс у лучших!');
    }
}

function checkCreatorId(userId) {
    return (userId === 963292126 || userId === 112254199);
}

module.exports = {
    agilliOl,
    whatTime,
    addJoke,
    deleteJoke,
    listJokes,
    editJoke
}