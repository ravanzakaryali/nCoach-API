"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserTeamValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserTeamValidator"));
const UserTeams_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserTeams"));
const UserNotifications_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserNotifications"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
class UserTeamController {
    async filter(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const { type } = ctx.request.all();
        let data = [];
        if (type == "date") {
            data = await UserTeams_1.default.query().where("user_id", user_id).orderBy("created_at", "asc");
        }
        if (type == "status") {
            data = await UserTeams_1.default.query().where("user_id", user_id).andWhere("status", true);
        }
        if (type == "duration") {
            data = await UserTeams_1.default.query().where("user_id", user_id).orderBy("duration", "asc");
        }
        return data;
    }
    async genealogy(ctx) {
        const par = ctx.params;
        const data = await Database_1.default.rawQuery("SELECT id,email,name,career,phone,image,total_amount FROM users where parent_id='" + par.id + "' order by name asc").then(result => result.rows);
        return data;
    }
    async userteamdetail(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        let par = ctx.request.all();
        const data = await UserTeams_1.default.find(par.team_id);
        if (data) {
            if (par.value == "true") {
                data?.merge({ status: true });
                await data?.save();
            }
            else {
                await data?.delete();
            }
            const not = await UserNotifications_1.default.find(par.notification_id);
            if (not) {
                await not?.delete();
            }
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async index(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserTeams_1.default.query().where("user_id", user_id).preload("user").orderBy("created_at", "desc");
        return data;
    }
    async notparent(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const notparent = await UserTeams_1.default.query().select("sub_id").where("user_id", user_id).where("status", true);
        let notparentlist = await Promise.all(notparent.map(async (e) => {
            return e.sub_id;
        }));
        const data = await Users_1.default.query().whereIn("id", notparentlist).whereNull("parent_id").orderBy("name", "asc");
        return data;
    }
    async setparent(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const par = ctx.request.all();
        const data = await Users_1.default.find(par.user_id);
        if (data) {
            data?.merge({ parent_id: par.parent_id });
            await data?.save();
        }
        return data;
    }
    async store(ctx) {
        const par = await ctx.request.validate(UserTeamValidator_1.default);
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserTeams_1.default.create({ ...par, user_id });
        return data;
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserTeams_1.default.find(id);
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.all();
        const data = await UserTeams_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserTeams_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserTeamController;
//# sourceMappingURL=UserTeamController.js.map