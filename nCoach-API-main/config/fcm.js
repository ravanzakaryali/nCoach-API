"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const fcmConfig = {
    apiKey: Env_1.default.get('FCM_API_KEY'),
    requestOptions: {
        timeout: 5000
    }
};
exports.default = fcmConfig;
//# sourceMappingURL=fcm.js.map