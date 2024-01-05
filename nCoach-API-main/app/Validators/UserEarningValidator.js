"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserEarningValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            amount: Validator_1.schema.number(),
            date_year: Validator_1.schema.string.optional(),
            date_month: Validator_1.schema.string.optional(),
        });
        this.messages = { 'file.size': 'Dosya boyutu 10MB fazla olamaz.', 'size': 'Dosya boyutu 10MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserEarningValidator;
//# sourceMappingURL=UserEarningValidator.js.map