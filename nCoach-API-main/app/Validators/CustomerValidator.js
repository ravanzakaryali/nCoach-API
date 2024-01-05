"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CustomerValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            text: Validator_1.schema.string({ trim: true }),
            customer_id: Validator_1.schema.string(),
        });
        this.cacheKey = this.ctx.routeKey;
        this.messages = { 'required': 'Lütfen boş alan bırakmayın.' };
    }
}
exports.default = CustomerValidator;
//# sourceMappingURL=CustomerValidator.js.map