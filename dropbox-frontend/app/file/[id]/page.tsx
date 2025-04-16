'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type File = {
  _id: string;
  name: string;
  path: string;
  metadata: {
    rowCount: number;
    headers: string[];
    preview: Record<string, string>[];
  };
};

export default function FileDetailPage() {
  const params = useParams();
  const id = params?.id?.toString(); // Ensure it's a string

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:4000/api/files/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setFile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !file) return <p>Something went wrong or file not found.</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📄 {file.name}</h1>
      <p className="text-gray-700">📁 Path: {file.path}</p>
      <p className="text-gray-700">🧾 Rows: {file.metadata?.rowCount}</p>
      <p className="text-gray-700 mb-4">
        🧠 Headers: {file.metadata?.headers?.join(', ') || '-'}
      </p>

      <h2 className="font-semibold mb-2">🔍 Preview</h2>
      <pre className="bg-gray-100 text-sm p-4 rounded overflow-x-auto">
        {JSON.stringify(file.metadata?.preview, null, 2)}
      </pre>
    </main>
  );
}
