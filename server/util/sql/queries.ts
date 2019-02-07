const userQueries = {
    findAll: 'SELECT * FROM user',
    findOne: 'SELECT * FROM user WHERE pk = ${id}',
    searchUsername: 'SELECT count(person_pk) FROM person WHERE username = ${username}',
    searchEmail: 'SELECT count(person_pk) FROM person WHERE email = ${email}'
}

export { userQueries };