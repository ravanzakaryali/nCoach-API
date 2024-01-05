"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Careers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Careers"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
class CareerController {
    async index() {
        const data = await Careers_1.default.query().orderBy("name", "asc");
        return data;
    }
    async store(ctx) {
        let par = ctx.request.all();
        const data = await Careers_1.default.create(par);
        return data;
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await Careers_1.default.query().where("id", id).first();
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.all();
        const data = await Careers_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await Careers_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = CareerController;
//# sourceMappingURL=CareerController.js.map