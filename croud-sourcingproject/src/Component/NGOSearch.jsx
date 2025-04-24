import React, { useState } from "react";

const NGOSearch = () => {
  const [query, setQuery] = useState("");
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNGOs = async () => {
    if (!query.trim()) return; // Agar query blank ho to fetch na kare
    setLoading(true);

    try {
      const response = await fetch(
        `https://ngodarpan.gov.in/index.php/ajaxcontroller/searchDataByName?name=${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setNgos(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Search NGOs in India</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter NGO Name"
          className="border p-2 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchNGOs}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {ngos.length > 0 && (
        <ul className="mt-4 bg-gray-100 p-4 rounded">
          {ngos.map((ngo, index) => (
            <li key={index} className="p-2 border-b">
              <strong>{ngo.name}</strong> - {ngo.state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NGOSearch;
