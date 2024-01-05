"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserContactValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserContactValidator"));
const UserContacts_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserContacts"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class UserContactController {
    async filter(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const { type } = ctx.request.all();
        let data = [];
        if (type == "date") {
            data = await UserContacts_1.default.query().where("user_id", user_id).orderBy("created_at", "asc");
        }
        if (type == "rating") {
            data = await UserContacts_1.default.query().where("user_id", user_id).orderBy("rating", "desc");
        }
        if (type == "color") {
            data = await UserContacts_1.default.query().where("user_id", user_id).orderBy("color", "desc").orderBy("rating", "desc");
        }
        return data;
    }
    async search(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const { text } = ctx.request.all();
        const data = await Database_1.default.rawQuery("SELECT * FROM user_contacts where " +
            "(lower(name) like LOWER('%" + text + "%') or " +
            "lower(email) like LOWER('%" + text + "%') or " +
            "lower(description) like LOWER('%" + text + "%') or " +
            "lower(phone) like LOWER('%" + text + "%')) and user_id='" + user_id + "' order by name asc").then(result => result.rows);
        return data;
    }
    async index(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserContacts_1.default.query().where("user_id", user_id).orderBy("name", "asc");
        return data;
    }
    async store(ctx) {
        const par = await ctx.request.validate(UserContactValidator_1.default);
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const userContact = await UserContacts_1.default.query().select("id").where("phone", par.phone.trim()).andWhere("user_id", user_id).first();
        if (userContact) {
            return ctx.response.status(401).json({ message: "Telefon numarasını daha önce eklediniz" });
        }
        else {
            await UserContacts_1.default.create({ ...par, user_id });
            return await UserContacts_1.default.query().where("user_id", user_id).orderBy("name", "asc");
        }
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserContacts_1.default.find(id);
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.validate(UserContactValidator_1.default);
        const data = await UserContacts_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserContacts_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserContactController;
//# sourceMappingURL=UserContactController.js.map