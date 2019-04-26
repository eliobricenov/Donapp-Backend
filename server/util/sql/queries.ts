export const userQueries = {
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


export const postQueries = {
    fetch: 'SELECT post_pk as id, title, description, coordinates, created_at, person_fk as "creatorId", post_type_fk as type FROM post ORDER BY post_pk DESC FETCH FIRST ${size} ROWS ONLY;',
    fetchWithLimit: 'SELECT post_pk as id, title, description, coordinates, created_at, person_fk as "creatorId"  post_type_fk as type FROM post WHERE post_pk < ${id} ORDER BY post_pk DESC FETCH FIRST ${size} ROWS ONLY;',
    createPost: 'INSERT INTO post (post_pk, person_fk, title, description, coordinates, created_at, post_type_fk) VALUES (${id}, ${userId}, ${title}, ${description}, ${coordinates}, ${createdAt}, ${type})',
    createPostImage: 'INSERT INTO post_picture (post_picture_pk, post_fk, path, created_at, url) VALUES (${id}, ${postId}, ${path}, ${createdAt}, ${url})',
    getPostInformation: 'SELECT post_pk as "id", title,description, p.created_at, coordinates, p.username FROM post JOIN person p on post.person_fk = p.person_pk WHERE post_pk = ${postId}',
    getImagesFromPost: 'SELECT url FROM post JOIN post_picture picture on post.post_pk = picture.post_fk WHERE post_pk = ${postId}',
    updatePost: 'UPDATE post SET title = ${title}, description = ${description}, coordinates = ${coordinates} WHERE post_pk = ${id}',
    deletePicture: 'DELETE FROM post_picture WHERE url = ${url}',
    getPostImage: 'SELECT post_picture_pk AS id, url, path FROM post_picture WHERE url = ${url}',
    deletePost: 'DELETE FROM post WHERE post_pk = ${id}',
    createRequest: 'INSERT INTO person_post_request (pk_post_request, fk_target_user, fk_request_status, fk_post) VALUES (${id},${userId}, ${requestStatus}, ${postId});'
}

export const utilQueries = {
    getStates: 'SELECT state_pk AS id, name FROM state;'
}

export const requestStatuses = {
    ACCEPTED: '5810b57b-674f-4542-b2b4-4ef097eadffc',
    COMPLETED: '407f6470-1e5d-49e6-8d17-919948bf0e55',
    REJECTED: 'fc9b26f0-64af-4aa3-a071-02b4c8e47785',
    NOT_COMPLETED: '32d619e3-2fa2-491e-86ed-41a21ab84175',
    AWAITING_APPROVAL: '322ae595-06d1-4729-acb2-32d9a640abc7'
}

export const types = {
    DONATION: '72a38da5-0d62-4e17-9c0d-65d68f2b7ff2', 
    EXCHANGE: 'cce85de2-416b-43a1-9e52-5781435fa475'
}

export const requestQueries = { 
    fetch: 'SELECT pk_post_request as id, fk_target_user as "targetUser", p.person_fk as "sourceUser", p.post_pk as "postId", rs.name as status FROM person_post_request JOIN post p on person_post_request.fk_post = p.post_pk JOIN request_status rs on person_post_request.fk_request_status = rs.pk_request_status  WHERE post_type_fk = ${type} ORDER BY pk_post_request DESC FETCH FIRST ${size} ROWS ONLY; ',
    fetchWithLimit: 'SELECT pk_post_request as id, fk_target_user as "targetUser", p.person_fk as "sourceUser", p.post_pk as "postId", rs.name as status FROM person_post_request JOIN post p on person_post_request.fk_post = p.post_pk JOIN request_status rs on person_post_request.fk_request_status = rs.pk_request_status WHERE post_type_fk = ${type} AND pk_post_request < ${id} ORDER BY pk_post_request DESC FETCH FIRST ${size} ROWS ONLY;',
    findOne: 'SELECT pk_post_request as id, fk_target_user as "targetUser", p.person_fk as "sourceUser", p.post_pk as "postId", rs.name as status FROM person_post_request JOIN post p on person_post_request.fk_post = p.post_pk JOIN request_status rs on person_post_request.fk_request_status = rs.pk_request_statu WHERE pk_post_request = ${id}',
    findFromUser: 'SELECT pk_post_request as id, fk_target_user as "targetUser", p.person_fk as "sourceUser", p.post_pk as "postId", rs.name as status FROM person_post_request JOIN post p on person_post_request.fk_post = p.post_pk JOIN request_status rs on person_post_request.fk_request_status = rs.pk_request_status WHERE person_fk = ${id} AND post_type_fk = ${type}',
    createRequest: 'INSERT INTO person_post_request (pk_post_request, fk_target_user, fk_request_status, fk_post, fk) VALUES (${id}, ${userId}, ${requestStatus}, ${postId})',
    deleteRequest: 'DELETE FROM person_post_request WHERE pk_post_request = ${id}',
    changeRequestStatus: 'UPDATE fk_request_status = ${requestStatus} WHERE pk_post_request = ${requestId}'


}



