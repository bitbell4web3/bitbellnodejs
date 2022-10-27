const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const config = require('config');
const cors = require('./middleware/cors');
const requestLog = require('./middleware/request_log');
const resHandler = require('./middleware/res_handler');
const  logger  = require('./middleware/logger');


const jwt = require('./middleware/jwt');
const webRouter = require('./web_router');
const Validator = require('./utils/validator');
const user_permission = require('./utils/user_permission')
const validator = new Validator();
const db = require("./models").db;
db.sequelize.sync();

const app = new Koa();
app.context.validator = validator;

logger.init_log4j();

app.context.logger = logger;

const koaBody = require('koa-body');

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 50 * 1024 * 1024 // 设置上传文件大小最大限制，默认50M
  }
}));





// Body parser
app.use(bodyParser({ multipart: true }));
// safe
app.use(helmet());
// Compress
app.use(compress());

// res handler
app.use(resHandler);
// Enable cors
app.use(cors);
// print request log
app.use(requestLog);

app.use(jwt);
// router


const urls = ['/api/v1/user/index','/api/v1/user/create','/api/v1/spot/create',
'/api/v1/user/list','/api/v1/user/binance_api/create']
app.use(async (ctx, next) => {
  console.log("ctx.url:",ctx.url)
   let flag =  await user_permission.admin_permision_filter(ctx,urls);
   console.info("admin_permision_filter flag:",flag)
   if(!flag){
       throw new Error('no admin permission')
   }
    await next()
})

app.use(webRouter.routes()).use(webRouter.allowedMethods());
// get server post,default port:4004;
const port = config.get('port') || 4004;
app.listen(port);
module.exports = app;
