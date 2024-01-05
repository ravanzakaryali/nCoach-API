"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class AuthMiddleware {
    constructor() {
        this.redirectTo = '/login';
    }
    async authenticate(auth, guards) {
        for (let guard of guards) {
            if (await auth.use(guard).check()) {
                auth.defaultGuard = guard;
                return true;
            }
        }
        throw new NotFoundException_1.default("Yetkisiz erişim.", 401);
    }
    async handle({ auth }, next, customGuards) {
        const guards = customGuards.length ? customGuards : [auth.name];
        await this.authenticate(auth, guards);
        await next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map