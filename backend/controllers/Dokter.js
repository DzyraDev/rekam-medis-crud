// src/controllers/dokterController.js

// Import model Dokter dan User
import { Dokter } from "../models/DokterModel.js";
import User from "../models/UserModel.js";

// Middleware untuk memeriksa peran pengguna
export const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Ambil peran pengguna dari request
    if (!roles.includes(userRole)) { // Periksa apakah peran ada dalam daftar yang diizinkan
      return res.status(403).json({ message: "Access denied" }); // Jika tidak, kirim respons akses ditolak
    }
    next(); // Lanjutkan ke middleware berikutnya jika akses diizinkan
  };
};

// Fungsi untuk membuat atau memperbarui data dokter
export const createDokter = async (req, res) => {
  // Periksa apakah pengguna sudah login
  if (!req.session.id_user) {
    return res.status(401).json({ msg: "Mohon login terlebih dahulu" }); // Kirim respons jika belum login
  }

  const { nama_dokter, spesialis, nomor_lisensi } = req.body; // Ambil data dari body request
  try {
    // Cari pengguna berdasarkan UUID yang disimpan dalam session
    const user = await User.findOne({
      where: { uuid: req.session.id_user },
    });

    // Jika pengguna tidak ditemukan, kirim respons
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Cek apakah data dokter sudah ada
    let dokter = await Dokter.findOne({
      where: { id_user: user.id_user },
    });

    // Jika dokter sudah ada, lakukan pembaruan data
    if (dokter) {
      await Dokter.update(
        {
          nama_dokter,
          spesialis,
          nomor_lisensi,
        },
        {
          where: { id_user: user.id_user },
        }
      );
    } else {
      // Jika dokter belum ada, buat entri baru
      dokter = await Dokter.create({
        nama_dokter,
        spesialis,
        nomor_lisensi,
        id_user: user.id_user,
      });
    }

    // Kirim respons berhasil
    res.status(200).json({
      msg: "Dokter Berhasil ditambahkan",
      dokter_id: dokter.id_dokter,
    });
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res.status(500).json({
      msg: "Error updating dokter data",
      error: error.message,
    });
  }
};

// Fungsi untuk mendapatkan semua data dokter
export const getDokters = async (req, res) => {
  try {
    const response = await Dokter.findAll({
      attributes: ["id_dokter", "nama_dokter", "spesialis", "nomor_lisensi"], // Ambil atribut tertentu dari model Dokter
      include: [
        {
          model: User, // Sertakan model User untuk informasi pengguna
          attributes: ["name", "email", "role"],
        },
      ],
    });
    // Kirim respons dengan data dokter
    res.status(200).json(response);
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan data dokter berdasarkan ID
export const getDokter = async (req, res) => {
  if (!req.session.id_user) {
    return res.status(401).json({ msg: "Mohon login terlebih dahulu" });
  }
  try {
    const user = await User.findOne({
      where: { uuid: req.session.id_user },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Cari dokter berdasarkan ID
    const response = await Dokter.findOne({
      where: {
        id_dokter: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["name", "email", "role"],
        },
      ],
    });

    // Periksa apakah pengguna memiliki akses
    if (
      user.role !== "admin" &&
      user.role !== "dokter" &&
      dokter.id_user !== user.id_user
    ) {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Siapkan hasil untuk dikirim
    const result = {
      id_dokter: response.id_dokter,
      nama_dokter: response.nama_dokter,
      spesialis: response.spesialis,
      nomor_lisensi: response.nomor_lisensi,
    };

    // Kirim respons dengan data dokter
    res.status(200).json(result);
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk memperbarui data dokter
export const updatedsdsDokter = async (req, res) => {
  // Periksa apakah pengguna sudah login
  if (!req.session.id_user) {
    return res.status(401).json({ msg: "Mohon login terlebih dahulu." });
  }

  const { id_dokter } = req.params; // Ambil ID dokter dari parameter

  try {
    // Cari pengguna berdasarkan session
    const user = await User.findOne({
      where: { uuid: req.session.id_user },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan." });
    }

    // Cari dokter berdasarkan ID
    const dokter = await Dokter.findOne({
      where: { id_dokter },
    });

    if (!dokter) {
      return res.status(404).json({ msg: "Dokter tidak ditemukan." });
    }

    // Periksa apakah pengguna memiliki akses untuk memperbarui
    if (
      user.role !== "admin" &&
      user.role !== "dokter" &&
      dokter.id_user !== user.id_user
    ) {
      return res.status(403).json({ msg: "Akses ditolak." });
    }

    // Lakukan pembaruan data dokter
    await Dokter.update(req.body, {
      where: { id_dokter: req.params.id_dokter },
    });

    // Kirim respons berhasil
    res.status(200).json({ msg: "Dokter berhasil diperbarui." });
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res.status(500).json({ msg: `Terjadi kesalahan: ${error.message}` });
  }
};

// Fungsi untuk memperbarui data dokter dengan lebih terperinci
export const updateDokter = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dokter dari parameter
    console.log("ID from params:", id); // Untuk debugging

    // Periksa apakah ID ada dan valid
    if (!id) {
      return res.status(400).json({ msg: "ID Dokter diperlukan" });
    }

    // Cek session pengguna
    if (!req.session.id_user) {
      return res.status(401).json({ msg: "Mohon login terlebih dahulu" });
    }

    // Cari dokter berdasarkan ID
    const dokter = await Dokter.findOne({
      where: {
        id_dokter: parseInt(id), // Ubah ID ke integer
      },
    });

    if (!dokter) {
      return res.status(404).json({ msg: "Dokter tidak ditemukan" });
    }

    // Cari pengguna yang login
    const user = await User.findOne({
      where: {
        uuid: req.session.id_user,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Validasi akses pengguna
    if (
      user.role !== "admin" &&
      user.role !== "dokter" &&
      String(dokter.id_user) !== String(user.id_user)
    ) {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Ambil data baru dari body request
    const { nama_dokter, spesialis, nomor_lisensi } = req.body;

    // Perbarui data dokter
    await Dokter.update(
      {
        nama_dokter,
        spesialis,
        nomor_lisensi,
      },
      {
        where: {
          id_dokter: parseInt(id),
        },
      }
    );

    // Kirim respons berhasil
    res.status(200).json({ msg: "Data dokter berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating pasien:", error); // Log error
    res.status(500).json({ msg: error.message }); // Kirim respons error
  }
};

// Fungsi untuk menghapus data dokter
export const deleteDokter = async (req, res) => {
  // Periksa apakah pengguna sudah login
  if (!req.session.id_user) {
    return res.status(401).json({ msg: "Mohon login terlebih dahulu" });
  }

  try {
    // Cari pengguna yang login
    const user = await User.findOne({
      where: { uuid: req.session.id_user },
    });

    // Hanya admin yang dapat menghapus dokter
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Hanya admin yang dapat menghapus data dokter" });
    }

    // Hapus dokter berdasarkan ID
    const deleted = await Dokter.destroy({
      where: { id_dokter: req.params.id },
    });
    
    // Kirim respons berhasil atau tidak ditemukan
    if (deleted) {
      res.status(200).json({ msg: "dokter deleted successfully." });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res
      .status(500)
      .json({ message: "Error deleting doctor", error: error.message });
  }
};
