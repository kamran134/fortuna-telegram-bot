const appointment = require('./appointment');
const gameOptions = require('./gameOptions');

module.exports = {
    appointmentToTheGame: appointment.appointmentToTheGame,
    notExactlyAppointment: appointment.notExactlyAppointment,
    declineAppointment: appointment.declineAppointment,
    deactiveGame: gameOptions.deactiveGame,
    startGameInSelectedGroup: gameOptions.startGameInSelectedGroup,
    showGamesInSelectedGroup: gameOptions.showGamesInSelectedGroup
}