"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserTeamValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            sub_id: Validator_1.schema.string(),
            user_order: Validator_1.schema.number.optional(),
            user_group: Validator_1.schema.number.optional(),
            status: Validator_1.schema.boolean.optional(),
        });
        this.messages = { 'file.size': 'Dosya boyutu 10MB fazla olamaz.', 'size': 'Dosya boyutu 10MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserTeamValidator;
//# sourceMappingURL=UserTeamValidator.js.map