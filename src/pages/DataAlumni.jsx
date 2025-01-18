import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataAlumni = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheetData, setSheetData] = useState({});
  const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Fetch sheet names once
  useEffect(() => {
    const fetchSheetNames = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${API_KEY}`
        );
        const sheets = response.data.sheets.map(sheet => sheet.properties.title);
        setSheetNames(sheets);
        setActiveTab(sheets[0]); // Set first sheet as the default active tab
      } catch (error) {
        console.error('Error fetching sheet names:', error);
      }
    };

    fetchSheetNames();
  }, [spreadsheetId, API_KEY]);

  // Fetch data for the active sheet (only once)
  useEffect(() => {
    const fetchSheetData = async () => {
      if (!activeTab || sheetData[activeTab]) return; // Skip if data is already loaded

      setLoading(true);
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${activeTab}?key=${API_KEY}`
        );

        const rows = response.data.values;
        if (rows && rows.length > 1) {
          const header = rows[0];
          const data = rows.slice(1).map((row) => {
            const mappedRow = {};
            header.forEach((key, index) => {
              mappedRow[key.toLowerCase()] = row[index] || '';
            });
            return mappedRow;
          });

          setSheetData((prev) => ({ ...prev, [activeTab]: data }));
          setFilteredData(data);
        } else {
          setSheetData((prev) => ({ ...prev, [activeTab]: [] }));
          setFilteredData([]);
        }
      } catch (error) {
        console.error('Error fetching sheet data:', error);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, [activeTab, spreadsheetId, API_KEY, sheetData]);

  // Update filtered data when the search query or active tab changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(sheetData[activeTab] || []);
    } else {
      setFilteredData(
        (sheetData[activeTab] || []).filter((item) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    }
  }, [searchQuery, activeTab, sheetData]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-blue-600 text-white text-center py-4">
        <h1 className="text-3xl font-bold">Ikatan Alumni</h1>
      </header>

      <main className="container mx-auto mt-6">
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

          {/* Tabs for Sheets */}
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
            {sheetNames.map((sheetName) => (
              <li key={sheetName} className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === sheetName
                      ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
                      : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(sheetName);
                  }}
                >
                  {sheetName}
                </a>
              </li>
            ))}
          </ul>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
          )}

          {/* Display Data */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredData.length > 0 ? (
                filteredData.map((alumni, index) => (
                  <div key={index} className="bg-white shadow-md rounded-md p-4">
                    <h3 className="font-semibold text-xl mb-2">Alumni {index + 1}</h3>
                    <p className="text-gray-700 mb-1"><strong>Nama:</strong> {alumni.nama}</p>
                    <p className="text-gray-700 mb-1"><strong>NIS:</strong> {alumni.nis}</p>
                    <p className="text-gray-700 mb-1"><strong>TTL:</strong> {alumni.ttl}</p>
                    <p className="text-gray-700 mb-1"><strong>Angkatan:</strong> {alumni.thn}</p>
                    <p className="text-gray-700 mb-1"><strong>Kelas:</strong> {alumni.kelas}</p>
                    <p className="text-gray-700 mb-1"><strong>Status:</strong><span className='badge ml-2'>{alumni.status}</span></p>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500">Tidak ada data ditemukan.</p>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-blue-600 text-white text-center py-4 mt-6">
        <p>&copy; 2025 Ikatan Alumni. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DataAlumni;
