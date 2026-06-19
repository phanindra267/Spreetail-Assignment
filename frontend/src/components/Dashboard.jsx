
import { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('csv', file);
    try {
      setLoading(true);
      const res = await axios.post('/api/import', formData);
      setImportResult(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </form>

        {importResult && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Import Result</h3>
            <p>Total Rows Processed: {importResult.totalRows}</p>
            <p>Anomalies Detected: {importResult.anomalies.length}</p>

            {importResult.anomalies.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Anomalies:</h4>
                <ul className="space-y-2">
                  {importResult.anomalies.map((anomaly, i) => (
                    <li key={i} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <strong>Row {anomaly.rowNumber}:</strong> {anomaly.description}
                      <span className="ml-2 text-sm text-gray-600">
                        (Action: {anomaly.action})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
