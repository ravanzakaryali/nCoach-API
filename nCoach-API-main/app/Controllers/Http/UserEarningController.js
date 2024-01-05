"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const UserEarningValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/UserEarningValidator"));
const UserEarnings_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserEarnings"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Users_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Users"));
const UserTeams_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserTeams"));
const luxon_1 = require("luxon");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class UserEarningController {
    async filter(ctx) {
        let user_id = ctx.auth.user?.id;
        let country_id = ctx.auth.user?.country_id;
        let company_id = ctx.auth.user?.company_id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        let { filter_type, list_type } = ctx.request.all();
        let data = [];
        if (list_type == "most") {
            let date = luxon_1.DateTime.local();
            date = date.plus({ month: -1 });
            let lastyear = date.year.toString();
            let month = date.month < 10 ? "0" + date.month : date.month.toString();
            if (filter_type == "global") {
                data = await Database_1.default.rawQuery(`SELECT u.id,u.name,u.company,u.email,u.image,ue.amount,u.total_amount,u.created_at,u.career,ue.status as verify FROM user_earnings as ue
        left join users as u on u.id=ue.user_id
         where ue.date_month='${month}' 
         and ue.date_year='${lastyear}'
         and ue.status=true
         order by ue.amount desc`).then(result => result.rows);
            }
            if (filter_type == "incountry") {
                data = await Database_1.default.rawQuery(`SELECT u.id,u.name,u.company,u.email,u.image,ue.amount,u.total_amount,u.created_at,u.career,ue.status as verify FROM user_earnings as ue
        left join users as u on u.id=ue.user_id
         where ue.date_month='${month}' 
         and ue.date_year='${lastyear}'
         and ue.status=true
         and u.country_id='${country_id || 0}'
         order by amount desc`).then(result => result.rows);
            }
            if (filter_type == "inteam") {
                let team = await UserTeams_1.default.query().where("sub_id", user_id).orWhere("user_id", user_id).where("status", true);
                if (team) {
                    let userlist = await Promise.all(team.map(async (e) => {
                        return "'" + e.sub_id.toString() + "'";
                    }));
                    userlist.push("'" + user_id.toString() + "'");
                    data = await Database_1.default.rawQuery(`SELECT u.id,u.name,u.company,u.email,u.image,ue.amount,u.total_amount,u.created_at,u.career,ue.status as verify FROM user_earnings as ue
          left join users as u on u.id=ue.user_id
          where ue.date_month='${month}' 
          and ue.date_year='${lastyear}'
          and ue.status=true
          and u.id in (${userlist})
          order by amount desc`).then(result => result.rows);
                }
            }
            if (filter_type == "incompany") {
                data = await Database_1.default.rawQuery(`SELECT u.id,u.name,u.company,u.email,u.image,ue.amount,u.total_amount,u.created_at,u.career,ue.status as verify FROM user_earnings as ue
        left join users as u on u.id=ue.user_id
        where ue.date_month='${month}' 
        and ue.date_year='${lastyear}'
        and ue.status=true
        and u.company_id='${company_id || ""}'
        order by amount desc`).then(result => result.rows);
            }
        }
        if (list_type == "percentile") {
            let date = luxon_1.DateTime.local();
            let month = date.month < 10 ? "0" + date.month : date.month.toString();
            let year = date.year.toString();
            let date2 = date.plus({ month: -1 });
            let lastmonth = date2.month < 10 ? "0" + date2.month : date2.month.toString();
            let lastyear = date2.year.toString();
            if (filter_type == "global") {
                let earnings = await UserTeams_1.default.query()
                    .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + month + "' and TO_CHAR(created_at::date, 'yyyy') = '" + year + "')")
                    .where("status", true)
                    .groupBy("user_id")
                    .select("user_id")
                    .count("id");
                if (earnings) {
                    let useridlist = await Promise.all(earnings.map(async (e) => { return e.user_id; }));
                    let lastearnings = await UserTeams_1.default.query()
                        .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + lastmonth + "' and TO_CHAR(created_at::date, 'yyyy') = '" + lastyear + "')")
                        .where("status", true)
                        .whereIn("user_id", useridlist)
                        .groupBy("user_id")
                        .select("user_id")
                        .count("id");
                    let filterlist = await Promise.all(earnings.map(async (e) => {
                        let lastcount = await Promise.all(lastearnings.map(async (l) => {
                            if (l.$attributes.user_id == e.$attributes.user_id)
                                return l.$extras.count;
                        }));
                        lastcount = lastcount.filter(function (e) { return e != null; })[0];
                        let count = e.$extras.count;
                        if (count > lastcount) {
                            let detailid = e.$attributes.user_id;
                            let user = await Users_1.default.query().where("id", detailid).select("id", "name", "total_amount").first();
                            return { ...user?.$attributes, percent: ((Math.round((count / lastcount) * 100) - 100)) };
                        }
                    }));
                    filterlist = filterlist.filter(function (e) { return e != null; });
                    return filterlist;
                }
                return earnings;
            }
            if (filter_type == "incountry") {
                let userlist = await Users_1.default.query().where("status", true).where("country_id", country_id || 0);
                userlist = await Promise.all(userlist.map(async (e) => { return e.id; }));
                let earnings = await UserTeams_1.default.query()
                    .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + month + "' and TO_CHAR(created_at::date, 'yyyy') = '" + year + "')")
                    .where("status", true)
                    .whereIn("user_id", userlist)
                    .groupBy("user_id")
                    .select("user_id")
                    .count("id");
                if (earnings) {
                    let useridlist = await Promise.all(earnings.map(async (e) => { return e.user_id; }));
                    let lastearnings = await UserTeams_1.default.query()
                        .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + lastmonth + "' and TO_CHAR(created_at::date, 'yyyy') = '" + lastyear + "')")
                        .where("status", true)
                        .whereIn("user_id", useridlist)
                        .groupBy("user_id")
                        .select("user_id")
                        .count("id");
                    let filterlist = await Promise.all(earnings.map(async (e) => {
                        let lastcount = await Promise.all(lastearnings.map(async (l) => {
                            if (l.$attributes.user_id == e.$attributes.user_id)
                                return l.$extras.count;
                        }));
                        lastcount = lastcount.filter(function (e) { return e != null; })[0];
                        let count = e.$extras.count;
                        if (count > lastcount) {
                            let detailid = e.$attributes.user_id;
                            let user = await Users_1.default.query().where("id", detailid).select("id", "name", "total_amount").first();
                            return { ...user?.$attributes, percent: ((Math.round((count / lastcount) * 100) - 100)) };
                        }
                    }));
                    filterlist = filterlist.filter(function (e) { return e != null; });
                    return filterlist;
                }
                return earnings;
            }
            if (filter_type == "inteam") {
                let earnings = await UserTeams_1.default.query()
                    .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + month + "' and TO_CHAR(created_at::date, 'yyyy') = '" + year + "')")
                    .where("status", true)
                    .where("user_id", user_id)
                    .groupBy("user_id")
                    .select("user_id")
                    .count("id");
                if (earnings) {
                    let useridlist = await Promise.all(earnings.map(async (e) => { return e.user_id; }));
                    let lastearnings = await UserTeams_1.default.query()
                        .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + lastmonth + "' and TO_CHAR(created_at::date, 'yyyy') = '" + lastyear + "')")
                        .where("status", true)
                        .whereIn("user_id", useridlist)
                        .groupBy("user_id")
                        .select("user_id")
                        .count("id");
                    let filterlist = await Promise.all(earnings.map(async (e) => {
                        let lastcount = await Promise.all(lastearnings.map(async (l) => {
                            if (l.$attributes.user_id == e.$attributes.user_id)
                                return l.$extras.count;
                        }));
                        lastcount = lastcount.filter(function (e) { return e != null; })[0];
                        let count = e.$extras.count;
                        if (count > lastcount) {
                            let detailid = e.$attributes.user_id;
                            let user = await Users_1.default.query().where("id", detailid).select("id", "name", "total_amount").first();
                            return { ...user?.$attributes, percent: ((Math.round((count / lastcount) * 100) - 100)) };
                        }
                    }));
                    filterlist = filterlist.filter(function (e) { return e != null; });
                    return filterlist;
                }
                return earnings;
            }
            if (filter_type == "incompany") {
                let userlist = await Users_1.default.query().where("status", true).where("company_id", company_id || 0);
                userlist = await Promise.all(userlist.map(async (e) => { return e.id; }));
                let earnings = await UserTeams_1.default.query()
                    .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + month + "' and TO_CHAR(created_at::date, 'yyyy') = '" + year + "')")
                    .where("status", true)
                    .whereIn("user_id", userlist)
                    .groupBy("user_id")
                    .select("user_id")
                    .count("id");
                if (earnings) {
                    let useridlist = await Promise.all(earnings.map(async (e) => { return e.user_id; }));
                    let lastearnings = await UserTeams_1.default.query()
                        .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + lastmonth + "' and TO_CHAR(created_at::date, 'yyyy') = '" + lastyear + "')")
                        .where("status", true)
                        .whereIn("user_id", useridlist)
                        .groupBy("user_id")
                        .select("user_id")
                        .count("id");
                    let filterlist = await Promise.all(earnings.map(async (e) => {
                        let lastcount = await Promise.all(lastearnings.map(async (l) => {
                            if (l.$attributes.user_id == e.$attributes.user_id)
                                return l.$extras.count;
                        }));
                        lastcount = lastcount.filter(function (e) { return e != null; })[0];
                        let count = e.$extras.count;
                        if (count > lastcount) {
                            let detailid = e.$attributes.user_id;
                            let user = await Users_1.default.query().where("id", detailid).select("id", "name", "total_amount").first();
                            return { ...user?.$attributes, percent: ((Math.round((count / lastcount) * 100) - 100)) };
                        }
                    }));
                    filterlist = filterlist.filter(function (e) { return e != null; });
                    return filterlist;
                }
                return earnings;
            }
        }
        if (list_type == "numeral") {
            let date = luxon_1.DateTime.local();
            let month = date.month < 10 ? "0" + date.month : date.month.toString();
            let year = date.year.toString();
            let date2 = date.plus({ month: -1 });
            let lastmonth = date2.month < 10 ? "0" + date2.month : date2.month.toString();
            let lastyear = date2.year.toString();
            if (filter_type == "global") {
                let earnings = await UserTeams_1.default.query()
                    .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + month + "' and TO_CHAR(created_at::date, 'yyyy') = '" + year + "')")
                    .where("status", true)
                    .groupBy("user_id")
                    .select("user_id")
                    .count("id");
                if (earnings) {
                    let useridlist = await Promise.all(earnings.map(async (e) => { return e.user_id; }));
                    let lastearnings = await UserTeams_1.default.query()
                        .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + lastmonth + "' and TO_CHAR(created_at::date, 'yyyy') = '" + lastyear + "')")
                        .where("status", true)
                        .whereIn("user_id", useridlist)
                        .groupBy("user_id")
                        .select("user_id")
                        .count("id");
                    let filterlist = await Promise.all(earnings.map(async (e) => {
                        let lastcount = await Promise.all(lastearnings.map(async (l) => {
                            if (l.$attributes.user_id == e.$attributes.user_id)
                                return l.$extras.count;
                        }));
                        lastcount = lastcount.filter(function (e) { return e != null; });
                        let count = e.$extras.count;
                        if (count > lastcount) {
                            let detailid = e.$attributes.user_id;
                            let user = await Users_1.default.query().where("id", detailid).select("id", "name", "total_amount").first();
                            return { ...user?.$attributes, count: (count - lastcount) };
                        }
                    }));
                    filterlist = filterlist.filter(function (e) { return e != null; });
                    return filterlist;
                }
                return earnings;
            }
            if (filter_type == "incountry") {
                let userlist = await Users_1.default.query().where("status", true).where("country_id", country_id || 0);
                userlist = await Promise.all(userlist.map(async (e) => { return e.id; }));
                let earnings = await UserTeams_1.default.query()
                    .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + month + "' and TO_CHAR(created_at::date, 'yyyy') = '" + year + "')")
                    .where("status", true)
                    .whereIn("user_id", userlist)
                    .groupBy("user_id")
                    .select("user_id")
                    .count("id");
                if (earnings) {
                    let useridlist = await Promise.all(earnings.map(async (e) => { return e.user_id; }));
                    let lastearnings = await UserTeams_1.default.query()
                        .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + lastmonth + "' and TO_CHAR(created_at::date, 'yyyy') = '" + lastyear + "')")
                        .where("status", true)
                        .whereIn("user_id", useridlist)
                        .groupBy("user_id")
                        .select("user_id")
                        .count("id");
                    let filterlist = await Promise.all(earnings.map(async (e) => {
                        let lastcount = await Promise.all(lastearnings.map(async (l) => {
                            if (l.$attributes.user_id == e.$attributes.user_id)
                                return l.$extras.count;
                        }));
                        lastcount = lastcount.filter(function (e) { return e != null; });
                        let count = e.$extras.count;
                        if (count > lastcount) {
                            let detailid = e.$attributes.user_id;
                            let user = await Users_1.default.query().where("id", detailid).select("id", "name", "total_amount").first();
                            return { ...user?.$attributes, count: (count - lastcount) };
                        }
                    }));
                    filterlist = filterlist.filter(function (e) { return e != null; });
                    return filterlist;
                }
                return earnings;
            }
            if (filter_type == "inteam") {
                let earnings = await UserTeams_1.default.query()
                    .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + month + "' and TO_CHAR(created_at::date, 'yyyy') = '" + year + "')")
                    .where("status", true)
                    .where("user_id", user_id)
                    .groupBy("user_id")
                    .select("user_id")
                    .count("id");
                if (earnings) {
                    let useridlist = await Promise.all(earnings.map(async (e) => { return e.user_id; }));
                    let lastearnings = await UserTeams_1.default.query()
                        .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + lastmonth + "' and TO_CHAR(created_at::date, 'yyyy') = '" + lastyear + "')")
                        .where("status", true)
                        .whereIn("user_id", useridlist)
                        .groupBy("user_id")
                        .select("user_id")
                        .count("id");
                    let filterlist = await Promise.all(earnings.map(async (e) => {
                        let lastcount = await Promise.all(lastearnings.map(async (l) => {
                            if (l.$attributes.user_id == e.$attributes.user_id)
                                return l.$extras.count;
                        }));
                        lastcount = lastcount.filter(function (e) { return e != null; });
                        let count = e.$extras.count;
                        if (count > lastcount) {
                            let detailid = e.$attributes.user_id;
                            let user = await Users_1.default.query().where("id", detailid).select("id", "name", "total_amount").first();
                            return { ...user?.$attributes, count: (count - lastcount) };
                        }
                    }));
                    filterlist = filterlist.filter(function (e) { return e != null; });
                    return filterlist;
                }
                return earnings;
            }
            if (filter_type == "incompany") {
                let userlist = await Users_1.default.query().where("status", true).where("company_id", company_id || 0);
                userlist = await Promise.all(userlist.map(async (e) => { return e.id; }));
                let earnings = await UserTeams_1.default.query()
                    .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + month + "' and TO_CHAR(created_at::date, 'yyyy') = '" + year + "')")
                    .where("status", true)
                    .whereIn("user_id", userlist)
                    .groupBy("user_id")
                    .select("user_id")
                    .count("id");
                if (earnings) {
                    let useridlist = await Promise.all(earnings.map(async (e) => { return e.user_id; }));
                    let lastearnings = await UserTeams_1.default.query()
                        .whereRaw("(TO_CHAR(created_at::date, 'mm') = '" + lastmonth + "' and TO_CHAR(created_at::date, 'yyyy') = '" + lastyear + "')")
                        .where("status", true)
                        .whereIn("user_id", useridlist)
                        .groupBy("user_id")
                        .select("user_id")
                        .count("id");
                    let filterlist = await Promise.all(earnings.map(async (e) => {
                        let lastcount = await Promise.all(lastearnings.map(async (l) => {
                            if (l.$attributes.user_id == e.$attributes.user_id)
                                return l.$extras.count;
                        }));
                        lastcount = lastcount.filter(function (e) { return e != null; });
                        let count = e.$extras.count;
                        if (count > lastcount) {
                            let detailid = e.$attributes.user_id;
                            let user = await Users_1.default.query().where("id", detailid).select("id", "name", "total_amount").first();
                            return { ...user?.$attributes, count: (count - lastcount) };
                        }
                    }));
                    filterlist = filterlist.filter(function (e) { return e != null; });
                    return filterlist;
                }
                return earnings;
            }
        }
        return data;
    }
    async index(ctx) {
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const data = await this.filter(ctx);
        const receipts = await UserEarnings_1.default.query().where("user_id", user_id)
            .select("id", "user_id", "status", "amount", "date_year", "date_month", "created_at")
            .orderBy("date_year", "desc")
            .orderBy("date_month", "desc")
            .limit(12);
        let date = luxon_1.DateTime.local();
        let year = date.year.toString();
        let month = date.month < 10 ? "0" + date.month.toString() : date.month.toString();
        // console.log(month);
        // console.log(parseInt(month));
        let lastdate = date.plus({month: -1});
        let lastyear = lastdate.year.toString();
        let lastmonth = lastdate.month < 10 ? "0" + lastdate.month.toString() : lastdate.month.toString();
        return { list: data, receipts, month: month, year:parseInt(year), lastyear:parseInt(lastyear), lastmonth:lastmonth };
    }
    async receiptUpload(ctx) {
        const image = await ctx.request.file('receipt', {
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
            await image.move(Application_1.default.tmpPath('../public/receipts'), {
                name: imageName,
                overwrite: true,
            });
            return ctx.response.status(200).json({ image: imageName });
        }
        return ctx.response.status(401).json({ message: "Dekont Yüklenemedi" });
    }
    async store(ctx) {
        const par = await ctx.request.validate(UserEarningValidator_1.default);
        let user_id = ctx.auth.user?.id;
        if (!user_id) {
            throw new NotFoundException_1.default();
        }
        const earning = await UserEarnings_1.default.query().where("user_id", user_id).where("date_year", par.date_year || "").where("date_month", par.date_month || "").first();
        if (earning) {
            return ctx.response.status(401).json({ message: `"${par.date_year}-${par.date_month}" dönemine daha önce kazanç girilmiş.` });
        }
        else {
            // const receipt = await ctx.request.file('receipt', {
            //     size: '10mb',
            //     extnames: ['jpg', 'gif', 'png', 'jpeg'],
            // });
            // let receiptName = null;
            // if (receipt) {
            //     receiptName = new Date().getTime().toString() + "_" + Math.floor(1000 + Math.random() * 900000) + '.' + receipt?.extname;
            //     if (!receipt) {
            //         return ctx.response.status(401).json({ message: "Bir sorun oluştu" });
            //     }
            //     if (!receipt.isValid) {
            //         return ctx.response.status(401).json(receipt.errors);
            //     }
            //     let path = Application_1.default.tmpPath('../public/');
            //     await receipt.move(path, {
            //         name: receiptName,
            //         overwrite: true,
            //     });
            //     let savePath = Application_1.default.tmpPath('../public/receipts/');
            //     const sharp = await require('sharp');
            //     const fs = await require('fs');
            //     await sharp(path + receiptName)
            //         .jpeg({ mozjpeg: true })
            //         .resize({ width: 1000, height: 1000, fit: 'cover' })
            //         .sharpen()
            //         .toFile(savePath + receiptName, (err) => {
            //         if (err == null) {
            //             fs.unlinkSync(path + receiptName);
            //         }
            //         console.log(err);
            //     });
            // }
            const virtual_office = await ctx.request.file('virtual_office', {
                size: '10mb',
                extnames: ['jpg', 'gif', 'png', 'jpeg'],
            });
            let virtualOfficeName = null;
            if (virtual_office) {
                virtualOfficeName = new Date().getTime().toString() + "_" + Math.floor(1000 + Math.random() * 900000) + '.' + virtual_office?.extname;
                if (!virtual_office) {
                    return ctx.response.status(401).json({ message: "Bir sorun oluştu" });
                }
                if (!virtual_office.isValid) {
                    return ctx.response.status(401).json(virtual_office.errors);
                }
                let path = Application_1.default.tmpPath('../public/');
                await virtual_office.move(path, {
                    name: virtualOfficeName,
                    overwrite: true,
                });
                let savePath = Application_1.default.tmpPath('../public/receipts/');
                const sharp = await require('sharp');
                const fs = await require('fs');
                await sharp(path + virtualOfficeName)
                    .jpeg({ mozjpeg: true })
                    .resize({ width: 1000, height: 1000, fit: 'cover' })
                    .sharpen()
                    .toFile(savePath + virtualOfficeName, (err) => {
                    if (err == null) {
                        fs.unlinkSync(path + virtualOfficeName);
                    }
                    console.log(err);
                });
            }
            let amountLimit = par.amount >= 5000;
            // receipt: receiptName,
            const data = await UserEarnings_1.default.create({virtual_office: virtualOfficeName, amount: par.amount, status: amountLimit ? false : true, user_id, date_month: par.date_month, date_year: par.date_year });
            if (!amountLimit) {
                const user = await Users_1.default.find(user_id);
                if (user?.id === user_id) {
                    user?.merge({ total_amount: user?.total_amount + par.amount });
                    await user?.save();
                }
            }
            return ctx.response.status(200).json({ message: "Kazanç Eklendi", data: data });
        }
    }
    async show(ctx) {
        const { id } = ctx.params;
        const data = await UserEarnings_1.default.find(id);
        if (data?.id === id) {
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async update(ctx) {
        const { id } = ctx.params;
        const par = await ctx.request.all();
        const data = await UserEarnings_1.default.find(id);
        if (data?.id === id) {
            data?.merge(par);
            await data?.save();
            return data;
        }
        throw new NotFoundException_1.default();
    }
    async destroy(ctx) {
        const { id } = ctx.params;
        const data = await UserEarnings_1.default.find(id);
        if (data?.id === id) {
            await data?.delete();
            return data;
        }
        throw new NotFoundException_1.default();
    }
}
exports.default = UserEarningController;
//# sourceMappingURL=UserEarningController.js.map