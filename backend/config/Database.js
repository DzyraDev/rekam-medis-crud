import { Sequelize } from "sequelize";

const db = new Sequelize('db_rekam_medis', 'postgres', 'aris', {
    host: 'localhost',
    dialect: 'postgres'
})
// KODE UNTUK MENGHUBUNGKAN DATABASE DENGAN SEQUELIZE

export default db