module.exports = class UserModel{
    static async Appeal(Sequelize,sequelize){
       return await sequelize.define("appeals",{
            chat_id:{
                type:Sequelize.DataTypes.BIGINT,
                primaryKey:true,
            },
            full_name:{
                type:Sequelize.DataTypes.STRING
            },
            phone_number:{
                type:Sequelize.DataTypes.STRING,
                primaryKey:true
            },
            location_longitude:{
                type:Sequelize.DataTypes.FLOAT
            },
            location_latitude:{
                type:Sequelize.DataTypes.FLOAT
            }
        })
    }
    static async User(Sequelize,sequelize){
        return await sequelize.define("users",{
            chat_id:{
                type:Sequelize.DataTypes.BIGINT,
                primaryKey:true,
            },
            language:{
                type:Sequelize.DataTypes.STRING
            }
        })
    }
}
