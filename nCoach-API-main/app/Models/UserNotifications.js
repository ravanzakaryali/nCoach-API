"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Users_1 = __importDefault(require("./Users"));
const UserTeams_1 = __importDefault(require("./UserTeams"));
const UserLivebroadcasts_1 = __importDefault(require("./UserLivebroadcasts"));
class UserNotifications extends Orm_1.BaseModel {
}
UserNotifications.table = 'user_notifications';
__decorate([
    Orm_1.belongsTo(() => Users_1.default, {
        localKey: 'id',
        foreignKey: 'sender_id',
    }),
    __metadata("design:type", Object)
], UserNotifications.prototype, "sender", void 0);
__decorate([
    Orm_1.belongsTo(() => UserTeams_1.default, {
        localKey: 'id',
        foreignKey: 'team_id'
    }),
    __metadata("design:type", Object)
], UserNotifications.prototype, "team", void 0);
__decorate([
    Orm_1.belongsTo(() => UserLivebroadcasts_1.default, {
        localKey: 'id',
        foreignKey: 'livebroadcast_id'
    }),
    __metadata("design:type", Object)
], UserNotifications.prototype, "broadcast", void 0);
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", String)
], UserNotifications.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserNotifications.prototype, "user_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserNotifications.prototype, "sender_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserNotifications.prototype, "title", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserNotifications.prototype, "description", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], UserNotifications.prototype, "read", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], UserNotifications.prototype, "isremove", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], UserNotifications.prototype, "private", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserNotifications.prototype, "lang", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserNotifications.prototype, "type", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserNotifications.prototype, "team_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserNotifications.prototype, "livebroadcast_id", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserNotifications.prototype, "createdAt", void 0);
exports.default = UserNotifications;
//# sourceMappingURL=UserNotifications.js.map