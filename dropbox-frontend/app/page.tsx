'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type File = {
  _id: string;
  name: string;
  path: string;
  status: string;
  createdAt: string;
  metadata: {
    rowCount: number;
    headers: string[];
    preview: Record<string, string>[];
  };
};

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:4000/api/files')
      .then((res) => res.json())
      .then((data) => setFiles(data.files || []))
      .catch((err) => console.error('Failed to load files:', err));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📁 Dropbox CSV Files</h1>
      <table className="min-w-full table-auto border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Path</th>
            <th className="border px-3 py-2 text-left">Rows</th>
            <th className="border px-3 py-2 text-left">Headers</th>
            <th className="border px-3 py-2 text-left">Status</th>
            <th className="border px-3 py-2 text-left">Created At</th>
            <th className="border px-3 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={file._id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{file.name}</td>
              <td className="border px-3 py-2">{file.path}</td>
              <td className="border px-3 py-2">{file.metadata?.rowCount ?? '-'}</td>
              <td className="border px-3 py-2">{file.metadata?.headers?.join(', ') ?? '-'}</td>
              <td className="border px-3 py-2">{file.status}</td>
              <td className="border px-3 py-2">{new Date(file.createdAt).toLocaleString()}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => router.push(`/file/${file._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
