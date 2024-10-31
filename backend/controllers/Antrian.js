import { Antrian } from "../models/AntrianModel.js"; // Mengimpor model Antrian
import { Dokter } from "../models/DokterModel.js"; // Mengimpor model Dokter
import { Pasien } from "../models/PasienModel.js"; // Mengimpor model Pasien
import User from "../models/UserModel.js"; // Mengimpor model User
import { Op } from "sequelize"; // Mengimpor operator dari Sequelize untuk query
import db from "../config/Database.js"; // Mengimpor konfigurasi database

// Fungsi untuk menghasilkan nomor antrian berikutnya untuk dokter tertentu
const generateQueueNumber = async (doctorId) => {
  const today = new Date(); // Mendapatkan tanggal saat ini
  today.setHours(0, 0, 0, 0); // Mengatur waktu ke awal hari (00:00:00)

  // Mencari antrian yang sudah ada untuk dokter tertentu pada hari ini
  const existingQueues = await Antrian.findAll({
    where: {
      id_dokter: doctorId,
      createdAt: {
        [Op.gte]: today, // Mengambil antrian yang dibuat hari ini atau setelahnya
      },
      status: {
        [Op.notIn]: ["selesai", "batal"], // Mengabaikan status 'selesai' dan 'batal'
      },
    },
    order: [["no_antrian", "DESC"]], // Mengurutkan antrian berdasarkan nomor antrian tertinggi
  });

  // Menghasilkan nomor antrian baru
  return existingQueues.length === 0 ? 1 : existingQueues[0].no_antrian + 1; // Jika tidak ada antrian, mulai dari 1
};

// Mengambil semua antrian untuk dokter tertentu
export const getAntrian = async (req, res) => {
  try {
    const userId = req.session.id_user; // Mendapatkan ID user dari session
    const user = await User.findOne({ where: { uuid: userId } }); // Mencari user berdasarkan UUID

    if (!user) {
      return res.status(404).json({ msg: "User not found" }); // Menangani jika user tidak ditemukan
    }

    let whereClause = {}; // Tempat untuk menyimpan kondisi pencarian
    let includeClause = [
      // Termasuk informasi pasien dan dokter
      {
        model: Pasien,
        as: "Pasien",
        attributes: ["nama_pasien"], // Hanya mengambil nama pasien
      },
      {
        model: Dokter,
        as: "Dokter",
        attributes: ["nama_dokter"], // Hanya mengambil nama dokter
      },
    ];

    // Memeriksa peran user untuk menentukan antrian yang diambil
    if (user.role === "dokter") {
      const dokter = await Dokter.findOne({ where: { id_user: user.id_user } });
      if (!dokter) {
        return res.status(404).json({ msg: "Doctor data not found" }); // Menangani jika data dokter tidak ditemukan
      }
      whereClause.id_dokter = dokter.id_dokter; // Menambahkan kondisi untuk dokter
    } else if (user.role === "pasien") {
      const pasien = await Pasien.findOne({ where: { id_user: user.id_user } });
      if (!pasien) {
        return res.status(404).json({ msg: "Patient data not found" }); // Menangani jika data pasien tidak ditemukan
      }
      whereClause.id_pasien = pasien.id_pasien; // Menambahkan kondisi untuk pasien
    }

    // Mengambil antrian dari database
    const response = await Antrian.findAll({
      attributes: ["id_antrian", "no_antrian", "gejala", "status", "id_dokter"],
      include: includeClause,
      where: whereClause,
      order: [["no_antrian", "ASC"]], // Mengurutkan berdasarkan nomor antrian
    });

    if (response.length === 0) {
      return res.status(404).json({ msg: "No antrian found" }); // Menangani jika tidak ada antrian
    }

    // Memformat hasil antrian untuk dikirim ke client
    const result = response.map((antrian) => ({
      id_antrian: antrian.id_antrian,
      no_antrian: antrian.no_antrian,
      gejala: antrian.gejala,
      status: antrian.status,
      nama_pasien: antrian.Pasien ? antrian.Pasien.nama_pasien : null,
      nama_dokter: antrian.Dokter ? antrian.Dokter.nama_dokter : null,
    }));

    res.status(200).json(result); // Mengirim hasil dengan status 200
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani error
  }
};

// Mengambil semua produk (dalam konteks yang tidak jelas, mungkin antrian)
export const getProducts = async (req, res) => {
  try {
    let response; // Variabel untuk menyimpan response

    // Memeriksa peran user untuk mengambil produk yang tepat
    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: [
          "id_antrian",
          "nomor_antrian",
          "gejala",
          "nama_pasien",
          "nama_dokter",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"], // Menyertakan informasi user
          },
        ],
      });
    } else {
      response = await Product.findAll({
        attributes: ["uuid", "gejala", "nama_pasien", "nama_dokter"],
        where: {
          userId: req.userId, // Mengambil berdasarkan user yang sesuai
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"], // Menyertakan informasi user
          },
        ],
      });
    }
    res.status(200).json(response); // Mengirim response dengan status 200
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani error
  }
};

// Mengambil antrian berdasarkan ID
export const getAntrianById = async (req, res) => {
  try {
    const response = await Antrian.findOne({
      attributes: ["id_antrian", "no_antrian", "gejala", "status"],
      where: {
        id_antrian: req.params.id_antrian, // Mencari antrian berdasarkan ID yang diberikan
      },
      include: [
        {
          model: Pasien,
          as: "Pasien", // Menggunakan alias yang sesuai
          attributes: ["nama_pasien"], // Mengambil nama pasien
        },
        {
          model: Dokter,
          as: "Dokter", // Menggunakan alias yang sesuai
          attributes: ["nama_dokter"], // Mengambil nama dokter
        },
      ],
    });

    if (!response) {
      return res.status(404).json({ msg: "Antrian not found" }); // Menangani jika antrian tidak ditemukan
    }

    // Memformat hasil antrian untuk dikirim ke client
    const result = {
      id_antrian: response.id_antrian,
      no_antrian: response.no_antrian,
      gejala: response.gejala,
      status: response.status,
      nama_pasien: response.Pasien ? response.Pasien.nama_pasien : null,
      nama_dokter: response.Dokter ? response.Dokter.nama_dokter : null,
    };

    res.status(200).json(result); // Mengirim hasil dengan status 200
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani error
  }
};

// Membuat antrian baru dengan status menunggu
export const createAntrian = async (req, res) => {
  const { gejala, id_dokter, no_antrian } = req.body; // Mengambil data dari body request
  const userId = req.session.id_user; // Mendapatkan ID user dari session

  try {
    const user = await User.findOne({ where: { uuid: userId } }); // Mencari user
    if (!user) {
      return res.status(404).json({ msg: "User not found" }); // Menangani jika user tidak ditemukan
    }

    const pasien = await Pasien.findOne({ where: { id_user: user.id_user } }); // Mencari data pasien
    if (!pasien) {
      return res.status(404).json({ msg: "Patient data not found" }); // Menangani jika data pasien tidak ditemukan
    }

    let queueNumber; // Variabel untuk nomor antrian
    if (user.role === "admin" && no_antrian) {
      queueNumber = no_antrian; // Jika admin, gunakan nomor antrian dari body
    } else {
      queueNumber = await generateQueueNumber(id_dokter); // Menghasilkan nomor antrian baru
    }

    // Membuat antrian baru di database
    const antrian = await Antrian.create({
      no_antrian: queueNumber,
      gejala,
      id_pasien: pasien.id_pasien,
      id_dokter,
      status: "menunggu", // Set status awal menjadi 'menunggu'
    });

    res.status(201).json({
      msg: "Antrian created successfully", // Mengirim respon sukses
      data: antrian,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani error
  }
};

// Memperbarui antrian
export const updateAntrian = async (req, res) => {
  const { id_antrian } = req.params; // Mendapatkan ID antrian dari parameter
  try {
    const antrian = await Antrian.findOne({ where: { id_antrian } }); // Mencari antrian berdasarkan ID
    if (!antrian) return res.status(404).json({ msg: "Antrian not found." }); // Menangani jika antrian tidak ditemukan

    await Antrian.update(req.body, { where: { id_antrian } }); // Memperbarui antrian
    res.status(200).json({ msg: "Antrian updated successfully." }); // Mengirim respon sukses
  } catch (error) {
    res.status(400).json({ msg: error.message }); // Menangani error
  }
};

// Memperbarui status antrian
export const updateAntrianStatus = async (req, res) => {
  try {
    const { id_antrian } = req.params; // Mendapatkan ID antrian dari parameter
    const { action } = req.body; // Mendapatkan aksi dari body request

    let newStatus; // Variabel untuk status baru
    // Menentukan status baru berdasarkan aksi yang diterima
    switch (action) {
      case "panggil":
        newStatus = "terpanggil"; // Status menjadi 'terpanggil'
        break;
      case "selesai":
        newStatus = "selesai"; // Status menjadi 'selesai'
        break;
      case "batal":
        newStatus = "batal"; // Status menjadi 'batal'
        break;
      default:
        return res.status(400).json({ message: "Invalid action" }); // Menangani aksi yang tidak valid
    }

    // Memperbarui status antrian
    const [updatedRows] = await Antrian.update(
      { status: newStatus },
      { where: { id_antrian: id_antrian } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Antrian not found" }); // Menangani jika antrian tidak ditemukan
    }

    res
      .status(200)
      .json({ success: true, message: "Antrian status updated successfully" }); // Mengirim respon sukses
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message }); // Menangani error
  }
};

// Menghapus antrian
export const deleteAntrian = async (req, res) => {
  const { id_antrian } = req.params; // Mendapatkan ID antrian dari parameter
  try {
    const antrian = await Antrian.findOne({ where: { id_antrian } }); // Mencari antrian berdasarkan ID
    if (!antrian) {
      return res.status(404).json({ msg: "Antrian tidak ditemukan" }); // Menangani jika antrian tidak ditemukan
    }

    if (antrian.status === "selesai") {
      return res
        .status(400)
        .json({ msg: "Tidak dapat menghapus antrian yang sudah selesai" }); // Menangani jika status antrian sudah selesai
    }

    await Antrian.destroy({ where: { id_antrian } }); // Menghapus antrian dari database
    res.status(200).json({ msg: "Antrian berhasil dihapus" }); // Mengirim respon sukses
  } catch (error) {
    res.status(400).json({ msg: error.message }); // Menangani error
  }
};

// Menghitung jumlah antrian yang menunggu
export const getQueueCount = async (req, res) => {
  const { id_dokter } = req.body; // Mengambil ID dokter dari body request
  try {
    const counts = await Antrian.count({
      where: {
        status: "menunggu", // Menghitung antrian yang berstatus 'menunggu'
      },
      group: ["id_dokter"], // Mengelompokkan berdasarkan ID dokter
    });

    // Memformat data menjadi objek yang lebih mudah digunakan
    const result = counts.map(({ id_dokter, count }) => ({
      id_dokter,
      count,
    }));

    res.status(200).json(result); // Mengirim hasil dengan status 200
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani error
  }
};
