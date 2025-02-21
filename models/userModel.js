import dbstorage from "../config/db.js";
import { DataTypes, Model, UUIDV4 } from "sequelize";

class User extends Model{};

User.init(
    {
        id:{
            primaryKey: true,
            type:DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },

        firstName:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password:{
            type: DataTypes.STRING,
            allowNull: true, // Can be null for Google users
        },
        oAuthId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true, // Can be null for non-Google users
          },
        role:{
            type: DataTypes.ENUM('user', 'manager','admin'),
            defaultValue: 'user',
            allowNull: false
        },
        managerId: {
            type: DataTypes.UUID,
            allowNull: true
        }
    },
    {
        sequelize: dbstorage.db,
        modelName: 'user',
        tableName: 'users'
    }
)

export default User;