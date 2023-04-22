const moment = require('moment');
const appointment = require('./appointment');
const gameOptions = require('./gameOptions');

module.exports = {
    appointmentToTheGame: appointment.appointmentToTheGame,
    notExactlyAppointment: appointment.notExactlyAppointment,
    declineAppointment: appointment.declineAppointment,
    deactiveGame: gameOptions.deactiveGame
}