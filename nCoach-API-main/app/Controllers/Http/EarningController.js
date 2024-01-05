"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserEarnings_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserEarnings"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class EarningController {
    async index() {
        const data = await UserEarnings_1.default.query().preload("user").orderBy("created_at", "desc");
        return data;
    }
    async store(ctx) {
        let par = ctx.request.all();
        const data = await UserEarnings_1.default.create(par);
        return data;
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserEarnings_1.default.query().preload("user").where("id", id).first();
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.all();
        const data = await UserEarnings_1.default.find(id);
        console.log(par)
        // return
        if (data?.id === id) {
            data?.merge({status: true});
            await data?.save();
            
            await Database_1.default.rawQuery(`UPDATE users SET total_amount=(total_amount+${par.amount}) where id='${data.user_id}'`);
            
            console.log(`UPDATE users SET total_amount=(total_amount+${par.amount}) where id='${data.user_id}'`);
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserEarnings_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = EarningController;
//# sourceMappingURL=EarningController.js.map