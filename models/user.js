module.exports = (sequelize, Sequelize) => {
    const USER = sequelize.define("user", {
      phone: {
        //phone
        type: Sequelize.STRING
      },
      name: {
        //name
        type: Sequelize.STRING
      },
      status: {
        //1为正常,2为冻结
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role_type: {
        //1为普通用户,2为管理员
        type: Sequelize.STRING
      },
      mail: {
        //1为普通用户,2为管理员
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      is_del: {
        type: Sequelize.BOOLEAN
      }
    });
    return USER;
  };
  

