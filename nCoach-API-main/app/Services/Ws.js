"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const Server_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Server"));
class Ws {
    constructor() {
        this.booted = false;
    }
    boot() {
        if (this.booted) {
            return;
        }
        this.booted = true;
        this.io = new socket_io_1.Server(Server_1.default.instance, {
            cors: {
                origin: '*'
            }
        });
    }
}
exports.default = new Ws();
//# sourceMappingURL=Ws.js.map