module.exports = (sequelize, Sequelize) => {
    const SpotSymbolPrice = sequelize.define("spot_symbol_price", {
      user_id: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.STRING
      },
      rise_in_price_threshold: {
        type: Sequelize.STRING
      },
      fall_in_price_threshold: {
        type: Sequelize.STRING
      },
      status: {
        //1为正常,2为冻结
        type: Sequelize.STRING
      },
      is_del: {
        type: Sequelize.BOOLEAN
      }
    });
    return SpotSymbolPrice;
  };
  

