import { Sequelize } from "sequelize"; // Mengimpor Sequelize
import db from "../config/Database.js"; // Mengimpor koneksi database
import { Pasien } from "./PasienModel.js"; // Mengimpor model Pasien
import { Dokter } from "./DokterModel.js"; // Mengimpor model Dokter

const { DataTypes } = Sequelize; // Mengambil DataTypes dari Sequelize

// Mendefinisikan model Antrian
const Antrian = db.define(
  "Antrian",
  {
    id_antrian: {
      type: DataTypes.INTEGER, // Tipe data untuk ID antrian
      allowNull: false, // Tidak boleh null
      autoIncrement: true, // Otomatis meningkat
      primaryKey: true, // Menjadikannya primary key
    },
    no_antrian: {
      type: DataTypes.INTEGER, // Tipe data untuk nomor antrian
      allowNull: false, // Tidak boleh null
    },
    gejala: {
      type: DataTypes.STRING, // Tipe data untuk gejala
      allowNull: false, // Tidak boleh null
    },
    id_pasien: {
      type: DataTypes.INTEGER, // Tipe data untuk ID pasien
      allowNull: false, // Tidak boleh null
      references: {
        model: "Pasien", // Nama tabel referensi
        key: "id_pasien", // Kunci referensi pada tabel Pasien
      },
    },
    id_dokter: {
      type: DataTypes.INTEGER, // Tipe data untuk ID dokter
      allowNull: false, // Tidak boleh null
      references: {
        model: "Dokter", // Nama tabel referensi
        key: "id_dokter", // Kunci referensi pada tabel Dokter
      },
    },
    status: {
      type: DataTypes.ENUM('menunggu', 'terpanggil', 'batal', 'selesai'), // Tipe data enum untuk status
      allowNull: false, // Tidak boleh null
      defaultValue: 'menunggu' // Nilai default adalah 'menunggu'
    },
  },
  {
    freezeTableName: true, // Menghindari perubahan nama tabel menjadi jamak
    timestamps: true, // Menambahkan kolom createdAt dan updatedAt
  }
);

// Mendefinisikan asosiasi
const associate = (models) => {
  // Menghubungkan model Pasien dan Antrian
  Pasien.hasMany(Antrian, { foreignKey: "id_pasien", as: "Pasien" });
  Antrian.belongsTo(Pasien, { foreignKey: "id_pasien", as: "Pasien" });

  // Menghubungkan model Dokter dan Antrian
  Dokter.hasMany(Antrian, { foreignKey: "id_dokter", as: "Dokter" });
  Antrian.belongsTo(Dokter, { foreignKey: "id_dokter", as: "Dokter" });
};

// Ekspor model dan asosiasi
export { Antrian, associate };
