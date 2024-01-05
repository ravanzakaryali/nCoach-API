"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Settings"));
class SettingController {
    async index() {
        const data = await Settings_1.default.first();
        return data;
    }
    async update(ctx) {
        const par = ctx.request.all();
        const data = await Settings_1.default.query().update(par);
        return data;
    }
}
exports.default = SettingController;
//# sourceMappingURL=SettingController.js.map