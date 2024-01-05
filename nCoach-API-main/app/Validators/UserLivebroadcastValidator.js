"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserLivebroadcastValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string(),
            date_at: Validator_1.schema.date.optional(),
            onlyteam: Validator_1.schema.boolean.optional(),
            embed: Validator_1.schema.string()
        });
        this.messages = { 'file.size': 'Dosya boyutu 5MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserLivebroadcastValidator;
//# sourceMappingURL=UserLivebroadcastValidator.js.map