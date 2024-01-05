"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ws_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Ws"));
Ws_1.default.boot();
let online = 0;
let url = process.env['URL'] || "";
Ws_1.default.io.on('connection', (socket) => {
    let origin = socket.handshake.headers.origin;
    if (origin?.includes("//" + url) || origin?.includes("//www." + url)) {
        online++;
        Ws_1.default.io.emit('onlines', online);
        socket.on('disconnect', function () {
            online--;
            Ws_1.default.io.emit('onlines', online);
        });
    }
    socket.on('getOnline', () => {
        Ws_1.default.io.emit('onlines', online);
    });
    socket.on('socketTrigger', (data) => {
        Ws_1.default.io.emit('socket1', data);
    });
});
//# sourceMappingURL=socket.js.map