// src/controllers/patientController.js

// Import model Pasien dan User
import { Pasien } from "../models/PasienModel.js";
import User from "../models/UserModel.js";

// Middleware untuk memeriksa role pengguna
export const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Ambil role pengguna dari request
    if (!roles.includes(userRole)) { // Periksa apakah role ada dalam daftar yang diizinkan
      return res.status(403).json({ message: "Access denied" }); // Kirim respons jika akses ditolak
    }
    next(); // Lanjutkan ke middleware berikutnya jika akses diizinkan
  };
};

// Fungsi untuk membuat atau memperbarui data pasien
export const createPasien = async (req, res) => {
  // Periksa apakah pengguna sudah login
  if (!req.session.id_user) {
    return res.status(401).json({ msg: "Mohon login terlebih dahulu" }); // Kirim respons jika belum login
  }

  const { nama_pasien, tanggal_lahir, alamat } = req.body; // Ambil data dari body request

  try {
    // Cari pengguna berdasarkan UUID yang disimpan dalam session
    const user = await User.findOne({
      where: { uuid: req.session.id_user },
    });

    // Jika pengguna tidak ditemukan, kirim respons
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Cek apakah data pasien sudah ada
    let pasien = await Pasien.findOne({
      where: { id_user: user.id_user },
    });

    if (pasien) {
      // Jika pasien sudah ada, lakukan pembaruan data
      await Pasien.update(
        {
          nama_pasien,
          tanggal_lahir,
          alamat,
        },
        {
          where: { id_user: user.id_user },
        }
      );
    } else {
      // Jika pasien belum ada, buat entri baru
      pasien = await Pasien.create({
        nama_pasien,
        tanggal_lahir,
        alamat,
        id_user: user.id_user,
      });
    }

    // Kirim respons berhasil
    res.status(200).json({
      msg: "Data pasien berhasil disimpan",
      patient_id: pasien.id_pasien,
    });
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res.status(500).json({
      msg: "Error updating patient data",
      error: error.message,
    });
  }
};

// Fungsi untuk mendapatkan semua data pasien
export const getPasiens = async (req, res) => {
  try {
    const response = await Pasien.findAll({
      attributes: [
        "id_pasien",
        "nama_pasien",
        "tanggal_lahir",
        "alamat",
        "id_user",
        "id_antrian",
        "id_rekam_medis",
      ],
      include: [
        {
          model: User, // Sertakan model User untuk informasi pengguna
          attributes: ["name", "email", "role"],
        },
      ],
    });
    // Kirim respons dengan data pasien
    res.status(200).json(response);
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk mendapatkan data pasien berdasarkan ID
export const getPasien = async (req, res) => {
  if (!req.session.id_user) {
    return res.status(401).json({ msg: "Mohon login terlebih dahulu" });
  }

  try {
    // Cari pengguna berdasarkan UUID dalam session
    const user = await User.findOne({
      where: { uuid: req.session.id_user },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Cari pasien berdasarkan ID
    const pasien = await Pasien.findOne({
      where: {
        id_pasien: req.params.id_pasien,
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
      pasien.id_user !== user.id_user
    ) {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Kirim respons dengan data pasien
    res.status(200).json(pasien);
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res.status(500).json({
      msg: "Error fetching patient data",
      error: error.message,
    });
  }
};

// Fungsi untuk memperbarui data pasien
export const updatePasiean = async (req, res) => {
  try {
    // Cari pasien berdasarkan ID
    const pasien = await Pasien.findOne({
      where: {
        id_pasien: req.params.id,
      },
    });

    // Jika pasien tidak ditemukan, kirim respons
    if (!pasien) return res.status(404).json({ msg: "Pasien tidak ditemukan" });

    // Cek session dan authorization
    if (!req.session.id_user) {
      return res.status(401).json({ msg: "Mohon login terlebih dahulu" });
    }

    // Cari pengguna yang sedang login
    const user = await User.findOne({
      where: { uuid: req.session.id_user },
    });

    // Validasi akses - hanya admin, dokter, atau pemilik data yang bisa update
    if (
      user.role !== "admin" &&
      user.role !== "dokter" &&
      String(pasien.id_user) !== String(user.id_user)
    ) {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Ambil data dari request body
    const { nama_pasien, tanggal_lahir, alamat } = req.body;

    try {
      // Update data pasien
      await Pasien.update(
        {
          nama_pasien: nama_pasien,
          tanggal_lahir: tanggal_lahir,
          alamat: alamat,
        },
        {
          where: {
            id_pasien: pasien.id_pasien,
          },
        }
      );

      // Kirim respons berhasil
      res.status(200).json({ msg: "Data pasien berhasil diperbarui" });
    } catch (error) {
      // Kirim respons error jika terjadi kesalahan saat memperbarui
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    res.status(500).json({ msg: error.message });
  }
};

// Fungsi untuk memperbarui data pasien dengan lebih terperinci
export const updatePasien = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID pasien dari parameter
    console.log("ID from params:", id); // Untuk debugging

    // Periksa apakah ID ada dan valid
    if (!id) {
      return res.status(400).json({ msg: "ID Pasien diperlukan" });
    }

    // Cek session
    if (!req.session.id_user) {
      return res.status(401).json({ msg: "Mohon login terlebih dahulu" });
    }

    // Cari pasien berdasarkan ID
    const pasien = await Pasien.findOne({
      where: {
        id_pasien: parseInt(id), // Ubah ID ke integer
      },
    });

    if (!pasien) {
      return res.status(404).json({ msg: "Pasien tidak ditemukan" });
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

    // Validasi akses
    if (
      user.role !== "admin" &&
      user.role !== "dokter" &&
      String(pasien.id_user) !== String(user.id_user)
    ) {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    // Ambil data baru dari body request
    const { nama_pasien, tanggal_lahir, alamat } = req.body;

    // Lakukan pembaruan data pasien
    await Pasien.update(
      {
        nama_pasien,
        tanggal_lahir,
        alamat,
      },
      {
        where: {
          id_pasien: parseInt(id),
        },
      }
    );

    // Kirim respons berhasil
    res.status(200).json({ msg: "Data pasien berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating pasien:", error); // Log error
    res.status(500).json({ msg: error.message }); // Kirim respons error
  }
};

// Fungsi untuk menghapus data pasien
export const deletePasien = async (req, res) => {
  // Periksa apakah pengguna sudah login
  if (!req.session.id_user) {
    return res.status(401).json({ msg: "Mohon login terlebih dahulu" });
  }

  try {
    // Cari pengguna yang login
    const user = await User.findOne({
      where: { uuid: req.session.id_user },
    });

    // Hanya admin yang dapat menghapus pasien
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Hanya admin yang dapat menghapus data pasien" });
    }

    // Hapus pasien berdasarkan ID
    const deleted = await Pasien.destroy({
      where: { id_pasien: req.params.id },
    });

    // Kirim respons jika berhasil atau jika pasien tidak ditemukan
    if (deleted) {
      res.status(200).json({ msg: "Data pasien berhasil dihapus" });
    } else {
      return res.status(404).json({ msg: "Pasien tidak ditemukan" });
    }
  } catch (error) {
    // Kirim respons error jika terjadi kesalahan
    return res.status(500).json({
      msg: "Error menghapus data pasien",
      error: error.message,
    });
  }
};
