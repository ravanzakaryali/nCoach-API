"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const luxon_1 = require("luxon");
const UserValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserValidator"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Countries_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Countries"));
const Companies_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Companies"));
const Careers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Careers"));
class AuthController {
    async login(ctx) {
        const email = ctx.request.input('email');
        const password = ctx.request.input('password');
        try {
            const token = await ctx.auth.use('api').attempt(email, password);
            if (ctx.auth.user?.status) {
                let res = { user: ctx.auth.user, access_token: token };
                return res;
            }
            else {
                return ctx.response
                    .status(401)
                    .json({ message: "Hesabınız Aktif Değil" });
            }
        }
        catch (error) {
            return ctx.response
                .status(401)
                .json({ message: "Hatalı Giriş Yaptınız" });
        }
    }
    async admin(ctx) {
        const email = ctx.request.input('email');
        const password = ctx.request.input('password');
        try {
            const token = await ctx.auth.use('api').attempt(email, password);
            if (ctx.auth.user?.isadmin) {
                let res = { user: ctx.auth.user, access_token: token };
                return res;
            }
            else {
                return ctx.response
                    .status(401)
                    .json({ message: "Hesabınız Aktif Değil" });
            }
        }
        catch (error) {
            return ctx.response
                .status(401)
                .json({ message: "Hatalı Giriş Yaptınız" });
        }
    }
    async control(ctx) {
        const par = await ctx.request.validate(UserValidator_1.default);
        const user = await Users_1.default.query().where("email", par.email).orWhere("phone", par.phone).first();
        const countries = await Countries_1.default.query().select("name", "id").orderBy("name", "asc");
        const companies = await Companies_1.default.query().select("name", "id").where("status", true).orderBy("name", "asc");
        const careers = await Careers_1.default.query().select("name", "id").where("status", true).orderBy("name", "asc");
        if (!user) {
            return ctx.response
                .status(200)
                .json({ message: "Kontrol Başarılı", countries: countries, companies: companies, careers: careers });
        }
        else {
            return ctx.response
                .status(401)
                .json({ message: "Email yada Telefon daha önce kayıt edilmiş" });
        }
    }
    async sendverifycode(ctx) {
        const par = await ctx.request.all();
        const user = await Users_1.default.query().where("email", par.email).orWhere("phone", par.phone).first();
        if (user) {
            const time = luxon_1.DateTime.now();
            const data = {
                name: par.name,
                verify_code: par.verify_code,
                tarih: time.day + "-" + time.month + "-" + time.year + " " + time.hour + ":" + time.minute
            };
            user.verify_code = par.verify_code;
            await user.save();
            try {
                Mail_1.default.send((message) => {
                    message
                        .from("no-reply@mailsend.com.tr", "nCoach'dan merhaba! Lütfen email adresini doğrula 2")
                        // .to("shocur@gmail.com")
                        .to(par.email)
                        .header("nCoach", "nCoach'dan merhaba! Lütfen email adresini doğrula")
                        .subject("nCoach Doğrulama ✉️")
                        .htmlView('emails/verify', data);
                });
            }
            catch (error) {
                return ctx.response.status(401).json({ message: error });
            }
        }
        else {
            return ctx.response
                .status(401)
                .json({ message: "Kullanıcı Bulunamadı !" });
        }
    }
    async verify(ctx) {
        const par = await ctx.request.all();
        const user = await Users_1.default.query().where("email", par.email).orWhere("phone", par.phone).first();
        if (user) {
            if (user.verify_code == par.input_code) {
                user.verify = true;
                await user.save();
                return ctx.response
                    .status(200)
                    .json({ message: "Doğrulama Başarılı" });
            }
            else {
                return ctx.response
                    .status(401)
                    .json({ message: "Doğrulama Başarısız !" });
            }
        }
        else {
            return ctx.response
                .status(401)
                .json({ message: "Kullanıcı Bulunamadı !" });
        }
    }
    async registerOne(ctx) {
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
            let savePath = Application_1.default.tmpPath('../public/customers/');
            let thumbPath = Application_1.default.tmpPath('../public/avatars/');
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
                .resize({ width: 200, height: 200, fit: 'cover' })
                .sharpen()
                .toFile(thumbPath + imageName, (err) => {
                if (err == null) {
                    fs.unlinkSync(path + imageName);
                }
                console.log(err);
            });
            return ctx.response.status(200).json({ image: imageName });
        }
        return ctx.response.status(401).json({ message: "Resim Yüklenmedi" });
    }
    async registerTwo(ctx) {
        const par = await ctx.request.validate(UserValidator_1.default);
        const user = await Users_1.default.query().where("email", par.email).orWhere("phone", par.phone).first();
        if (!user) {
            const auth = await Users_1.default.create({ email: par.email, password: par.password });
            if (auth) {
                let company = "";
                let company_id = "";
                if (!par.company_id) {
                    const companyData = await Companies_1.default.create({ name: par.company });
                    company_id = companyData.id;
                    company = companyData.name;
                }
                else {
                    const companyData = await Companies_1.default.query().where("id", par.company_id).first();
                    if (companyData) {
                        company_id = par.company_id;
                        company = companyData?.name || "";
                    }
                }
                let career = "";
                let career_id = null;
                if (!par.career_id) {
                    console.log(par.career,"career");
                    if(par.career){
                        console.log(par.career,"career 2");
                        const careerData = await Careers_1.default.create({ name: par.career });
                        career_id = careerData.id;
                        career = careerData.name;
                    }
                }
                else {
                    const careerData = await Careers_1.default.query().where("id", par.career_id).first();
                    if (careerData) {
                        career_id = par.career_id;
                        career = careerData?.name || "";
                    }
                }
                auth.name = par.name;
                auth.phone = par.phone;
                auth.image = par.image || "";
                auth.country_id = par.country_id || 0;
                auth.company = company;
                auth.company_id = company_id;
                auth.career = career;
                auth.career_id = career_id;
                auth.facebook = par.facebook || "";
                auth.instagram = par.instagram || "";
                auth.twitter = par.twitter || "";
                auth.linkedin = par.linkedin || "";
                auth.pinterest = par.pinterest || "";
                auth.password_decyrpt = par.password;
                auth.about = par.about || "";
                auth.verify_code = par.verify_code || "";
                await auth.save();
            }
            await this.sendverifycode(ctx);
            const token = await ctx.auth.use('api').attempt(par.email, par.password);
            return { user: ctx.auth.user, access_token: token };
        }
        else {
            return ctx.response
                .status(401)
                .json({ message: "Email yada Telefon daha önce kayıt edilmiş" });
        }
    }
    replace(text) {
        var trMap = { 'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O' };
        for (var key in trMap) {
            text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
        }
        return text;
    }
    async reset(ctx) {
        const par = await ctx.request.all();
        const user = await Users_1.default.query().where("email", par.email).first();
        if (user) {
            try {
                const time = luxon_1.DateTime.now();
                let password = Math.floor(1000 + Math.random() * 900000);
                user.pinterest = "şifre değişti";
                user.password_decyrpt = password.toString();
                user.password = password.toString();
                await user.save();
                const data = {
                    name: user.name,
                    password: password,
                    tarih: time.day + "-" + time.month + "-" + time.year + " " + time.hour + ":" + time.minute
                };
                Mail_1.default.send((message) => {
                    message
                        .from("no-reply@mailsend.com.tr", "nCoach'dan merhaba! Yeni Şifreniz")
                        // .to("shocur@gmail.com")
                        .to(par.email)
                        .header("nCoach", "nCoach'dan merhaba! Yeni Şifreniz")
                        .subject("nCoach Yeni Şifre 🔑")
                        .htmlView('emails/reset', data);
                });
                return ctx.response.status(200).json({ message: "Başarılı" });
            }
            catch (error) {
                return ctx.response.status(401).json({ message: error });
            }
        }
        else {
            return ctx.response
                .status(401)
                .json({ message: "Kullanıcı Bulunamadı !" });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map