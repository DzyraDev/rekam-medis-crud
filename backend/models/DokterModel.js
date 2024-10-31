import { Sequelize } from "sequelize"; // Mengimpor Sequelize
import db from "../config/Database.js"; // Mengimpor koneksi database
import user from "./UserModel.js"; // Mengimpor model User
import { RekamMedis } from "./RekamedisModel.js"; // Mengimpor model RekamMedis
import { Antrian } from "./AntrianModel.js"; // Mengimpor model Antrian

const { DataTypes } = Sequelize; // Mengambil DataTypes dari Sequelize

// Mendefinisikan model Dokter
const Dokter = db.define(
  "Dokter",
  {
    id_dokter: {
      type: DataTypes.INTEGER, // Tipe data untuk ID dokter
      allowNull: false, // Tidak boleh null
      autoIncrement: true, // Otomatis meningkat
      primaryKey: true, // Menjadikannya primary key
    },
    nama_dokter: {
      type: DataTypes.STRING, // Tipe data untuk nama dokter
      allowNull: false, // Tidak boleh null
    },
    spesialis: {
      type: DataTypes.STRING, // Tipe data untuk spesialis dokter
      allowNull: false, // Tidak boleh null
    },
    nomor_lisensi: {
      type: DataTypes.STRING, // Tipe data untuk nomor lisensi dokter
      allowNull: false, // Tidak boleh null
    },
    id_user: {
      type: DataTypes.INTEGER, // Tipe data untuk ID pengguna (user)
      allowNull: true, // Boleh null
      references: {
        model: "user", // Nama tabel referensi
        key: "id_user", // Kunci referensi pada tabel User
      },
      validate: {
        notEmpty: true, // Validasi agar tidak kosong
      },
    },
    id_antrian: {
      type: DataTypes.INTEGER, // Tipe data untuk ID antrian
      allowNull: true, // Boleh null
      references: {
        model: "Antrian", // Menggunakan nama tabel sebagai referensi
        key: "id_antrian", // Kunci referensi pada tabel Antrian
      },
      validate: {
        notEmpty: true, // Validasi agar tidak kosong
      },
    },
    id_rekam_medis: {
      type: DataTypes.INTEGER, // Tipe data untuk ID rekam medis
      allowNull: true, // Boleh null
      references: {
        model: "RekamMedis", // Nama tabel referensi
        key: "id_rekam_medis", // Kunci referensi pada tabel RekamMedis
      },
      validate: {
        notEmpty: true, // Validasi agar tidak kosong
      },
    },
  },
  {
    freezeTableName: true, // Menghindari perubahan nama tabel menjadi jamak
  }
);

// Mendefinisikan asosiasi
const associate = (models) => {
  // Menghubungkan model User dan Dokter
  user.hasMany(Dokter, { foreignKey: "id_user" });
  Dokter.belongsTo(user, { foreignKey: "id_user" });

  // Menghubungkan model Antrian dan Dokter
  Antrian.hasMany(Dokter, { foreignKey: "id_antrian" });
  Dokter.belongsTo(Antrian, { foreignKey: "id_antrian" });

  // Menghubungkan model RekamMedis dan Dokter
  RekamMedis.hasMany(Dokter, { foreignKey: "id_rekam_medis" });
  Dokter.belongsTo(RekamMedis, { foreignKey: "id_rekam_medis" });
};

// Ekspor model dan asosiasi
export { Dokter, associate };
