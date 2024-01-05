"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HomeController {
    async index(ctx) {
        return ctx.response
            .status(401)
            .json({ errors: [{ "message": "Geçersiz URL" }] });
    }
}
exports.default = HomeController;
//# sourceMappingURL=HomeController.js.map