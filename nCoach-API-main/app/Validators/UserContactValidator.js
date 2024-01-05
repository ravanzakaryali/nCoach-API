"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserContactValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            name: Validator_1.schema.string(),
            email: Validator_1.schema.string.optional(),
            phone: Validator_1.schema.string(),
            rating: Validator_1.schema.number.optional(),
            color: Validator_1.schema.number.optional(),
            description: Validator_1.schema.string.optional(),
        });
        this.messages = { 'file.size': 'Dosya boyutu 5MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserContactValidator;
//# sourceMappingURL=UserContactValidator.js.map