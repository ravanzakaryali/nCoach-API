"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserNotificationValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            user_id: Validator_1.schema.string(),
            title: Validator_1.schema.string.optional(),
            description: Validator_1.schema.string.optional(),
            read: Validator_1.schema.boolean.optional(),
            lang: Validator_1.schema.string(),
            type: Validator_1.schema.string.optional(),
            private: Validator_1.schema.boolean.optional(),
            team_id: Validator_1.schema.string.optional(),
            livebroadcast_id: Validator_1.schema.string.optional()
        });
        this.messages = { 'file.size': 'Dosya boyutu 5MB fazla olamaz.', 'file.extname': 'Uyumsuz dosya türü.' };
    }
}
exports.default = UserNotificationValidator;
//# sourceMappingURL=UserNotificationValidator.js.map