const { Router } = require('express');
const accountController = require('../controllers/accounts');
const { requiresValidation } = require('../utils/validators');
const Login = require('../models/login');
const Account = require('../models/account');
const { authNeeded } = require('../utils/auth');

const accountRouter = Router();

accountRouter.get('/', requiresValidation(Login), accountController.login);
accountRouter.post('/', requiresValidation(Account), accountController.register);
accountRouter.delete('/', authNeeded, requiresValidation(Login), accountController.deleteAccount);
accountRouter.patch('/', authNeeded, requiresValidation(Account), accountController.updateAccount);
// accountRouter.patch('/edit/password', authNeeded, requiresValidation(ChangeLogin),)
module.exports = Object.freeze(accountRouter);
