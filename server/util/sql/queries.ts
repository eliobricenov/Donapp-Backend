const userQueries = {
    findAll: 'SELECT * FROM user',
    findOne: 'SELECT * FROM user WHERE pk = ${id}',
    searchUsername: 'SELECT count(person_pk) FROM person WHERE username = ${username}',
    searchEmail: 'SELECT count(person_pk) FROM person WHERE email = ${email}',
    createEmailConfirmation: 'INSERT INTO account_confirmation_email (password_change_request_pk, person_fk, expires_in) VALUES (${id}, ${personId}, ${expiresIn})',
    deleteEmailConfirmation: 'DELETE FROM account_confirmation_email WHERE password_change_request_pk = ${id}',
    createUserV1: 'INSERT INTO person (person_pk, person_pk_type_fk, person_pk_condition_status_fk, email, password, created_at, username) VALUES (${id}, 1, 1, ${email}, ${password}, ${createdAt}, ${username})'

}

export { userQueries };