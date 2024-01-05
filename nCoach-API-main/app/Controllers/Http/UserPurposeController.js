"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserPurposeValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserPurposeValidator"));
const UserPurposes_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserPurposes"));
class UserPurposeController {
    async filter(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const { type } = ctx.request.all();
        let data = [];
        if (type == "date") {
            data = await UserPurposes_1.default.query().where("user_id", user_id).orderBy("created_at", "asc");
        }
        if (type == "status") {
            data = await UserPurposes_1.default.query().where("user_id", user_id).andWhere("status", true);
        }
        if (type == "duration") {
            data = await UserPurposes_1.default.query().where("user_id", user_id).orderBy("duration", "asc");
        }
        return data;
    }
    async index(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserPurposes_1.default.query().where("user_id", user_id).orderBy("title", "asc");
        return data;
    }
    async store(ctx) {
        const par = await ctx.request.validate(UserPurposeValidator_1.default);
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserPurposes_1.default.create({ ...par, user_id });
        return data;
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserPurposes_1.default.find(id);
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.all();
        const data = await UserPurposes_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserPurposes_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserPurposeController;
//# sourceMappingURL=UserPurposeController.js.map