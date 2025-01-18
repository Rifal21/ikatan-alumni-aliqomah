import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUserGraduate } from 'react-icons/fa';

const DataAlumni = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheetData, setSheetData] = useState({});
  const [visibleData, setVisibleData] = useState([]);
  const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const ITEMS_PER_BATCH = 9;

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
          setVisibleData(data.slice(0, ITEMS_PER_BATCH));
        } else {
          setSheetData((prev) => ({ ...prev, [activeTab]: [] }));
          setFilteredData([]);
          setVisibleData([]);
        }
      } catch (error) {
        console.error('Error fetching sheet data:', error);
        setFilteredData([]);
        setVisibleData([]);
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
      setVisibleData((sheetData[activeTab] || []).slice(0, ITEMS_PER_BATCH));
    } else {
      const filtered = (sheetData[activeTab] || []).filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredData(filtered);
      setVisibleData(filtered.slice(0, ITEMS_PER_BATCH));
    }
  }, [searchQuery, activeTab, sheetData]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setVisibleData((prevVisible) => [
        ...prevVisible,
        ...filteredData.slice(prevVisible.length, prevVisible.length + ITEMS_PER_BATCH),
      ]);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
      <header className="bg-blue-600 text-white text-center py-6 rounded-md shadow-lg">
        <h1 className="text-4xl font-bold tracking-wide">Ikatan Alumni</h1>
      </header>

      <main className="container mx-auto mt-6">
        <section>
          <div className="flex items-center bg-white p-4 rounded-md shadow-md mb-6">
            <FaSearch className="text-gray-500 text-xl mr-3" />
            <input
              type="text"
              placeholder="Masukkan nama alumni..."
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Tabs for Sheets */}
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-600 bg-white shadow-md rounded-md mb-4">
            {sheetNames.map((sheetName) => (
              <li key={sheetName} className="mr-2">
                <button
                  className={`inline-block px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === sheetName
                      ? 'text-white bg-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(sheetName)}
                >
                  {sheetName}
                </button>
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
              {visibleData.length > 0 ? (
                visibleData.map((alumni, index) => (
                  <div key={index} className="bg-white shadow-lg rounded-lg p-6 transition-all duration-200 hover:shadow-xl">
                    <div className="flex items-center mb-4">
                      <FaUserGraduate className="text-blue-600 text-2xl mr-4" />
                      <h3 className="font-semibold text-xl">Alumni {index + 1}</h3>
                    </div>
                    <p className="text-gray-700 mb-2"><strong>Nama:</strong> {alumni.nama}</p>
                    <p className="text-gray-700 mb-2"><strong>NIS:</strong> {alumni.nis}</p>
                    <p className="text-gray-700 mb-2"><strong>TTL:</strong> {alumni.ttl}</p>
                    <p className="text-gray-700 mb-2"><strong>Angkatan:</strong> {alumni.thn}</p>
                    <p className="text-gray-700 mb-2"><strong>Kelas:</strong> {alumni.kelas}</p>
                    <p className="text-gray-700"><strong>Status:</strong> <span className='text-blue-600 font-medium'>{alumni.status}</span></p>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500">Tidak ada data ditemukan.</p>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-blue-600 text-white text-center py-6 mt-6 rounded-md shadow-lg">
        <p>&copy; 2025 Ikatan Alumni. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DataAlumni;
