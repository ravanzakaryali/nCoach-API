"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserVisions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserVisions"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
class UserVisionController {
    async index(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserVisions_1.default.query().where("user_id", user_id).orderBy("created_at", "desc");
        return data;
    }
    async store(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const image = await ctx.request.file('image', {
            size: '10mb',
            extnames: ['jpg', 'gif', 'png', 'jpeg'],
        });
        let imageName = null;
        if (image) {
            imageName = new Date().getTime().toString() + "_" + Math.floor(1000 + Math.random() * 900000) + '.' + image?.extname;
            if (!image) {
                return ctx.response.status(401).json({ message: "Bir sorun oluştu" });
            }
            if (!image.isValid) {
                return ctx.response.status(401).json(image.errors);
            }
            let path = Application_1.default.tmpPath('../public/');
            await image.move(path, {
                name: imageName,
                overwrite: true,
            });
            let savePath = Application_1.default.tmpPath('../public/visions/');
            let thumbPath = Application_1.default.tmpPath('../public/visions/thumbs/');
            const sharp = await require('sharp');
            const fs = await require('fs');
            await sharp(path + imageName)
                .jpeg({ mozjpeg: true })
                .resize({ width: 1000, height: 1000, fit: 'cover' })
                .sharpen()
                .toFile(savePath + imageName, (err) => {
                if (err == null) {
                }
                console.log(err);
            });
            await sharp(path + imageName)
                .jpeg({ mozjpeg: true })
                .resize({ width: 400 })
                .sharpen()
                .toFile(thumbPath + imageName, (err) => {
                if (err == null) {
                    fs.unlinkSync(path + imageName);
                }
                console.log(err);
            });
            await UserVisions_1.default.create({ image: imageName, user_id: user_id });
            return ctx.response.status(200).json({ image: imageName });
        }
        return ctx.response.status(401).json({ message: "Resim Yüklenmedi" });
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserVisions_1.default.find(id);
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.all();
        const data = await UserVisions_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserVisions_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserVisionController;
//# sourceMappingURL=UserVisionController.js.map