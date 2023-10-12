const registration = require('./registration');
const games = require('./games');
const gamePlayers = require('./gamePlayers');
const jokes = require('./jokes');
const adminCommands = require('./adminCommands');

module.exports = {
    register: registration.register,
    getRegistered: registration.getRegistered,
    startGame: games.startGame,
    showGames: games.showGames,
    deactiveGames: games.deactiveGames,
    changeGameLimit: games.changeGameLimit,
    getGamePlayers: gamePlayers.getGamePlayers,
    getAzList: gamePlayers.getAzList,
    addGuest: gamePlayers.addGuest,
    tagGamePlayers: gamePlayers.tagGamePlayers,
    agilliOl: jokes.agilliOl,
    whatTime: jokes.whatTime,
    connectTo: adminCommands.connectTo,
    showGroups: adminCommands.showGroups,
    showYourGroups: adminCommands.showYourGroups
}