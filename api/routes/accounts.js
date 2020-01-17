const { Router } = require('express');
const accountController = require('../controllers/accounts');
const { requiresValidation } = require('../utils/validators');
const Login = require('../models/login');
const Account = require('../models/account');

const accountRouter = Router();

accountRouter.get('/', requiresValidation(Login), accountController.login);
accountRouter.post('/', requiresValidation(Account), accountController.register);
// accountRouter.delete('/', requiresValidation(Login), accountController.delete);
// accountRouter.patch('/', requiresValidation(Account), accountController.update);

module.exports = Object.freeze(accountRouter);
