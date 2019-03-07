const userQueries = {
    findAll: 'SELECT * FROM user',
    findOne: 'SELECT * FROM person JOIN avatar a on person.avatar_fk = a.avatar_pk WHERE person_pk = ${id}',
    findUserByUsername: 'SELECT person_pk as "id", name, last_name, email, password, enterprise_name, username, phone, created_at, person_pk_type_fk as "type", person_pk_condition_status_fk as "condition" FROM person WHERE username = ${username};',
    searchUsername: 'SELECT count(person_pk) FROM person WHERE username = ${username}',
    searchEmail: 'SELECT count(person_pk) FROM person WHERE email = ${email}',
    createEmailConfirmation: 'INSERT INTO account_confirmation_email (password_change_request_pk, person_fk, expires_in, token) VALUES (${id}, ${userId}, ${expiresIn}, ${token})',
    deleteEmailConfirmation: 'DELETE FROM account_confirmation_email WHERE password_change_request_pk = ${id}',
    createUserV1: 'INSERT INTO person (person_pk, person_pk_type_fk, email, password, created_at, username) VALUES (${id}, 1, ${email}, ${password}, ${createdAt}, ${username})',
    findUserByConfirmationToken: 'SELECT p.person_pk as "id" FROM account_confirmation_email ac JOIN person p on ac.person_fk = p.person_pk WHERE ac.token = ${token}',
    updateUserStatus: 'UPDATE person SET person_pk_condition_status_fk = ${status} WHERE person_pk = ${userId};',
    findConfirmationToken: 'SELECT password_change_request_pk as "id" FROM account_confirmation_email WHERE token = ${content}',
    findSecurityQuestionByName: 'SELECT * FROM security_question WHERE name = ${name}',
    createSecurityAnswer: 'INSERT INTO  person_security_question(person_pk_security_question_pk, person_fk, security_question_fk, answer)  VALUES (${id}, ${userId}, ${questionId}, ${answer})',
    registerAvatar: 'INSERT INTO avatar VALUES (${avatarId}, ${avatarPath}, ${createdAt}, ${url})'
}

export { userQueries };