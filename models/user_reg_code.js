module.exports = (sequelize, Sequelize) => {
    // when user register with email, we will send a email with a code to user's email
    const UserRegCode = sequelize.define("user_reg_code", {
      email: {
        //phone
        type: Sequelize.STRING
      },
      code: {
        //name
        type: Sequelize.STRING
      },
      is_del: {
        type: Sequelize.BOOLEAN
      }
    });
    return UserRegCode;
  };
  

