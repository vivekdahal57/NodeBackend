const VerifyUserMiddleware = require('./user.verify.middleware');
const AuthorizationController = require('./authorization.controller');
const AuthValidationMiddleware = require('../common/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.post('/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthorizationController.login
    ]);
};