"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserNotificationValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserNotificationValidator"));
const UserDeviceRegValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserDeviceRegValidator"));
const UserNotifications_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserNotifications"));
const UserDeviceRegs_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserDeviceRegs"));
const FCM_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/FCM"));
const UserTeams_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserTeams"));
class UserNotificationController {
    async index(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserNotifications_1.default.query().select("id", "title", "read", "created_at", "sender_id", "type").preload("sender").where("user_id", user_id).orderBy("created_at", "desc");
        return data;
    }
    async store(ctx) {
        const par = await ctx.request.validate(UserNotificationValidator_1.default);
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserNotifications_1.default.create({ ...par, user_id });
        return data;
    }
    async addDevice(ctx) {
        const par = await ctx.request.validate(UserDeviceRegValidator_1.default);
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        await UserDeviceRegs_1.default.query().where("token", par.token).delete();
        const data = await UserDeviceRegs_1.default.create({ ...par, user_id });
        // console.log(data, "add");
        return data;
    }
    async updateDevice(ctx) {
        const par = await ctx.request.validate(UserDeviceRegValidator_1.default);
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserDeviceRegs_1.default.query().where("token", par.token).first();
        if (data) {
            data?.merge(par);
            await data?.save();
        }
        // console.log(data, "update");
        return data;
    }
    async deleteDeviceByToken(ctx) {
        const { token } = await ctx.request.all();
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserDeviceRegs_1.default.query().where("token", token).delete();
        return data;
    }
    async deleteDeviceByUser(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await UserDeviceRegs_1.default.query().where("user_id", user_id).delete();
        return data;
    }
    async send(ctx) {
        const par = await ctx.request.validate(UserNotificationValidator_1.default);
        let sender_id = ctx.auth.user?.id;
        if (!sender_id) {
            throw new NotFoundException_1.default();
        }
        let senderUser = ctx.auth.user;
        let title;
        let description;
        let devices = [];
        let lang = par.lang;
        let data;
        let payload;
        if (par.type == "userPush") {
            title = `${par.title}`;
            description = par.description;
            const userdeviceregs = await UserDeviceRegs_1.default.query().where("user_id", par.user_id).andWhere("status", true);
            devices = userdeviceregs.map(device => device.token);
            let usernotification = await UserNotifications_1.default.create({ ...par, title, description, sender_id });
            payload = {
                notification_id: usernotification.id,
                type: par.type
            };
            data = await FCM_1.default.send({ notification: { title, body: description }, data: payload }, { registrationTokens: devices });
        }
        if (par.type == "newLiveBroadcast") {
            if (lang == "tr") {
                title = `Canlı Yayın : ${senderUser?.name}`;
                description = `Canlı yayın oluşturuldu. İzlemek için tıklayın`;
            }
            else {
                title = `Live Broadcast : ${senderUser?.name}`;
                description = `Live broadcast created. Click to watch`;
            }
            const userteams = await UserTeams_1.default.query().where("user_id", sender_id).andWhere("status", true);
            let userteamslist = userteams.map(user => user.sub_id);
            userteamslist.forEach(async (sub_id) => {
                const userdeviceregs = await UserDeviceRegs_1.default.query().where("user_id", sub_id).andWhere("status", true);
                devices = userdeviceregs.map(device => device.token);
                let tokens = { registrationTokens: devices };
                let usernotification = await UserNotifications_1.default.create({ ...par, user_id: sub_id, title: title, description: description, sender_id: sender_id });
                payload = {
                    notification_id: usernotification.id,
                    livebroadcast_id: par.description,
                    type: par.type
                };
                data = await FCM_1.default.send({ notification: { title, body: description }, data: payload }, tokens);
                devices = [];
            });
            if (par.private) {
            }
            else {
            }
        }
        if (par.type == "addUserToTeam") {
            if (lang == "tr") {
                title = "Takım Daveti";
                description = `${senderUser?.name}, sizi takımına eklemek istiyor. Onaylıyor musunuz?`;
            }
            else {
                title = "Team Invitation";
                description = `${senderUser?.name}, added you to your team`;
            }
            const userdeviceregs = await UserDeviceRegs_1.default.query().where("user_id", par.user_id).andWhere("status", true);
            devices = userdeviceregs.map(device => device.token);
            // console.log(devices, 1);
            let usernotification = await UserNotifications_1.default.create({ ...par, title, description, sender_id });
            payload = {
                notification_id: usernotification.id,
                type: par.type
            };
            // console.log(payload, 2);
            data = await FCM_1.default.send({ notification: { title, body: description }, data: payload }, { registrationTokens: devices });
            // console.log(data);
        }
        if (par.type == "teamPush") {
            title = `${senderUser?.name} : ${par.title}`;
            description = par.description;
            const userteams = await UserTeams_1.default.query().where("user_id", sender_id).andWhere("status", true);
            let userteamslist = userteams.map(user => user.sub_id);
            userteamslist.forEach(async (sub_id) => {
                const userdeviceregs = await UserDeviceRegs_1.default.query().where("user_id", sub_id).andWhere("status", true);
                devices = userdeviceregs.map(device => device.token);
                let usernotification = await UserNotifications_1.default.create({ ...par, user_id: sub_id, title: title, description: description, sender_id: sender_id });
                payload = {
                    notification_id: usernotification.id,
                    type: par.type
                };
                data = await FCM_1.default.send({ notification: { title, body: description }, data: payload }, { registrationTokens: devices });
            });
            return userteamslist;
        }
        return data;
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserNotifications_1.default.query().where("id", id).preload('sender').preload("broadcast").preload("team").first();
        if (data?.id === id) {
            data?.merge({ read: true });
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.validate(UserNotificationValidator_1.default);
        const data = await UserNotifications_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserNotifications_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserNotificationController;
//# sourceMappingURL=UserNotificationController.js.map