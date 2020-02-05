const { Router } = require('express');
const accountController = require('../controllers/accounts');
const { requiresValidation } = require('../utils/validators');
const Login = require('../models/login');
const NewLogin = require('../models/newLogin');
const Account = require('../models/account');
const editAccount = require('../models/editAccount');
const { authNeeded } = require('../utils/auth');

const accountRouter = Router();

accountRouter.get('/:accountID', requiresValidation(Login), accountController.login);
accountRouter.post('/', requiresValidation(Account), accountController.register);
accountRouter.delete('/:accountID', authNeeded, accountController.deleteAccount);
accountRouter.patch('/:accountID/details', authNeeded, requiresValidation(editAccount), accountController.updateAccount);
accountRouter.patch('/:accountID/password', authNeeded, requiresValidation(NewLogin), accountController.changeUserPassword);

module.exports = Object.freeze(accountRouter);
