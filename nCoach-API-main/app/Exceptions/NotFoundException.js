"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@poppinss/utils");
class NotFoundException extends utils_1.Exception {
    constructor(msg = "Kayıt bulunamadı.", code = 404) {
        super(msg, code);
    }
    async handle(error, { response }) {
        response
            .status(error.status)
            .json({ "message": this.message });
    }
}
exports.default = NotFoundException;
//# sourceMappingURL=NotFoundException.js.map