const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const { Op } = require("sequelize");
require("dotenv").config();

class Database {
  
  constructor() {

    this.registros = [];
    //connects to the mysql database with env credentials
    this.sequelize = new Sequelize(//get the last two elements of the array
      process.env.DATABASE,
      process.env.USUARIO,
      process.env.PASSWORD,
      {
        host: process.env.HOST,
        dialect: "mysql",
      }
    );  
    //defines the model of the table
    this.Registro = this.sequelize.define(
      process.env.TABLE,
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoincrement: true,
        },
        ident: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
        latitud: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        longitud: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        fecha: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        hora: {
          type: DataTypes.TIME,
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
        timestamps: false,
      }
    );

    this.registroHandler = {

      //POST data to the database
      createQuery: async (data) => {
        try {
          const valores = data.split(";");
          const timestamp = parseInt(valores[3], 10);
          const fecha = new Date(timestamp);
          const fechaLegible = fecha.toLocaleString({ hour: 'numeric', minute: 'numeric', hour12: false });
          const fechas = fechaLegible.split(",");
          const newRegistro = {
            ident: valores[4],
            latitud: parseFloat(valores[0]),
            longitud: parseFloat(valores[1]),
            fecha: fechas[0],
            hora: fechas[1],
          };

          if (
            JSON.stringify(newRegistro) !== JSON.stringify(this.lastRegistro)
          ) {
            this.registros.push(newRegistro);
            this.lastRegistro = newRegistro;
          }
          if (this.registros.length >= 100) {
            await this.Registro.bulkCreate(this.registros);
            this.registros = [];
          }
        } catch (error) {
          console.error("Error al crear una nueva query:", error);
        }
      },
      //GET range of data 
      GetQueryRange: async (startDateTime, endDateTime) => {
        try {
          var startDate = startDateTime.split(' ');
          var endDate = endDateTime.split(' ');
          const registros = await this.Registro.findAll({
            where: {
              fecha: {[Op.between]: [startDate[0], endDate[0]]},
              [Op.or]: [{fecha: startDate[0],hora: {[Op.gte]: startDate[1]}},{fecha: {[Op.gt]: startDate[0]}}],
              [Op.or]: [{fecha: endDate[0],hora: {[Op.lte]: endDate[1]}},{fecha: {[Op.lt]: endDate[0]}}]
            },
            raw: true
          });
        return registros;
      } catch (error) {
        console.error("Error al obtener datos por rango de fecha y hora:", error);
      }
    },
    };
  }
  //ensures connection to the database
  async connection() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
      // Create db and table if they don't exist
      await this.sequelize.query("CREATE DATABASE IF NOT EXISTS Tracker;");
      await this.Registro.sync({ alter: true });
      console.log("Database and table created successfully.");

      // Return sequelize instance
      return this.sequelize;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

module.exports = Database;
