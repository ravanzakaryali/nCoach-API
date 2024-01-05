"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserLivebroadcastValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserLivebroadcastValidator"));
const UserLivebroadcasts_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserLivebroadcasts"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class UserLivebroadcastController {
    async index(ctx) {
        let user_id = ctx.auth.user?.id;
        let company_id = ctx.auth.user?.company_id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        let livebroadcasts = await Database_1.default.rawQuery("select * from user_livebroadcasts where ((company_id='" + company_id + "' and onlyteam=true) or onlyteam=false) and status=true order by created_at desc").then(result => result.rows);
        return livebroadcasts;
    }
    async store(ctx) {
        const par = await ctx.request.validate(UserLivebroadcastValidator_1.default);
        let user_id = ctx.auth.user?.id;
        let company_id = ctx.auth.user?.company_id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserLivebroadcasts_1.default.create({ ...par, company_id, user_id });
        return data;
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserLivebroadcasts_1.default.find(id);
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.validate(UserLivebroadcastValidator_1.default);
        const data = await UserLivebroadcasts_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserLivebroadcasts_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserLivebroadcastController;
//# sourceMappingURL=UserLivebroadcastController.js.map