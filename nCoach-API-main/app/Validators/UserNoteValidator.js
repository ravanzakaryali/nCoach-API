"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserNoteValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string(),
            note: Validator_1.schema.string.optional()
        });
        this.messages = { 'file.size': 'Dosya boyutu 5MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserNoteValidator;
//# sourceMappingURL=UserNoteValidator.js.map