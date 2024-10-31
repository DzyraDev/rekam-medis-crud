import { Sequelize } from "sequelize"; // Mengimpor Sequelize
import db from "../config/Database.js"; // Mengimpor koneksi database

const { DataTypes } = Sequelize; // Mengambil DataTypes dari Sequelize

// Mendefinisikan model Users
const Users = db.define(
  "user", // Nama tabel dalam database
  {
    id_user: {
      type: DataTypes.INTEGER, // Tipe data untuk ID pengguna
      allowNull: false, // Tidak boleh null
      autoIncrement: true, // Otomatis meningkat
      primaryKey: true, // Menjadikannya primary key
    },
    uuid: {
      type: DataTypes.STRING, // Tipe data untuk UUID pengguna
      defaultValue: DataTypes.UUIDV4, // Menggunakan UUID v4 sebagai default
      allowNull: false, // Tidak boleh null
      validate: {
        notEmpty: true, // Validasi agar tidak kosong
      },
    },
    name: {
      type: DataTypes.STRING, // Tipe data untuk nama pengguna
      allowNull: false, // Tidak boleh null
      validate: {
        notEmpty: true, // Validasi agar tidak kosong
        len: [3, 100], // Panjang nama harus antara 3 dan 100 karakter
      },
    },
    email: {
      type: DataTypes.STRING, // Tipe data untuk email pengguna
      allowNull: false, // Tidak boleh null
      validate: {
        notEmpty: true, // Validasi agar tidak kosong
        isEmail: true, // Validasi format email
      },
    },
    password: {
      type: DataTypes.STRING, // Tipe data untuk password pengguna
      allowNull: false, // Tidak boleh null
      validate: {
        notEmpty: true, // Validasi agar tidak kosong
      },
    },
    role: {
      type: DataTypes.STRING, // Tipe data untuk peran pengguna (admin, pasien, dokter, dll.)
      allowNull: false, // Tidak boleh null
      validate: {
        notEmpty: true, // Validasi agar tidak kosong
      },
    },
  },
  {
    freezeTableName: true, // Menghindari perubahan nama tabel menjadi jamak
  }
);

// Mengekspor model Users
export default Users;
