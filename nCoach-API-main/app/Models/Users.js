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
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
class Users extends Orm_1.BaseModel {
    static async hashPassword(users) {
        if (users.$dirty.password) {
            users.password = await Hash_1.default.make(users.password);
        }
    }
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "phone", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "image", void 0);
__decorate([
    Orm_1.column({ serializeAs: null }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "rememberMeToken", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Users.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Users.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Users.prototype, "firstLogin", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Users.prototype, "lastLogin", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "company", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "company_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "country", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Users.prototype, "country_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "career", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "career_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "parent_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Users.prototype, "status", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Users.prototype, "isadmin", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Users.prototype, "verify", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Users.prototype, "profile_private", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "facebook", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "instagram", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "twitter", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "linkedin", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "pinterest", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "password_decyrpt", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "about", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "total_amount", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Users.prototype, "verify_code", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Users.prototype, "premium", void 0);
__decorate([
    Orm_1.beforeSave(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users]),
    __metadata("design:returntype", Promise)
], Users, "hashPassword", null);
exports.default = Users;
//# sourceMappingURL=Users.js.map