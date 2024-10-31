import Users from "../models/UserModel.js";
import argon2 from "argon2";

// Mengambil semua pengguna
export const getUser = async (req, res) => {
  try {
    // Mengambil data pengguna dari database
    const response = await Users.findAll({
      attributes: ["id_user", "uuid", "name", "email", "role"], // Kolom yang ingin diambil
    });
    // Mengirimkan respons dengan status 200 dan data pengguna
    res.status(200).json(response);
  } catch (error) {
    // Menangani error jika terjadi
    res.status(500).json({ msg: error.message });
  }
};

// Mengambil pengguna berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["id_user", "uuid", "name", "email", "role"], // Kolom yang ingin diambil
      where: {
        uuid: req.params.id_user, // Mencocokkan UUID dengan parameter dari permintaan
      },
    });
    // Mengirimkan respons dengan status 200 dan data pengguna
    res.status(200).json(response);
  } catch (error) {
    // Menangani error jika terjadi
    res.status(500).json({ msg: error.message });
  }
};

// Membuat pengguna baru
export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  // Validasi untuk memastikan password dan konfirmasi password cocok
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  // Menghash password menggunakan argon2
  const hashPassword = await argon2.hash(password);
  try {
    // Menyimpan pengguna baru ke dalam database
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    // Mengirimkan respons bahwa pendaftaran berhasil
    res.status(200).json({ msg: "Register Berhasil" });
  } catch (error) {
    // Menangani error jika terjadi
    res.status(400).json({ msg: error.message });
  }
};

// Memperbarui data pengguna
export const updateUser = async (req, res) => {
  // Mencari pengguna berdasarkan UUID
  const user = await Users.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  // Cek apakah pengguna ditemukan
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const { name, email, password, confPassword, role } = req.body;
  let hashPassword;

  // Jika password tidak diubah, gunakan password yang lama
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    // Hash password baru
    hashPassword = await argon2.hash(password);
  }

  // Validasi untuk memastikan password dan konfirmasi password cocok
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  try {
    // Memperbarui data pengguna
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          uuid: user.uuid, // Mengupdate pengguna berdasarkan UUID
        },
      }
    );
    // Mengirimkan respons bahwa pembaruan berhasil
    res.status(200).json({ msg: "Update User Berhasil" });
  } catch (error) {
    // Menangani error jika terjadi
    res.status(400).json({ msg: error.message });
  }
};

// Menghapus pengguna
export const deleteUser = async (req, res) => {
  // Mencari pengguna berdasarkan UUID
  const user = await Users.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  // Cek apakah pengguna ditemukan
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  try {
    // Menghapus pengguna dari database
    await Users.destroy({
      where: {
        uuid: user.uuid, // Menghapus pengguna berdasarkan UUID
      },
    });
    // Mengirimkan respons bahwa penghapusan berhasil
    res.status(200).json({ msg: "Delete User Berhasil" });
  } catch (error) {
    // Menangani error jika terjadi
    res.status(400).json({ msg: error.message });
  }
};
