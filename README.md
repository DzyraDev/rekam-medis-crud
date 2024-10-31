# rekam-medis-crud

Features

-   CRUD Users (Admin, Dokter and Pasie)
-   CRUD Antrian (CRUD Antrian)
-   CRUD Dokter 
-   CRUD Pasien 
-   CRUD Rekam Medis 

## Cara Install di Local

-   Hal yang harus dipersiapkan
    -   git
    -   Nodejs versi 20
    -   Yarn / NPM
    -   Postgreesql 16

# clone terlebih dahulu lewat cli (cmd, bash, atau yg lain)
https://github.com/DzyraDev/rekam-medis-crud/


# masuk ke foldernya
cd rekam-medis-crud


setelah itu, buat database pada pgadmin4(postgreesql) dengan nama database yang sama seperti file Database.js (db_rekam_medis) dan sesuaikan username dan passwordnya sesuai setingan database anda

 lalu buka terminal ketikkan 

-cd backend

setelah itu jalankan perintah nodemon index untuk menjalankan backend dan migrasi model ke database postgree

lalu buka terminal kedua ketikkan 

cd fe-medis

setelah itu jalankan perintah yarn install lalu jalankan yarn start  lalu buka browser dengan url: http://localhost:3000/

untuk login dengan admin pertama buka postman terlebih dahulu dan isikan body seperti dibawah ini pada url http://localhost:5000/register dengan method POST:
```
 {
     "name": "admin",
     "email": "admin@gmail.com",
     "password": "admin",
     "confPassword": "admin",
     "role": "admin"
 }


 Setelah register berhasil silahkan login pada http://localhost3000/login dengan email dan password dibawah ini:
 
    "email": "admin@gmail.com",
    "password": "admin"

```
