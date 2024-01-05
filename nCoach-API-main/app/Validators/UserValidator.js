"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string(),
            password: Validator_1.schema.string(),
            name: Validator_1.schema.string(),
            phone: Validator_1.schema.string(),
            image: Validator_1.schema.string.optional(),
            firstLogin: Validator_1.schema.date.optional(),
            lastLogin: Validator_1.schema.date.optional(),
            country_id: Validator_1.schema.number.optional(),
            company: Validator_1.schema.string.optional(),
            company_id: Validator_1.schema.string.optional(),
            career: Validator_1.schema.string.optional(),
            career_id: Validator_1.schema.string.optional(),
            parent_id: Validator_1.schema.string.optional(),
            status: Validator_1.schema.boolean.optional(),
            facebook: Validator_1.schema.string.optional(),
            instagram: Validator_1.schema.string.optional(),
            twitter: Validator_1.schema.string.optional(),
            linkedin: Validator_1.schema.string.optional(),
            pinterest: Validator_1.schema.string.optional(),
            password_: Validator_1.schema.string.optional(),
            about: Validator_1.schema.string.optional(),
            verify_code: Validator_1.schema.string.optional(),
            input_code: Validator_1.schema.string.optional(),
            profile_private: Validator_1.schema.boolean.optional(),
            premium: Validator_1.schema.boolean.optional(),
            total_amount: Validator_1.schema.string.optional(),
            isadmin: Validator_1.schema.boolean.optional()
        });
        this.messages = { 'file.size': 'Dosya boyutu 5MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserValidator;
//# sourceMappingURL=UserValidator.js.map