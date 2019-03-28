const userQueries = {
    findAll: 'SELECT * FROM user',
    findOne: 'SELECT name, last_name as "lastName", phone, username, email, url AS avatar FROM person LEFT JOIN avatar a on person.avatar_fk = a.avatar_pk WHERE person_pk = ${id}',
    findUserByUsername: 'SELECT person_pk as "id", name, last_name, email, password, enterprise_name, username, phone, created_at, person_pk_type_fk as "type", person_pk_condition_status_fk as "condition" FROM person WHERE username = ${username};',
    searchUsername: 'SELECT count(person_pk) FROM person WHERE username = ${username}',
    searchEmail: 'SELECT count(person_pk) FROM person WHERE email = ${email}',
    createEmailConfirmation: 'INSERT INTO account_confirmation_email (password_change_request_pk, person_fk, expires_in, token) VALUES (${id}, ${userId}, ${expiresIn}, ${token})',
    deleteEmailConfirmation: 'DELETE FROM account_confirmation_email WHERE password_change_request_pk = ${id}',
    createUserV1: 'INSERT INTO person (person_pk, person_pk_type_fk, email, password, created_at, username) VALUES (${id}, 1, ${email}, ${password}, ${createdAt}, ${username})',
    findUserByConfirmationToken: 'SELECT p.person_pk as "id" FROM account_confirmation_email ac JOIN person p on ac.person_fk = p.person_pk WHERE ac.token = ${token}',
    updateUserStatus: 'UPDATE person SET person_pk_condition_status_fk = ${status} WHERE person_pk = ${id};',
    findConfirmationToken: 'SELECT password_change_request_pk as "id" FROM account_confirmation_email WHERE token = ${content}',
    findSecurityQuestionByName: 'SELECT * FROM security_question WHERE name = ${name}',
    createSecurityAnswer: 'INSERT INTO  person_security_question(person_pk_security_question_pk, person_fk, security_question_fk, answer)  VALUES (${id}, ${userId}, ${questionId}, ${answer})',
    registerAvatar: 'INSERT INTO avatar VALUES (${avatarId}, ${avatarPath}, ${createdAt}, ${url})',
    getAvatarInformation: 'SELECT avatar_pk as "id", path, url FROM person LEFT JOIN avatar a on person.avatar_fk = a.avatar_pk WHERE person_pk = ${id}'
}


const postQueries = {
    createPost: 'INSERT INTO post (post_pk, person_fk, title, description, coordinates, created_at, post_type_fk) VALUES (${id}, ${userId}, ${title}, ${description}, ${coordinates}, ${createdAt}, ${postType})',
    createPostImage: 'INSERT INTO post_picture (post_picture_pk, post_fk, path, created_at, url) VALUES (${id}, ${postId}, ${path}, ${createdAt}, ${url})',
    getPostInformation: 'SELECT title,description, p.created_at, coordinates, p.username FROM post JOIN person p on post.person_fk = p.person_pk WHERE post_pk = ${postId}',
    getImagesFromPost: 'SELECT url FROM post JOIN post_picture picture on post.post_pk = picture.post_fk WHERE post_pk = ${postId}'
}

const utilQueries = {
    getStates: 'SELECT state_pk AS id, name FROM state;'
}
export { userQueries, postQueries, utilQueries };