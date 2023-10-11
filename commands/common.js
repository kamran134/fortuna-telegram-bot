function tagUsers(users) {
    return Array.isArray(users) ? users.map(user => user.username ? `@${user.username}` :
        `<a href="tg://user?id=${user.user_id}">${user.first_name} ${user.last_name}</a>`).join('\n') : '';
}

function listUsers(users) {
    return users.map((user, index) => `${(index + 1)}. ${user.username} — ${user.first_name} ${user.last_name}`).join('\n');
}

function tagUsersBuCommas(users) {
    console.log(users);
    return Array.isArray(users) ? users.map(user => `<a href="tg://user?id=${user.user_id}">${user.first_name} ${user.last_name}</a>`).join(', ') : '';
}

module.exports = {
    tagUsers,
    listUsers,
    tagUsersBuCommas
}