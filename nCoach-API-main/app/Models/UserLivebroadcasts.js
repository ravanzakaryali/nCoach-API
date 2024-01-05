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
class UserLivebroadcasts extends Orm_1.BaseModel {
}
UserLivebroadcasts.table = 'user_livebroadcasts';
__decorate([
    Orm_1.belongsTo(() => Users_1.default, {
        localKey: 'id',
        foreignKey: 'user_id',
    }),
    __metadata("design:type", Object)
], UserLivebroadcasts.prototype, "user", void 0);
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", String)
], UserLivebroadcasts.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserLivebroadcasts.prototype, "user_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserLivebroadcasts.prototype, "title", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserLivebroadcasts.prototype, "embed", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserLivebroadcasts.prototype, "company_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], UserLivebroadcasts.prototype, "onlyteam", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], UserLivebroadcasts.prototype, "date_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserLivebroadcasts.prototype, "createdAt", void 0);
exports.default = UserLivebroadcasts;
//# sourceMappingURL=UserLivebroadcasts.js.map