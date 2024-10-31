import { Sequelize } from "sequelize"; // Mengimpor Sequelize
import db from "../config/Database.js"; // Mengimpor koneksi database
import { Pasien } from "./PasienModel.js"; // Mengimpor model Pasien
import { Dokter } from "./DokterModel.js"; // Mengimpor model Dokter

const { DataTypes } = Sequelize; // Mengambil DataTypes dari Sequelize

// Mendefinisikan model RekamMedis
const RekamMedis = db.define(
  "RekamMedis",
  {
    id_rekam_medis: {
      type: DataTypes.INTEGER, // Tipe data untuk ID rekam medis
      autoIncrement: true, // Otomatis meningkat
      primaryKey: true, // Menjadikannya primary key
    },
    diagnosa: {
      type: DataTypes.STRING, // Tipe data untuk diagnosa
      allowNull: true, // Boleh null
    },
    resep: {
      type: DataTypes.STRING, // Tipe data untuk resep
      allowNull: true, // Boleh null
    },
    catatan: {
      type: DataTypes.STRING, // Tipe data untuk catatan
      allowNull: true, // Boleh null
    },
    tanggal: {
      type: DataTypes.DATE, // Tipe data untuk tanggal rekam medis
      allowNull: true, // Boleh null
    },
    id_pasien: {
      type: DataTypes.INTEGER, // Tipe data untuk ID pasien
      allowNull: true, // Boleh null
      references: {
        model: "Pasien", // Nama tabel referensi
        key: "id_pasien", // Kunci referensi pada tabel Pasien
      },
    },
    id_dokter: {
      type: DataTypes.INTEGER, // Tipe data untuk ID dokter
      allowNull: true, // Boleh null
      references: {
        model: "Dokter", // Nama tabel referensi
        key: "id_dokter", // Kunci referensi pada tabel Dokter
      },
    },
  },
  {
    freezeTableName: true, // Menghindari perubahan nama tabel menjadi jamak
  }
);

// Mendefinisikan asosiasi
const associate = (models) => {
  // Menghubungkan model Pasien dan RekamMedis
  Pasien.hasMany(RekamMedis, {
    foreignKey: "id_pasien", // Kunci asing di tabel RekamMedis
    as: "PasienRekamMedis", // Alias untuk asosiasi
  });
  RekamMedis.belongsTo(Pasien, {
    foreignKey: "id_pasien", // Kunci asing di tabel RekamMedis
    as: "PasienRekamMedis", // Alias untuk asosiasi
  });

  // Menghubungkan model Dokter dan RekamMedis
  Dokter.hasMany(RekamMedis, {
    foreignKey: "id_dokter", // Kunci asing di tabel RekamMedis
    as: "DokterRekamMedis", // Alias untuk asosiasi
  });
  RekamMedis.belongsTo(Dokter, {
    foreignKey: "id_dokter", // Kunci asing di tabel RekamMedis
    as: "DokterRekamMedis", // Alias untuk asosiasi
  });
};

// Ekspor model dan asosiasi
export { RekamMedis, associate };
