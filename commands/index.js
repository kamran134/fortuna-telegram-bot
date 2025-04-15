// const registration = require('./registration');
// const games = require('./games');
// const gamePlayers = require('./gamePlayers');
// const jokes = require('./jokes');
// const adminCommands = require('./adminCommands');
// const common = require('./common');

// module.exports = {
//     showMenu: common.showMenu,
//     register: registration.register,
//     getRegistered: registration.getRegistered,
//     startGame: games.startGame,
//     showGames: games.showGames,
//     deactiveGames: games.deactiveGames,
//     changeGameLimit: games.changeGameLimit,
//     getGamePlayers: gamePlayers.getGamePlayers,
//     getAzList: gamePlayers.getAzList,
//     addGuest: gamePlayers.addGuest,
//     tagGamePlayers: gamePlayers.tagGamePlayers,
//     agilliOl: jokes.agilliOl,
//     whatTime: jokes.whatTime,
//     addJoke: jokes.addJoke,
//     connectTo: adminCommands.connectTo,
//     showGroups: adminCommands.showGroups,
//     showYourGroups: adminCommands.showYourGroups,
// }

export { register, getRegistered } from './registration.js';
export { startGame, showGames, deactiveGames, changeGameLimit } from './games.js';
export { getGamePlayers, getAzList, addGuest, tagGamePlayers } from './gamePlayers.js';
export { agilliOl, whatTime, addJoke } from './jokes.js';
export { connectTo, showGroups, showYourGroups } from './adminCommands.js';
export { editUser } from './adminCommands.js';
export { editJoke, listJokes } from './jokes.js';
export { deleteJoke } from '../database/jokes.js';
export { tagUndecidedPlayers, saySomethingToInactive } from './gamePlayers.js';
export { showMenu } from './common.js';
export { getGroups } from '../database/adminGroup.js';