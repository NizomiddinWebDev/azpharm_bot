const {Sequelize,Model} = require('sequelize');
const UserModel = require('./db/Model/User');
const sequelize = new Sequelize('tgBot', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
})

async function postgres(){
    try {
        let db = {}
        db.user = await UserModel.User(Sequelize,sequelize);
        db.apeals = await UserModel.Appeal(Sequelize,sequelize)
        await sequelize.sync({force:false})
        // await sequelize.close()
        return db;
    } catch (error) {
        console.error(error);
    }
}

module.exports =  postgres;