import React, { useState, useEffect } from "react";
import axios from "axios";

const DataAlumni = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheetData, setSheetData] = useState({});
  const [allData, setAllData] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isTabsVisible, setIsTabsVisible] = useState(false);
  const [isDataVisible, setIsDataVisible] = useState(false);
  const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Fetch sheet names once
  useEffect(() => {
    const fetchSheetNames = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${API_KEY}`
        );
        const sheets = response.data.sheets.map(
          (sheet) => sheet.properties.title
        );
        setSheetNames(sheets);
      } catch (error) {
        console.error("Error fetching sheet names:", error);
      }
    };

    fetchSheetNames();
  }, [spreadsheetId, API_KEY]);

  // Fetch data for all sheets
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const allDataTemp = [];
        for (const sheetName of sheetNames) {
          const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${API_KEY}`
          );
          const rows = response.data.values;

          if (rows && rows.length > 1) {
            const header = rows[0];
            const data = rows.slice(1).map((row) => {
              const mappedRow = {};
              header.forEach((key, index) => {
                mappedRow[key.toLowerCase()] = row[index] || "";
              });
              return mappedRow;
            });

            allDataTemp.push(...data);
            setSheetData((prevData) => ({ ...prevData, [sheetName]: data }));
          } else {
            setSheetData((prevData) => ({ ...prevData, [sheetName]: [] }));
          }
        }
        setAllData(allDataTemp);
        setFilteredData(allDataTemp);
      } catch (error) {
        console.error("Error fetching sheet data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sheetNames.length > 0) {
      fetchAllData();
    }
  }, [sheetNames, spreadsheetId, API_KEY]);

  // Update filtered data when the search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {

      setFilteredData(activeTab ? sheetData[activeTab] : []);
      setIsDataVisible(true);
      // setFilteredData([]);
      
    } else {
      // Jika ada pencarian, filter 
      setIsDataVisible(true);
      setFilteredData(
        (activeTab ? sheetData[activeTab] : allData).filter((item) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    }
  }, [searchQuery, activeTab, sheetData, allData]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTabClick = (sheetName) => {
    setActiveTab(sheetName);
    setSearchQuery("");
    setFilteredData(sheetData[sheetName]);
  };

  const handleRowClick = (alumni) => {
    setSelectedAlumni(alumni);
  };

  const closePopup = () => {
    setSelectedAlumni(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <main className="container mx-auto mt-3">
        <section>
          <h2 className="text-xl font-bold mb-4">Cari Nama Alumni</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Masukkan nama..."
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Button for Tabs Collapse */}
          <div className="mb-4">
            <button
              onClick={() => setIsTabsVisible(!isTabsVisible)}
              className={`w-full px-4 py-2 hover:text-tertiary ${
                isTabsVisible ? "text-tertiary" : "text-white"
              } bg-primary rounded-md shadow hover:bg-primary/90 focus:outline-none focus:ring focus:ring-blue-300`}
            >
              {isTabsVisible
                ? "Sembunyikan Tahun Masuk"
                : "Tampilkan Tahun Masuk"}
            </button>
          </div>

          {/* Tabs for Sheets */}
          {isTabsVisible && (
            <ul className="flex flex-wrap justify-center items-center text-sm font-medium text-center text-quaternary border-b border-gray-200">
              {sheetNames.map((sheetName) => (
                <li key={sheetName} className="me-2 mb-2">
                  <a
                    href="#"
                    className={`inline-block p-4 rounded-t-lg ${
                      activeTab === sheetName
                        ? "text-tertiary bg-primary active"
                        : "hover:text-gray-600 bg-secondary dark:hover:text-gray-300"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(sheetName);
                    }}
                  >
                    {sheetName}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
            </div>
          )}

          {/* Display Data as Table */}
          {!loading && isDataVisible && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-quaternary shadow-md rounded-md">
                <thead>
                  <tr className="bg-primary text-quaternary">
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Sex</th>
                    <th className="px-4 py-2">Tahun Masuk</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((alumni, index) => (
                      <tr
                        key={index}
                        className="cursor-pointer hover:bg-secondary hover:text-tertiary text-center"
                        onClick={() => handleRowClick(alumni)}
                      >
                        <td className="border px-4 py-2">{alumni.nama}</td>
                        <td className="border px-4 py-2">{alumni.sex === "L" ? "Laki-laki" : "Perempuan"}</td>
                        <td className="border px-4 py-2">{alumni.thn}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="border px-4 py-2 text-center text-gray-500"
                      >
                        {searchQuery ? "Data tidak ditemukan" : "Belum ada data ditampilkan, silakan cari data atau pilih tahun masuk."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {selectedAlumni && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Detail Alumni
      </h3>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p className="col-span-2 text-lg font-semibold text-gray-900">
          {selectedAlumni.nama}
        </p>
        <p><strong>NIS:</strong></p>
        <p>{selectedAlumni.nis}</p>
        <p><strong>TTL:</strong></p>
        <p>{selectedAlumni.ttl}</p>
        <p><strong>Angkatan:</strong></p>
        <p>{selectedAlumni.thn}</p>
        <p><strong>Kelas:</strong></p>
        <p>{selectedAlumni.kelas}</p>
        <p><strong>Status:</strong></p>
        <p>{selectedAlumni.status}</p>
      </div>
      <button
        className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        onClick={closePopup}
      >
        Tutup
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default DataAlumni;
