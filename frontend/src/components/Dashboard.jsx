
import { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('csv', file);
    try {
      const res = await axios.post('/api/import', formData);
      console.log('Import result:', res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Import Expenses CSV</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Upload CSV
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
