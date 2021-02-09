const UsersController = require('./users.controller');
const PermissionMiddleware = require('../../common/auth.permission.middleware');
const ValidationMiddleware = require('../../common/auth.validation.middleware');
const config = require('../../config/env.config');

const ADMIN = config.permissionLevel.ADMIN;
const PAID = config.permissionLevel.PAID_USER;
const FREE = config.permissionLevel.NORMAL_USER;

exports.routesConfig = function (app) {
    app.post('/users', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        UsersController.insert
    ]);
    app.get('/users', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        UsersController.list
    ]);
    app.get('/users/:email', [
        UsersController.getByEmail
    ]);
    app.get('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.getById
    ]);
    app.patch('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.updateById
    ]);
    app.patch('/users/changePassword/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.updatePasswordById
    ]);
    app.delete('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        UsersController.removeById
    ]);
};