"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user = {
    findAll: 'SELECT * FROM user',
    findOne: 'SELECT * FROM user WHERE pk = ${id}'
};
exports.user = user;
