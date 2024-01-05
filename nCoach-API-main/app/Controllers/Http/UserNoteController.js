"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserNoteValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserNoteValidator"));
const UserNotes_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserNotes"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class UserNoteController {
    async search(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const { text } = ctx.request.all();
        const data = await Database_1.default.rawQuery("SELECT * FROM user_notes where " +
            "(lower(title) like LOWER('%" + text + "%') or " +
            "lower(note) like LOWER('%" + text + "%')) and user_id='" + user_id + "' order by title asc").then(result => result.rows);
        return data;
    }
    async index(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserNotes_1.default.query().where("user_id", user_id).orderBy("created_at", "desc");
        return data;
    }
    async store(ctx) {
        const par = await ctx.request.validate(UserNoteValidator_1.default);
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserNotes_1.default.create({ ...par, user_id });
        return data;
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserNotes_1.default.find(id);
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.validate(UserNoteValidator_1.default);
        const data = await UserNotes_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserNotes_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserNoteController;
//# sourceMappingURL=UserNoteController.js.map