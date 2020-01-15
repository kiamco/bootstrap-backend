exports.up = function(knex) {
    return knex.schema
        .createTable('users', user => {
            user.increments('uid');
            user.string('username', 255)
                .notNullable()
                .unique();
            user.string('password', 255).notNullable();
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users')
};