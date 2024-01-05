"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserVisionValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string.optional(),
            image: Validator_1.schema.string()
        });
        this.messages = { 'file.size': 'Dosya boyutu 10MB fazla olamaz.', 'size': 'Dosya boyutu 10MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserVisionValidator;
//# sourceMappingURL=UserVisionValidator.js.map