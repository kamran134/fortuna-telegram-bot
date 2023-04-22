const registration = require('./registration');
const games = require('./games');
const gamePlayers = require('./gamePlayers');
const jokes = require('./jokes');

module.exports = {
    register: registration.register,
    tagRegistered: registration.tagRegistered,
    startGame: games.startGame,
    showGames: games.showGames,
    deactiveGames: games.deactiveGames,
    getGamePlayers: gamePlayers.getGamePlayers,
    addGuest: gamePlayers.addGuest,
    agilliOl: jokes.agilliOl,
    whatTime: jokes.whatTime
}