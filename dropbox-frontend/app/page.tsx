'use client';

import { useEffect, useState } from 'react';

interface FileData {
  name: string;
  path: string;
  size?: number;
  uploadedAt?: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('uploadedAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/files?page=${page}&limit=5&search=${search}&sort=${sort}&order=${order}`
      );
      const data = await res.json();
      setFiles(data.files || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      setFiles([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchFiles();
      setLoading(false);
    };
    loadData();
  }, [page, search, sort, order]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">📁 Dropbox File Monitor</h1>

      {/* Search + Sort Controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by file name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="name">Name</option>
          <option value="size">Size</option>
          <option value="uploadedAt">Uploaded Date</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
          className="border px-3 py-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-300 shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Path</th>
                <th className="border px-4 py-2 text-left">Size (bytes)</th>
                <th className="border px-4 py-2 text-left">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{file.name}</td>
                  <td className="border px-4 py-2">{file.path}</td>
                  <td className="border px-4 py-2">{file.size ?? 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {file.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              ◀ Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </main>
  );
}
