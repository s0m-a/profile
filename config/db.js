import { Sequelize } from "sequelize";
import dovenv from 'dotenv';

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 5432
const DB_DATABASE = process.env.DB_DATABASE || 'mydb';
const DB_USER = process.env.DB_USER || 'soma' ;
const DB_PWD = process.env.DB_PWD ||'soma';

const DB_URL = `postgres://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
class Dbstorage{
    constructor(){
        this.db = new Sequelize(DB_URL, {logging: console.log});
    }

    async checkLife(){
        try {
            await this.db.authenticate();
            console.log('connected successfully to the database');
            return true;
        } catch (error) {
            console.error('connected successfully to the database error:', error);
            return false;
        }
    }

    async sync(force = false){
        try {
            await this.db.sync({force});
            console.log('database schema synchronized successfully');
        } catch (error) {
            console.error('database schema synchronized failed, error: ', error);
        }
    }

    async close(){
        try {
            await this.db.close();
            console.log('database closed successfully');
        } catch (error) {
            console.error('database closed failed, error: ', error );
        }
    }
}

const dbstorage = new Dbstorage();
export default dbstorage;