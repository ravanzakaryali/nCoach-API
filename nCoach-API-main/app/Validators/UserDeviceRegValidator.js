"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserDeviceRegValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            token: Validator_1.schema.string(),
            status: Validator_1.schema.boolean.optional(),
            online: Validator_1.schema.boolean.optional(),
            platform: Validator_1.schema.string.optional(),
            uuid: Validator_1.schema.string(),
            version: Validator_1.schema.string.optional()
        });
        this.messages = { 'file.size': 'Dosya boyutu 5MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserDeviceRegValidator;
//# sourceMappingURL=UserDeviceRegValidator.js.map