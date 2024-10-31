// Import model yang diperlukan untuk operasi database
import { Antrian } from "../models/AntrianModel.js";
import { Dokter } from "../models/DokterModel.js";
import { Pasien } from "../models/PasienModel.js";
import { RekamMedis } from "../models/RekamedisModel.js";
import User from "../models/UserModel.js";

import db from "../config/Database.js";

// Get all Rekam Medis
export const getRekamMedis = async (req, res) => {
  try {
    // Ambil ID user dari session
    const userId = req.session.id_user;
    const user = await User.findOne({ where: { uuid: userId } });

    // Cek apakah user ditemukan
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let whereClause = {};
    let includeClause = [
      {
        model: Pasien,
        as: "PasienRekamMedis", // Alias untuk model Pasien
        attributes: ["nama_pasien"], // Ambil nama pasien
      },
      {
        model: Dokter,
        as: "DokterRekamMedis", // Alias untuk model Dokter
        attributes: ["nama_dokter"], // Ambil nama dokter
      },
    ];

    // Cek peran user (dokter atau pasien)
    if (user.role === "dokter") {
      const dokter = await Dokter.findOne({
        where: { id_user: user.id_user },
      });
      if (!dokter) {
        return res.status(404).json({ msg: "Doctor data not found" });
      }
      whereClause.id_dokter = dokter.id_dokter; // Filter berdasarkan dokter
    } else if (user.role === "pasien") {
      const pasien = await Pasien.findOne({
        where: { id_user: user.id_user },
      });
      if (!pasien) {
        return res.status(404).json({ msg: "Patient data not found" });
      }
      whereClause.id_pasien = pasien.id_pasien; // Filter berdasarkan pasien
    }

    // Ambil data rekam medis
    const rekamMedis = await RekamMedis.findAll({
      attributes: ["id_rekam_medis", "diagnosa", "resep", "catatan", "tanggal"],
      include: includeClause,
      where: whereClause,
    });

    // Cek apakah rekam medis ditemukan
    if (!rekamMedis) {
      return res.status(404).json({ msg: "Antrian not found" });
    }

    // Format hasil yang akan dikirimkan
    const result = rekamMedis.map((rekammedis) => ({
      id_rekam_medis: rekammedis.id_rekam_medis,
      diagnosa: rekammedis.diagnosa,
      resep: rekammedis.resep,
      catatan: rekammedis.catatan,
      tanggal: rekammedis.tanggal,
      nama_pasien: rekammedis.PasienRekamMedis
        ? rekammedis.PasienRekamMedis.nama_pasien
        : null,
      nama_dokter: rekammedis.DokterRekamMedis
        ? rekammedis.DokterRekamMedis.nama_dokter
        : null,
    }));

    // Kirimkan hasil dengan status 200
    res.status(200).json(result);
  } catch (error) {
    // Tangani error jika terjadi
    res.status(500).json({ msg: error.message });
  }
};

// Get Rekam Medis by ID
export const getRekamMedisById = async (req, res) => {
  try {
    // Ambil rekam medis berdasarkan ID
    const response = await RekamMedis.findOne({
      attributes: ["id_rekam_medis", "diagnosa", "resep", "catatan", "tanggal"],
      where: { id_rekam_medis: req.params.id_rekam_medis },
      include: [
        {
          model: Pasien,
          as: "PasienRekamMedis", // Alias untuk model Pasien
          attributes: ["nama_pasien"],
        },
        {
          model: Dokter,
          as: "DokterRekamMedis", // Alias untuk model Dokter
          attributes: ["nama_dokter"],
        },
      ],
    });

    // Cek apakah rekam medis ditemukan
    if (!response) {
      return res.status(404).json({ msg: "Antrian not found" });
    }
    
    // Format hasil yang akan dikirimkan
    const result = {
      id_rekam_medis: response.id_rekam_medis,
      diagnosa: response.diagnosa,
      resep: response.resep,
      catatan: response.catatan,
      tanggal: response.tanggal,
      nama_pasien: response.PasienRekamMedis
        ? response.PasienRekamMedis.nama_pasien
        : null,
      nama_dokter: response.DokterRekamMedis
        ? response.DokterRekamMedis.nama_dokter
        : null,
    };

    // Kirimkan hasil dengan status 200
    res.status(200).json(result);
  } catch (error) {
    // Tangani error jika terjadi
    res.status(500).json({ msg: error.message });
  }
};

// Create Rekam Medis
export const createRekamMedis = async (req, res) => {
  const {
    diagnosa,
    resep,
    catatan,
    tanggal,
    id_pasien,
    id_dokter,
    id_antrian,
  } = req.body;

  try {
    // Validasi bahwa dokter memanggil pasien di antrian
    const antrian = await Antrian.findOne({
      where: {
        id_antrian,
        id_pasien,
        id_dokter,
        status: "selesai", // Pastikan antrian sudah selesai
      },
    });

    // Cek apakah antrian ditemukan dan sudah selesai
    if (!antrian) {
      return res
        .status(404)
        .json({ msg: "Antrian tidak ditemukan atau belum selesai." });
    }

    // Buat rekam medis
    const rekamMedis = await RekamMedis.create({
      diagnosa,
      resep,
      catatan,
      tanggal,
      id_pasien,
      id_dokter,
      id_antrian,
    });

    // Kirimkan hasil dengan status 201 (Created)
    res.status(201).json(rekamMedis);
  } catch (error) {
    // Tangani error jika terjadi
    res.status(400).json({ msg: error.message });
  }
};

// Update Rekam Medis
export const updateRekamMedis = async (req, res) => {
  const { id_rekam_medis } = req.params;
  try {
    // Ambil rekam medis berdasarkan ID
    const rekamMedis = await RekamMedis.findOne({
      where: { id_rekam_medis },
    });

    // Cek apakah rekam medis ditemukan
    if (!rekamMedis)
      return res.status(404).json({ msg: "Rekam Medis not found." });

    // Update rekam medis dengan data baru
    await RekamMedis.update(req.body, { where: { id_rekam_medis } });
    res.status(200).json({ msg: "Rekam Medis updated successfully." });
  } catch (error) {
    // Tangani error jika terjadi
    res.status(400).json({ msg: error.message });
  }
};

// Delete Rekam Medis
export const deleteRekamMedis = async (req, res) => {
  const { id_rekam_medis } = req.params;
  try {
    // Ambil rekam medis berdasarkan ID
    const rekamMedis = await RekamMedis.findOne({ where: { id_rekam_medis } });
    
    // Cek apakah rekam medis ditemukan
    if (!rekamMedis)
      return res.status(404).json({ msg: "Rekam Medis not found." });

    // Hapus rekam medis
    await RekamMedis.destroy({ where: { id_rekam_medis } });
    res.status(200).json({ msg: "Rekam Medis deleted successfully." });
  } catch (error) {
    // Tangani error jika terjadi
    res.status(400).json({ msg: error.message });
  }
};

// Create Rekam Medis from Antrian
export const createRekamMedisFromAntrian = async (req, res) => {
  try {
    const { id_antrian } = req.body;

    // Ambil data antrian
    const antrian = await Antrian.findOne({
      where: { id_antrian },
      include: [
        { model: Pasien, as: "Pasien" }, // Mengambil data pasien
        { model: Dokter, as: "Dokter" }, // Mengambil data dokter
      ],
    });

    // Cek apakah antrian ditemukan
    if (!antrian) {
      return res.status(404).json({ message: "Antrian not found" });
    }

    // Buat rekam medis baru dengan informasi pasien dan dokter
    const newRekamMedis = await RekamMedis.create({
      id_pasien: antrian.id_pasien,
      id_dokter: antrian.id_dokter,
      tanggal: new Date(),
      diagnosa: "", // Awalnya kosong
      resep: "", // Awalnya kosong
      catatan: "", // Awalnya kosong
    });

    // Update status antrian menjadi 'terpanggil'
    await Antrian.update({ status: "terpanggil" }, { where: { id_antrian } });

    // Kirimkan hasil dengan status 201
    res.status(201).json({
      success: true,
      message: "Rekam medis created successfully",
      id_rekam_medis: newRekamMedis.id_rekam_medis,
      nama_pasien: antrian.Pasien.nama_pasien,
      nama_dokter: antrian.Dokter.nama_dokter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
