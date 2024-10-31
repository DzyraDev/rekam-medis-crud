import { Sequelize } from "sequelize"; // Mengimpor Sequelize
import db from "../config/Database.js"; // Mengimpor koneksi database
import user from "./UserModel.js"; // Mengimpor model User
import { Antrian } from "./AntrianModel.js"; // Mengimpor model Antrian
import { RekamMedis } from "./RekamedisModel.js"; // Mengimpor model RekamMedis

const { DataTypes } = Sequelize; // Mengambil DataTypes dari Sequelize

// Mendefinisikan model Pasien
const Pasien = db.define(
  "Pasien",
  {
    id_pasien: {
      type: DataTypes.INTEGER, // Tipe data untuk ID pasien
      allowNull: false, // Tidak boleh null
      autoIncrement: true, // Otomatis meningkat
      primaryKey: true, // Menjadikannya primary key
    },
    nama_pasien: {
      type: DataTypes.STRING, // Tipe data untuk nama pasien
      allowNull: false, // Tidak boleh null
      validate: { notEmpty: true, len: [3, 100] }, // Validasi: tidak kosong dan panjang nama antara 3 hingga 100 karakter
    },
    tanggal_lahir: {
      type: DataTypes.DATE, // Tipe data untuk tanggal lahir pasien
      allowNull: false, // Tidak boleh null
    },
    alamat: {
      type: DataTypes.STRING, // Tipe data untuk alamat pasien
      allowNull: false, // Tidak boleh null
    },
    id_user: {
      type: DataTypes.INTEGER, // Tipe data untuk ID pengguna (user)
      allowNull: true, // Boleh null
      references: {
        model: "user", // Nama tabel referensi
        key: "id_user", // Kunci referensi pada tabel User
      },
    },
    id_antrian: {
      type: DataTypes.INTEGER, // Tipe data untuk ID antrian
      allowNull: true, // Boleh null
      references: {
        model: "Antrian", // Nama tabel referensi
        key: "id_antrian", // Kunci referensi pada tabel Antrian
      },
    },
    id_rekam_medis: {
      type: DataTypes.INTEGER, // Tipe data untuk ID rekam medis
      allowNull: true, // Boleh null
      references: {
        model: "RekamMedis", // Nama tabel referensi
        key: "id_rekam_medis", // Kunci referensi pada tabel RekamMedis
      },
    },
  },
  {
    freezeTableName: true, // Menghindari perubahan nama tabel menjadi jamak
  }
);

// Mendefinisikan asosiasi
const associate = (models) => {
  // Menghubungkan model User dan Pasien
  user.hasMany(Pasien, { foreignKey: "id_user" });
  Pasien.belongsTo(user, { foreignKey: "id_user" });

  // Menghubungkan model Antrian dan Pasien
  Antrian.hasMany(Pasien, { foreignKey: "id_antrian" });
  Pasien.belongsTo(Antrian, { foreignKey: "id_antrian" });

  // Menghubungkan model RekamMedis dan Pasien
  RekamMedis.hasMany(Pasien, { foreignKey: "id_rekam_medis" });
  Pasien.belongsTo(RekamMedis, { foreignKey: "id_rekam_medis" });
};

// Ekspor model dan asosiasi
export { Pasien, associate };
