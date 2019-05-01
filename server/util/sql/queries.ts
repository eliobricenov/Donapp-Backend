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
    fetch: 'SELECT request_pk as id, person_fk as "creatorId", title, description, coordinates, created_at FROM request WHERE request.finished = false ORDER BY request_pk DESC FETCH FIRST ${size} ROWS ONLY ;',
    fetchWithLimit: 'SELECT request_pk as id, title, description, coordinates, created_at, person_fk as "creatorId" FROM request WHERE request_pk < ${id} AND request.finished = false ORDER BY request_pk DESC FETCH FIRST ${size} ROWS ONLY;',
    findOne: 'SELECT request_pk as id, person_fk as "creatorId", title, description, coordinates, created_at FROM request WHERE person_fk = ${userId} AND finished = false',
    findFromUser: 'SELECT request_pk as id, person_fk as "creatorId", title, description, coordinates, created_at FROM request WHERE person_fk = ${userId} AND request.finished = false ORDER BY request_pk DESC FETCH FIRST ${size} ROWS ONLY;',
    createRequest: 'INSERT INTO request (request_pk, person_fk, title, description, coordinates, created_at, request_type_fk, finished) VALUES (${id}, ${userId}, ${title}, ${description}, ${coordinates}, ${createdAt}, ${type}, false)',
    deleteRequest: 'DELETE FROM person_post_request WHERE pk_post_request = ${id}',
    getImagesFromRequest: 'SELECT url FROM request JOIN request_picture picture on request.request_pk = picture.request_fk WHERE request_pk = ${requestId}',
    createRequestImage: 'INSERT INTO request_picture (request_picture_pk, request_fk, path, created_at, url) VALUES (${id}, ${requestId}, ${path}, ${createdAt}, ${url})',
    getFromProposal: 'SELECT request_pk as "id", person_fk as "userId" FROM proposal JOIN request r on proposal.fk_request = r.request_pk JOIN person p on proposal.fk_user = p.person_pk WHERE proposal_pk =${proposalId}',
    markAsFinished: 'UPDATE request SET finished = true WHERE request_pk = ${requestId}'
}

export const proposalQueries = {
    fetch: 'SELECT proposal_pk as id, fk_request as "creatorId", p.description FROM proposal p JOIN request r on p.fk_request = r.request_pk WHERE r.person_fk = ${userId} AND p.finished = false ORDER BY proposal_pk DESC FETCH FIRST ${size} ROWS ONLY;',
    fetchWithLimit: 'SELECT proposal_pk as id, fk_request as "creatorId", p.description FROM proposal p JOIN request r on p.fk_request = r.request_pk WHERE r.person_fk = ${userId} AND proposal_pk < ${id} AND p.finished = false ORDER BY proposal_pk DESC FETCH FIRST ${size} ROWS ONLY;',
    findOne: 'SELECT proposal_pk as id, fk_request as "creatorId", p.description, r.request_type_fk as "requestType" FROM proposal p JOIN request r ON p.fk_request = r.request_pk WHERE proposal_pk = ${id}',
    findFromUser: 'SELECT proposal_pk as id, fk_request as "creatorId", description FROM proposal FROM request WHERE proposal_pk = ${id} WHERE finished = false',
    createProposal: 'INSERT INTO proposal (proposal_pk, fk_request, description, fk_user, finished) VALUES (${id}, ${requestId}, ${description}, ${userId}, false)',
    deleteProposal: 'DELETE FROM proposal WHERE proposal_pk = ${id}',
    getImagesFromProposal: 'SELECT url FROM proposal JOIN proposal_picture picture on proposal.proposal_pk = picture.proposal_fk WHERE proposal_pk = ${proposalId}',
    createProposalImage: 'INSERT INTO proposal_picture (proposal_picture_pk, proposal_fk, path, created_at, url) VALUES (${id}, ${proposalId}, ${path}, ${createdAt}, ${url})',
    getProposalPreview: 'SELECT p.name as "requestOwnerName", r.title, r.request_type_fk as "requestType", url, r.person_fk as "requestOwner", fk_user as "proposalOwner", p2.name as "proposalOwnerName" FROM proposal JOIN request r on proposal.fk_request = r.request_pk JOIN person p on proposal.fk_user = p.person_pk JOIN person p2 on r.person_fk = p2.person_pk JOIN (SELECT url FROM proposal_picture WHERE proposal_fk = ${proposalId} FETCH FIRST 1 ROW ONLY) AS sq ON 1 = 1 WHERE proposal_pk = ${proposalId};',
    getProposalPreviewWithoutImage: 'INSERT INTO notification (notification_pk, proposal_fk, message, person_fk) VALUES (${id}, ${proposalId}, ${message}, ${userId})',
    markAsFinished: 'UPDATE proposal SET finished = true WHERE proposal_pk = ${proposalId}'
}

export const notificationQueries = {
    fetch: 'SELECT notification_pk as id, message, is_read as  "isRead", created_at, proposal_fk as "proposalId", nt.name as "type" FROM notification n JOIN notification_type nt on n.notification_type_fk = nt.notification_type_pk WHERE n.person_fk = ${userId} ORDER BY notification_pk DESC FETCH FIRST ${size} ROWS ONLY;',
    fetchWithLimit: 'SELECT notification_pk as id, message, is_read as  "isRead", created_at, proposal_fk as "proposalId", nt.name as "type" FROM notification n JOIN notification_type nt on n.notification_type_fk = nt.notification_type_pk WHERE n.person_fk = ${userId} AND notification_pk < ${id} ORDER BY notification_pk DESC FETCH FIRST ${size} ROWS ONLY;',
    findOne: 'SELECT notification_pk as id, message, is_read as  "isRead", created_at, proposal_fk as "proposalId", nt.name FROM notification n JOIN notification_type nt on n.notification_type_fk = nt.notification_type_pk WHERE n.proposal_pk = ${notificationId}',
    createNotification: 'INSERT INTO notification (notification_pk, proposal_fk, message, person_fk, is_read, notification_type_fk, created_at) VALUES (${id}, ${proposalId}, ${message}, ${userId}, false, ${notificationType}, ${createdAt})',
    deleteNotification: 'DELETE FROM notification WHERE notification_pk = ${id}',
}

export const notificationTypes = {
    RECEIVED: '433b66fa-221f-4bb0-8103-176c6baffd3a',
    ACCEPTED: 'bc76e470-27bf-44dc-bb93-7b1665653bb1',
    REJECTED: '681f6eea-a996-4b08-ab86-fe8ae8712e9e',
    CONFIRMED: '67d5594e-5e6a-429b-80d1-e8bab92f06f7',
    RATED: '99376142-5ace-4d46-ad8b-1090767c13ad'
}

export const donationQueries = {
    createDonation: 'INSERT INTO donation (donation_pk, fk_proposal, person_fk, confirmed) VALUES (${id}, ${proposalId}, ${userId}, false)',
    getUnconfirmedDonationsWithLimit: 'SELECT d.donation_pk as id, p.proposal_pk as "proposalId" FROM donation d JOIN proposal p ON d.fk_proposal = p.proposal_pk JOIN request r on p.fk_request = r.request_pk WHERE r.person_fk = ${userId} AND d.confirmed = false AND donation_pk < ${id} ORDER BY donation_pk DESC FETCH FIRST ${size} ROWS ONLY',
    getUnconfirmedDonations: 'SELECT d.donation_pk as id, p.proposal_pk as "proposalId" FROM donation d JOIN proposal p ON d.fk_proposal = p.proposal_pk JOIN request r on p.fk_request = r.request_pk WHERE r.person_fk = ${userId} AND d.confirmed = false ORDER BY donation_pk DESC FETCH FIRST ${size} ROWS ONLY',
    markAsConfirmed: 'UPDATE donation SET confirmed = true WHERE donation_pk = ${donationId}',
    getDonationPreview: 'SELECT p1.name as "requestOwnerName", r.title, url, r.person_fk as "requestOwner", fk_user as "proposalOwner", p2.name as "proposalOwnerName" FROM donation JOIN proposal p on donation.fk_proposal = p.proposal_pk JOIN request r on p.fk_request = r.request_pk JOIN person p1 on donation.person_fk = p1.person_pk JOIN person p2 on p.fk_user = p2.person_pk JOIN (SELECT url FROM proposal_picture WHERE proposal_fk = (SELECT proposal_fk FROM donation WHERE donation_pk = ${donationId}) FETCH FIRST 1 ROW ONLY) AS sq ON 1 = 1 WHERE donation_pk = ${donationId}'
}

export const tradeQueries = {
    getUnconfirmedTrades: 'SELECT t.trade_pk as "tradeId", p1.name as "requestOwnerName", r.title, r.person_fk as "requestOwner", fk_user as "proposalOwner", p2.name as "proposalOwnerName", fk_proposal as "proposalId" FROM rating JOIN trade t ON rating.trade_fk = t.trade_pk JOIN proposal ON t.fk_proposal = proposal.proposal_pk JOIN request r ON proposal.fk_request = r.request_pk JOIN person p1 on rating.evaluated_user_fk = p1.person_pk JOIN person p2 ON rating.evaluator_user_fk = p2.person_pk WHERE rate IS NULL AND evaluator_user_fk = ${userId}',
    createTrade: 'INSERT INTO trade (trade_pk, fk_proposal) VALUES (${id}, $(proposalId))',
    getTradePreview: 'SELECT proposal_pk as "proposalId", r.title as "requestName", person.name as "evaluatorName", evaluated_user_fk as "evaluatedUser" FROM rating JOIN trade t on rating.trade_fk = t.trade_pk JOIN person ON rating.evaluator_user_fk = person.person_pk JOIN proposal p on t.fk_proposal = p.proposal_pk JOIN request r on p.fk_request = r.request_pk WHERE trade_pk = ${tradeId} AND evaluator_user_fk = ${userId}'
}

export const ratingQueries = {
    createRating: 'INSERT INTO rating (trade_fk, evaluator_user_fk, evaluated_user_fk, rate) VALUES (${id}, ${evaluatorId}, ${evaluatedId}, ${rating})',
    updateRating: 'UPDATE rating SET rate = ${rate} WHERE evaluator_user_fk = ${userId} AND trade_fk = ${tradeId}'
}

export const requestTypes = {
    TRADE: 'cce85de2-416b-43a1-9e52-5781435fa475',
    DONATION: '72a38da5-0d62-4e17-9c0d-65d68f2b7ff2'
}