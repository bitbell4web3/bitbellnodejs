let log4js = require('log4js');
function init_log4j(){
    log4js.configure({
        appenders: {
          info: {
            type: "file",
            filename: "./logs/info.log"
          },
          param: {
            type: "file",
            filename: "./logs/param.log"
          },
          controller: {
            type: "file",
            filename: "./logs/controller.log"
          },
        },
        categories: {
          default: {
            appenders: ["info"],
            level: "info"
          },
          controller: {
            appenders: ["controller"],
            level: "info"
          },
          param: {
            appenders: ["param"],
            level: "info"
          },
        }
      });
}

module.exports = {
    init_log4j
}

