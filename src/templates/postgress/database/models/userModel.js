// create models.
const db = require('../../config/dbConfig');

const find = () => {
    return db('users').select('*');
}

const findByUser = (user) => {
    return db('users').select('*').where('username', user);
}

const addUser = (userObj) => {
    return db('users').insert(userObj);
}

module.exports = {
    find,
    findByUser,
    addUser
}