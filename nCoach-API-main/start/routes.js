"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HealthCheck_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HealthCheck"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const _PREFIX = 'api/v1';
Route_1.default.get('/', async () => {
    return '🤙 nCoach Api Run ' + (process.env.V || '0') + ' ⚡️';
});
Route_1.default.get('/default', 'WebController.index');
Route_1.default.get('/dashboard', 'WebController.dashboard');
Route_1.default.get('/mailadd', 'WebController.mailadd');
Route_1.default.post('/login', 'WebController.login');
Route_1.default.post('/register', 'WebController.register');
Route_1.default.post('/question', 'WebController.question');
Route_1.default.get('Admin/usercounter', 'WebController.usercounter');
Route_1.default.group(() => {
    Route_1.default.get('/home', 'HomeController.index');
    Route_1.default.get('/usernotes/search', 'UserNoteController.search');
    Route_1.default.resource('/usernotes', 'UserNoteController');
    Route_1.default.get('/usercontacts/filter', 'UserContactController.filter');
    Route_1.default.get('/usercontacts/search', 'UserContactController.search');
    Route_1.default.resource('/usercontacts', 'UserContactController');
    Route_1.default.get('/userpurposes/filter', 'UserPurposeController.filter');
    Route_1.default.resource('/userpurposes', 'UserPurposeController');
    Route_1.default.resource('/uservisions', 'UserVisionController');
    Route_1.default.get('/userearnings/filter', 'UserEarningController.filter');
    Route_1.default.resource('/userearnings', 'UserEarningController');
    Route_1.default.resource('/companies', 'CompanyController');
    Route_1.default.resource('/careers', 'CareerController');
    Route_1.default.post('/usernotifications/send', 'UserNotificationController.send');
    Route_1.default.post('/usernotifications/addDevice', 'UserNotificationController.addDevice');
    Route_1.default.delete('/usernotifications/deleteDeviceByToken', 'UserNotificationController.deleteDeviceByToken');
    Route_1.default.delete('/usernotifications/deleteDeviceByUser', 'UserNotificationController.deleteDeviceByUser');
    Route_1.default.put('/usernotifications/updateDevice', 'UserNotificationController.updateDevice');
    Route_1.default.resource('/usernotifications', 'UserNotificationController');
    Route_1.default.post('/userteams/userteamdetail', 'UserTeamController.userteamdetail');
    Route_1.default.get('/userteams/notparent', 'UserTeamController.notparent');
    Route_1.default.post('/userteams/setparent', 'UserTeamController.setparent');
    Route_1.default.get('/userteams/genealogy/:id', 'UserTeamController.genealogy');
    Route_1.default.resource('/userteams', 'UserTeamController');
    Route_1.default.resource('/userlivebroadcasts', 'UserLivebroadcastController');
    Route_1.default.get('/products/categorylist', 'ProductController.categorylist');
    Route_1.default.get('/products/categorydetail/:id', 'ProductController.categorydetail');
    Route_1.default.post('/products/categoryinsert', 'ProductController.categoryinsert');
    Route_1.default.put('/products/categoryupdate/:id', 'ProductController.categoryupdate');
    Route_1.default.delete('/products/categorydestroy/:id', 'ProductController.categorydestroy');
    Route_1.default.resource('/products', 'ProductController');
    Route_1.default.resource('/customers', 'CustomerController');
    Route_1.default.resource('/questions', 'QuestionController');
    Route_1.default.get('/userGetCount', 'UserController.userGetCount');
    Route_1.default.get('/userHome', 'UserController.home');
    Route_1.default.get('/users/search', 'UserController.search');
    Route_1.default.post('/users/getsetting', 'UserController.getsetting');
    Route_1.default.post('/users/setsetting', 'UserController.setsetting');
    Route_1.default.post('/users/delete', 'UserController.delete');
    Route_1.default.resource('/users', 'UserController');
    Route_1.default.get('/settings', 'SettingController.index');
    Route_1.default.post('/settings/update', 'SettingController.update');
    Route_1.default.resource('/earnings', 'EarningController');
}).prefix(_PREFIX).middleware(['auth']);
Route_1.default.group(() => {
    Route_1.default.post('/auth/control', 'AuthController.control');
    Route_1.default.post('/auth/sendverifycode', 'AuthController.sendverifycode');
    Route_1.default.post('/auth/verify', 'AuthController.verify');
    Route_1.default.post('/auth/login', 'AuthController.login');
    Route_1.default.post('/auth/admin', 'AuthController.admin');
    Route_1.default.post('/auth/register', 'AuthController.register');
    Route_1.default.post('/auth/registerOne', 'AuthController.registerOne');
    Route_1.default.post('/auth/registerTwo', 'AuthController.registerTwo');
    Route_1.default.post('/auth/reset', 'AuthController.reset');
}).prefix(_PREFIX);
Route_1.default.get('health', async ({ response }) => {
    const report = await HealthCheck_1.default.getReport();
    return report.healthy
        ? response.ok(report)
        : response.badRequest(report);
});
//# sourceMappingURL=routes.js.map