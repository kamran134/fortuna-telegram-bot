"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackQuery = void 0;
const callbacks_1 = require("../callbacks");
const commands_1 = require("../commands");
const callbackQuery = async (query, bot) => {
    const chatId = ((query.message || {}).chat || {}).id;
    const userId = query.from?.id;
    const user = query.from;
    let chatMember = null;
    let isAdmin = false;
    if (!userId || !chatId)
        return;
    if (query.message) {
        chatMember = await bot.getChatMember(chatId, userId);
        isAdmin = chatMember.status === 'administrator' || chatMember.status === 'creator';
    }
    if (query.data?.startsWith('appointment_'))
        (0, callbacks_1.appointmentToTheGame)(query, bot);
    else if (query.data?.startsWith('notconfirmed_'))
        (0, callbacks_1.notConfirmedAttendance)(query, bot);
    else if (query.data?.startsWith('decline_'))
        (0, callbacks_1.declineAppointment)(query, bot);
    else if (query.data?.startsWith('privateAppointment_'))
        (0, callbacks_1.privateAppointmentToTheGame)(query, bot);
    else if (query.data?.startsWith('privateNotconfirmed_'))
        (0, callbacks_1.privateNotConfirmedAttendance)(query, bot);
    else if (query.data?.startsWith('privateDecline_'))
        (0, callbacks_1.privateDeclineAppointment)(query, bot);
    else if (query.data?.startsWith('deactivegame_'))
        (0, callbacks_1.deactiveGame)(query, bot, isAdmin);
    else if (query.data?.startsWith('selectedGroupForStart_') && isAdmin)
        (0, callbacks_1.startGameInSelectedGroup)(query, bot);
    else if (query.data?.startsWith('selectedGroupForDeactive_') && isAdmin)
        (0, callbacks_1.showGamesInSelectedGroup)(query, bot);
    else if (query.data?.startsWith('selectedGroupForShowUsers_') && isAdmin)
        (0, callbacks_1.showUsersInSelectedGroup)(query, bot);
    else if (query.data?.startsWith('selectedGroupForShowLastUser_') && isAdmin)
        (0, callbacks_1.showLastUserInSelectedGroup)(query, bot);
    else if (query.data?.startsWith('selectedGroupForSearchUser_') && isAdmin)
        (0, callbacks_1.searchUserInSelectedGroup)(query, bot);
    else if (query.data?.startsWith('selectedGroupForTagGamers_') && isAdmin)
        (0, callbacks_1.tagGamePlayersInSelectedGroup)(query, bot);
    else if (query.data?.startsWith('selectedGroupForPayList_') && isAdmin) { }
    else if (query.data === 'showgames')
        (0, commands_1.showGames)(chatId, bot);
    else if (query.data === 'list')
        (0, commands_1.getGamePlayers)(chatId, bot);
    else if (query.data === 'register') {
        const ourUser = {
            id: user.id,
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name || undefined,
            username: user.username || undefined,
            language_code: user.language_code || undefined,
            is_bot: user.is_bot
        };
        (0, commands_1.register)({ chatId, user: ourUser }, bot);
    }
    else if (query.data === 'agilliol')
        (0, commands_1.agilliOl)(chatId, bot);
    else if (query.data?.startsWith('showPrivate_'))
        (0, callbacks_1.sayPrivateButton)(query, bot);
};
exports.callbackQuery = callbackQuery;
//# sourceMappingURL=callbackQuery.js.map