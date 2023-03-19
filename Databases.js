const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
require("dotenv").config();

class Database {
  constructor() {
    this.registros = [];
    this.sequelize = new Sequelize(
      process.env.DATABASE,
      process.env.USUARIO,
      process.env.PASSWORD,
      {
        host: process.env.HOST,
        dialect: "mysql",
      }
    );
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
      createQuery: async (data) => {
        try {
          const valores = data.split(";");
          const timestamp = parseInt(valores[3], 10);
          const fecha = new Date(timestamp);
          const fechaLegible = fecha.toLocaleString();
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
      GetQueryRange: async function(startDateTime, endDateTime) {
        try {
          var startDate = startDateTime.split(' ');
          var endDate = endDateTime.split(' ');
          const registros = await this.Registro.findAll({
            where: {
              [Op.and]: [
                { fecha: { [Op.between]: [startDate[0], endDate[0]] } },
                { hora: { [Op.between]: [startDate[1], endDate[1]] } }
              ]
            }
          });
    
          return registros;
        } catch (error) {
          console.error("Error al obtener datos por rango de fecha y hora:", error);
        }
      },
    };
  }

  async connection() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
      // Crear la base de datos y la tabla si no existen
      await this.sequelize.query("CREATE DATABASE IF NOT EXISTS Tracker;");
      await this.Registro.sync({ alter: true });
      console.log("Database and table created successfully.");

      // Devolver la instancia de Sequelize
      return this.sequelize;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

module.exports = Database;
