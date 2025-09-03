"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sayPrivate = exports.deleteJoke = exports.listJokes = exports.editJoke = exports.tagUndecidedPlayers = exports.saySomethingToInactive = exports.editUser = exports.addJoke = exports.showYourGroups = exports.showGroups = exports.connectTo = exports.changeGameLimit = exports.tagGamePlayers = exports.getAzList = exports.agilliOl = exports.whatTime = exports.addGuest = exports.getGamePlayers = exports.deactiveGames = exports.showGames = exports.startGame = exports.tagUsersByCommas = exports.listUsers = exports.tagUsers = exports.showMenu = exports.unregister = exports.getRegistered = exports.register = void 0;
var registration_1 = require("./registration");
Object.defineProperty(exports, "register", { enumerable: true, get: function () { return registration_1.register; } });
Object.defineProperty(exports, "getRegistered", { enumerable: true, get: function () { return registration_1.getRegistered; } });
Object.defineProperty(exports, "unregister", { enumerable: true, get: function () { return registration_1.unregister; } });
var common_1 = require("./common");
Object.defineProperty(exports, "showMenu", { enumerable: true, get: function () { return common_1.showMenu; } });
Object.defineProperty(exports, "tagUsers", { enumerable: true, get: function () { return common_1.tagUsers; } });
Object.defineProperty(exports, "listUsers", { enumerable: true, get: function () { return common_1.listUsers; } });
Object.defineProperty(exports, "tagUsersByCommas", { enumerable: true, get: function () { return common_1.tagUsersByCommas; } });
// Temporary exports - these will be created later
const startGame = async (msg, bot) => {
    console.log('startGame not implemented yet');
};
exports.startGame = startGame;
const showGames = async (chatId, bot, deleteMode) => {
    console.log('showGames not implemented yet');
};
exports.showGames = showGames;
const deactiveGames = async (msg, bot, isAdmin) => {
    console.log('deactiveGames not implemented yet');
};
exports.deactiveGames = deactiveGames;
const getGamePlayers = async (chatId, bot) => {
    console.log('getGamePlayers not implemented yet');
};
exports.getGamePlayers = getGamePlayers;
const addGuest = async (msg, bot) => {
    console.log('addGuest not implemented yet');
};
exports.addGuest = addGuest;
const whatTime = async (msg, bot) => {
    console.log('whatTime not implemented yet');
};
exports.whatTime = whatTime;
const agilliOl = async (chatId, bot) => {
    console.log('agilliOl not implemented yet');
};
exports.agilliOl = agilliOl;
const getAzList = async (msg, bot) => {
    console.log('getAzList not implemented yet');
};
exports.getAzList = getAzList;
const tagGamePlayers = async (chatId, bot, isAdmin) => {
    console.log('tagGamePlayers not implemented yet');
};
exports.tagGamePlayers = tagGamePlayers;
const changeGameLimit = async (msg, bot) => {
    console.log('changeGameLimit not implemented yet');
};
exports.changeGameLimit = changeGameLimit;
const connectTo = async (msg, bot) => {
    console.log('connectTo not implemented yet');
};
exports.connectTo = connectTo;
const showGroups = async (chatId, bot) => {
    console.log('showGroups not implemented yet');
};
exports.showGroups = showGroups;
const showYourGroups = async (chatId, bot, action) => {
    console.log('showYourGroups not implemented yet');
};
exports.showYourGroups = showYourGroups;
const addJoke = async (msg, bot) => {
    console.log('addJoke not implemented yet');
};
exports.addJoke = addJoke;
const editUser = async (msg, bot) => {
    console.log('editUser not implemented yet');
};
exports.editUser = editUser;
const saySomethingToInactive = async (msg, bot) => {
    console.log('saySomethingToInactive not implemented yet');
};
exports.saySomethingToInactive = saySomethingToInactive;
const tagUndecidedPlayers = async (chatId, bot) => {
    console.log('tagUndecidedPlayers not implemented yet');
};
exports.tagUndecidedPlayers = tagUndecidedPlayers;
const editJoke = async (msg, bot) => {
    console.log('editJoke not implemented yet');
};
exports.editJoke = editJoke;
const listJokes = async (msg, bot) => {
    console.log('listJokes not implemented yet');
};
exports.listJokes = listJokes;
const deleteJoke = async (msg, bot) => {
    console.log('deleteJoke not implemented yet');
};
exports.deleteJoke = deleteJoke;
const sayPrivate = async (msg, bot) => {
    console.log('sayPrivate not implemented yet');
};
exports.sayPrivate = sayPrivate;
//# sourceMappingURL=index.js.map