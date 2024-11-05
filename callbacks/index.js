const appointment = require('./appointment');
const gameOptions = require('./gameOptions');
const users = require('./users');

module.exports = {
    appointmentToTheGame: appointment.appointmentToTheGame,
    notConfirmedAttendance: appointment.notConfirmedAttendance,
    declineAppointment: appointment.declineAppointment,
    privateAppointmentToTheGame: appointment.privateAppointmentToTheGame,
    privateNotConfirmedAttendance: appointment.privateNotConfirmedAttendance,
    privateDeclineAppointment: appointment.privateDeclineAppointment,
    deactiveGame: gameOptions.deactiveGame,
    startGameInSelectedGroup: gameOptions.startGameInSelectedGroup,
    showGamesInSelectedGroup: gameOptions.showGamesInSelectedGroup,
    showUsersInSelectedGroup: users.showUsersInSelectedGroup,
    showLastUserInSelectedGroup: users.showLastUserInSelectedGroup,
    searchUserInSelectedGroup: users.searchUsersInSelectedGroup,
    tagGamePlayersInSelectedGroup: gameOptions.tagGamePlayersInSelectedGroup
}