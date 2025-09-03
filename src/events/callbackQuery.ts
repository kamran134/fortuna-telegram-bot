import { CallbackQuery } from 'node-telegram-bot-api';
import { 
    appointmentToTheGame, deactiveGame, declineAppointment, notConfirmedAttendance, privateAppointmentToTheGame, 
    privateDeclineAppointment, privateNotConfirmedAttendance, searchUserInSelectedGroup, showGamesInSelectedGroup, 
    showLastUserInSelectedGroup, showUsersInSelectedGroup, startGameInSelectedGroup, tagGamePlayersInSelectedGroup, sayPrivateButton 
} from "../callbacks";
import { getGamePlayers, showGames, register, agilliOl } from "../commands";
import { CallbackQueryHandler } from '../types';
import { User } from '../models/User';

export const callbackQuery: CallbackQueryHandler = async (query: CallbackQuery, bot) => {
    const chatId = ((query.message || {}).chat || {}).id;
    const userId = query.from?.id;
    const user = query.from;
    let chatMember = null;
    let isAdmin = false;

    if (!userId || !chatId) return;

    if (query.message) {
        chatMember = await bot.getChatMember(chatId, userId);
        isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';
    }

    if (query.data?.startsWith('appointment_')) appointmentToTheGame(query, bot);
    else if (query.data?.startsWith('notconfirmed_')) notConfirmedAttendance(query, bot);
    else if (query.data?.startsWith('decline_')) declineAppointment(query, bot);
    else if (query.data?.startsWith('privateAppointment_')) privateAppointmentToTheGame(query, bot);
    else if (query.data?.startsWith('privateNotconfirmed_')) privateNotConfirmedAttendance(query, bot);
    else if (query.data?.startsWith('privateDecline_')) privateDeclineAppointment(query, bot);
    else if (query.data?.startsWith('deactivegame_')) deactiveGame(query, bot, isAdmin);
    else if (query.data?.startsWith('selectedGroupForStart_') && isAdmin) startGameInSelectedGroup(query, bot);
    else if (query.data?.startsWith('selectedGroupForDeactive_') && isAdmin) showGamesInSelectedGroup(query, bot);
    else if (query.data?.startsWith('selectedGroupForShowUsers_') && isAdmin) showUsersInSelectedGroup(query, bot);
    else if (query.data?.startsWith('selectedGroupForShowLastUser_') && isAdmin) showLastUserInSelectedGroup(query, bot);
    else if (query.data?.startsWith('selectedGroupForSearchUser_') && isAdmin) searchUserInSelectedGroup(query, bot);
    else if (query.data?.startsWith('selectedGroupForTagGamers_') && isAdmin) tagGamePlayersInSelectedGroup(query, bot);
    else if (query.data?.startsWith('selectedGroupForPayList_') && isAdmin) {}
    else if (query.data === 'showgames') showGames(chatId, bot);
    else if (query.data === 'list') getGamePlayers(chatId, bot);
    else if (query.data === 'register') {
        const ourUser: User = {
            id: user.id,
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name || undefined,
            username: user.username || undefined,
            language_code: user.language_code || undefined,
            is_bot: user.is_bot
        };
        register({ chatId, user: ourUser }, bot);
    }
    else if (query.data === 'agilliol') agilliOl(chatId, bot);
    else if (query.data?.startsWith('showPrivate_')) sayPrivateButton(query, bot);
};
