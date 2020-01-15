const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function() {
            // Inserts seed entries
            const salt = bcrypt.genSaltSync(10);;
            return knex('users').insert([{
                username: 'kimbo',
                password: bcrypt.hashSync("test", salt)
            }, ]);
        });
};