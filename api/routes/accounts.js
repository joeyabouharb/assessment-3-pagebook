const { Router } = require('express');
const accountController = require('../controllers/accounts');
const Validator = require('../utils/validators');
const Login = require('../models/login');
const Account = require('../models/account');

const accountRouter = Router();

accountRouter.get('/', Validator(Login), accountController.login);
accountRouter.post('/', Validator(Account), accountController.register);

module.exports = Object.freeze(accountRouter);
