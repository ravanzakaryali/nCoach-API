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
class UserEarnings extends Orm_1.BaseModel {
}
UserEarnings.table = 'user_earnings';
__decorate([
    Orm_1.belongsTo(() => Users_1.default, {
        localKey: 'id',
        foreignKey: 'user_id',
    }),
    __metadata("design:type", Object)
], UserEarnings.prototype, "user", void 0);
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", String)
], UserEarnings.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserEarnings.prototype, "user_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], UserEarnings.prototype, "amount", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserEarnings.prototype, "receipt", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserEarnings.prototype, "virtual_office", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserEarnings.prototype, "description", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserEarnings.prototype, "date_year", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], UserEarnings.prototype, "date_month", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], UserEarnings.prototype, "status", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], UserEarnings.prototype, "is_list", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserEarnings.prototype, "createdAt", void 0);
exports.default = UserEarnings;
//# sourceMappingURL=UserEarnings.js.map