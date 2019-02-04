const userQueries = {
    findAll: 'SELECT * FROM user',
    findOne: 'SELECT * FROM user WHERE pk = ${id}'
}

export { userQueries };