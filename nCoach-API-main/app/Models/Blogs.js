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
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
class Blogs extends Orm_1.BaseModel {
}
Blogs.table = 'blogs';
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", String)
], Blogs.prototype, "id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Blogs.prototype, "category_id", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Blogs.prototype, "title", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Blogs.prototype, "title_en", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Blogs.prototype, "text", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Blogs.prototype, "text_en", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Blogs.prototype, "image", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Blogs.prototype, "url", void 0);
exports.default = Blogs;
//# sourceMappingURL=Blogs.js.map