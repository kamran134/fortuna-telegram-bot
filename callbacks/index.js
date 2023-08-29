const appointment = require('./appointment');
const gameOptions = require('./gameOptions');
const users = require('./users');

module.exports = {
    appointmentToTheGame: appointment.appointmentToTheGame,
    notConfirmedAttendance: appointment.notConfirmedAttendance,
    declineAppointment: appointment.declineAppointment,
    deactiveGame: gameOptions.deactiveGame,
    startGameInSelectedGroup: gameOptions.startGameInSelectedGroup,
    showGamesInSelectedGroup: gameOptions.showGamesInSelectedGroup,
    showUsersInSelectedGroup: users.showUsersInSelectedGroup
}