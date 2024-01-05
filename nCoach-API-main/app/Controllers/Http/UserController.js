"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserValidator"));
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const UserContacts_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserContacts"));
const UserPurposes_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserPurposes"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const UserNotifications_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserNotifications"));
const UserTeams_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserTeams"));
const Countries_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Countries"));
const Companies_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Companies"));
const Careers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Careers"));
const UserVisions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserVisions"));
const UserNotes_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserNotes"));
const UserLivebroadcasts_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserLivebroadcasts"));
const UserEarnings_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserEarnings"));
const UserDeviceRegs_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserDeviceRegs"));
class UserController {
    async home(ctx) {
        let user_id = ctx.auth.user?.id;
        let company_id = ctx.auth.user?.company_id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const notifications = await UserNotifications_1.default.query().select("id", "title", "read", "created_at", "sender_id", "type").preload("sender").where("user_id", user_id).where("read", false).orderBy("created_at", "desc").limit(5);
        let livebroadcasts;
        if (company_id) {
            livebroadcasts = await Database_1.default.rawQuery("select * from user_livebroadcasts where ((company_id='" + company_id + "' and onlyteam=true) or (company_id='" + company_id + "' and onlyteam=false)) and status=true   order by created_at desc limit 5 ").then(result => result.rows);
        }
        return { notifications, livebroadcasts };
    }
    async search(ctx) {
        let user_id = ctx.auth.user?.id;
        let company_id = ctx.auth.user?.company_id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const { text } = ctx.request.all();
        const data = await Database_1.default.rawQuery("SELECT * FROM users where " +
            "(lower(name) like LOWER('%" + text + "%') or " +
            "lower(email) like LOWER('%" + text + "%') or " +
            "lower(phone) like LOWER('%" + text + "%')) and company_id='" + company_id + "' and id<>'" + user_id + "' order by name asc").then(result => result.rows);
        return data;
    }
    async userGetCount(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const contacts = await UserContacts_1.default.query().where("user_id", user_id).count("").first();
        const purposes = await UserPurposes_1.default.query().where("user_id", user_id).count("").first();
        return { contacts: contacts?.$extras.count, purposes: purposes?.$extras.count };
    }
    async getsetting(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const user = await Users_1.default.find(user_id);
        const countries = await Countries_1.default.query().select("name", "id").orderBy("name", "asc");
        const companies = await Companies_1.default.query().select("name", "id").where("status", true);
        const careers = await Careers_1.default.query().select("name", "id").where("status", true).orderBy("name", "asc");
        if (user) {
            return ctx.response
                .status(200)
                .json({ message: "Başarılı", user: user, countries: countries, companies: companies, careers: careers });
        }
        else {
            return ctx.response
                .status(401)
                .json({ message: "Profil Bulunamadı." });
        }
    }
    async setsetting(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const par = await ctx.request.all();
        if(par.companychange){
            await UserTeams_1.default.query().where("user_id", user_id).delete();
            await UserTeams_1.default.query().where("sub_id", user_id).delete();
        }
        const data = await Users_1.default.find(user_id);
        if (data) {
            let obj = {};
            obj.company_id = par.company_id;
            if(par.career_id!=""){
                obj.career_id = par.career_id;
            }else{
                obj.career_id = null;
                obj.career = "";
            }
            obj.country_id = par.country_id;
            if(par.career){
                obj.career = par.career;
            }
            if(par.company){
                obj.company = par.company;
            }
            data?.merge(par,obj);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async index() {
        const data = await Users_1.default.query().orderBy("created_at", "desc")
        return data;
    }
    async store(ctx) {
        const par = await ctx.request.validate(UserValidator_1.default);
        const data = await Users_1.default.create(par);
        return data;
    }
    async show(ctx) {
        const { id } = ctx.params;
        let user_id = ctx.auth.user?.id;
        let company_id = ctx.auth.user?.company_id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await Users_1.default.find(id);
        if (data?.id === id) {
            let inteam = false;
            let onteam = false;
            let team = false;
            let requestteam = false;
            if (data?.company_id == company_id) {
                const userTeam = await UserTeams_1.default.query().select("id", "status", "user_id").where("sub_id", id).first();
                if (userTeam) {
                    if (userTeam.status) {
                        team = true;
                        if (userTeam.user_id == user_id) {
                            inteam = true;
                        }
                    }
                    else {
                        if (userTeam.user_id == user_id) {
                            requestteam = true;
                        }
                    }
                }
                const userTeam2 = await UserTeams_1.default.query().select("id", "status", "user_id", "sub_id").where("user_id", id).first();
                if (userTeam2) {
                    if (userTeam2.status) {
                        team = true;
                        // console.log(userTeam2.sub_id)
                        // console.log(user_id)
                        if (userTeam2.sub_id == user_id) {
                            onteam = true;
                        }
                    }
                }
            }
            
            return { ...data?.$attributes, inteam, onteam, team, requestteam };
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.validate(UserValidator_1.default);
        const data = await Users_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async delete(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await Users_1.default.find(user_id);
        if (data) {
            let randNew = new Date().getTime();
            // data?.merge({status:false, name:data.name+" (Pasif Hesap)"});
            data?.merge({status:false, name:"Pasif Hesap", email:randNew.toString(),phone:randNew,image:""});
            await data?.save();
            // await data?.delete();
            // await UserTeams_1.default.query().where("user_id", user_id).delete();
            // await UserTeams_1.default.query().where("sub_id", user_id).delete();
            await UserVisions_1.default.query().where("user_id", user_id).delete();
            await UserPurposes_1.default.query().where("user_id", user_id).delete();
            await UserNotifications_1.default.query().where("user_id", user_id).delete();
            await UserNotes_1.default.query().where("user_id", user_id).delete();
            await UserLivebroadcasts_1.default.query().where("user_id", user_id).delete();
            await UserEarnings_1.default.query().where("user_id", user_id).delete();
            await UserContacts_1.default.query().where("user_id", user_id).delete();
            await UserDeviceRegs_1.default.query().where("user_id", user_id).delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await Users_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map