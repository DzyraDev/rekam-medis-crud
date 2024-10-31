import React, { useEffect, useState } from "react";
import axios from "axios";

const RekamMedisPrint = ({ match }) => {
  const [rekamMedis, setRekamMedis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRekamMedis = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/rekam-medis/${match.params.id}`
        );
        setRekamMedis(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRekamMedis();
  }, [match.params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!rekamMedis) {
    return <div>No record found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Detail Rekam Medis</h1>
      <p>
        <strong>Diagnosa:</strong> {rekamMedis.diagnosa}
      </p>
      <p>
        <strong>Resep:</strong> {rekamMedis.resep}
      </p>
      <p>
        <strong>Catatan:</strong> {rekamMedis.catatan}
      </p>
      <p>
        <strong>Tanggal:</strong>{" "}
        {new Date(rekamMedis.tanggal).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <p>
        <strong>Nama Pasien:</strong> {rekamMedis.nama_pasien}
      </p>
      <p>
        <strong>Nama Dokter:</strong> {rekamMedis.nama_dokter}
      </p>
      <button
        onClick={() => window.print()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Print
      </button>
    </div>
  );
};

export default RekamMedisPrint;
