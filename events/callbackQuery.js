import { appointmentToTheGame, deactiveGame, declineAppointment, notConfirmedAttendance, privateAppointmentToTheGame, 
    privateDeclineAppointment, privateNotConfirmedAttendance, searchUserInSelectedGroup, showGamesInSelectedGroup, 
    showLastUserInSelectedGroup, showUsersInSelectedGroup, startGameInSelectedGroup, tagGamePlayersInSelectedGroup, sayPrivateButton } from "../callbacks/index.js";
import { getGamePlayers, showGames, register, agilliOl } from "../commands/index.js";

export const callbackQuery = async (query, bot) => {
    const chatId = ((query.message || {}).chat || {}).id;
    const userId = query.from.id;
    const user = query.from;
    let chatMember = null;
    let isAdmin = false;

    if (query.message) {
        chatMember = await bot.getChatMember(chatId, userId);
        isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';
    }

    if (query.data.startsWith('appointment_')) appointmentToTheGame(query, bot);
    else if (query.data.startsWith('notconfirmed_')) notConfirmedAttendance(query, bot);
    else if (query.data.startsWith('decline_')) declineAppointment(query, bot);
    else if (query.data.startsWith('privateAppointment_')) privateAppointmentToTheGame(query, bot);
    else if (query.data.startsWith('privateNotconfirmed_')) privateNotConfirmedAttendance(query, bot);
    else if (query.data.startsWith('privateDecline_')) privateDeclineAppointment(query, bot);
    else if (query.data.startsWith('deactivegame_')) deactiveGame(query, bot, isAdmin);
    else if (query.data.startsWith('selectedGroupForStart_') && isAdmin) startGameInSelectedGroup(query, bot);
    else if (query.data.startsWith('selectedGroupForDeactive_') && isAdmin) showGamesInSelectedGroup(query, bot);
    else if (query.data.startsWith('selectedGroupForShowUsers_') && isAdmin) showUsersInSelectedGroup(query, bot);
    else if (query.data.startsWith('selectedGroupForShowLastUser_') && isAdmin) showLastUserInSelectedGroup(query, bot);
    else if (query.data.startsWith('selectedGroupForSearchUser_') && isAdmin) searchUserInSelectedGroup(query, bot);
    else if (query.data.startsWith('selectedGroupForTagGamers_') && isAdmin) tagGamePlayersInSelectedGroup(query, bot);
    else if (query.data.startsWith('selectedGroupForPayList_') && isAdmin) {}
    else if (query.data === 'showgames') showGames(chatId, bot);
    else if (query.data === 'list') getGamePlayers(chatId, bot);
    else if (query.data === 'register') register({ chatId, user }, bot);
    else if (query.data === 'agilliol') agilliOl(chatId, bot);
    else if (query.data.startsWith('showPrivate_')) sayPrivateButton(query, bot);
}