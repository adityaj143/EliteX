import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import api from '../utils/api';

const SAMPLE_CSV = `merchant_name,amount,category,usage_frequency,date_started
Netflix,649,Entertainment,sometimes,2023-01-01
Amazon Prime,299,Entertainment,rarely,2023-05-15
Swiggy Instamart,149,Food,daily,2024-02-10
Zepto Pass,99,Food,daily,2024-01-05
Gym Membership,800,Health,rarely,2023-10-01
Gym Membership,800,Health,rarely,2023-11-01
Uber trip,350,Travel,one-time,2024-03-01
Adobe Creative Cloud,2300,Software,daily,2022-06-15
Adobe Creative Cloud,2300,Software,daily,2022-07-15
Jio Postpaid,399,Utilities,daily,2021-04-12
Starbucks,250,Food,one-time,2024-03-05`;

export default function CSVUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_transactions.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const processFile = (selectedFile) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setErrorToast('Please select a valid CSV file');
      setTimeout(() => setErrorToast(''), 3000);
      return;
    }
    
    setFile(selectedFile);
    
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRowCount(results.data.length);
        setPreview(results.data.slice(0, 5));
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', localStorage.getItem('slasher_session_id') || '');

    try {
      await api.post('/api/subscriptions/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (err) {
      setIsUploading(false);
      setErrorToast('Upload failed. Please try again or check the sample CSV format.');
      setTimeout(() => setErrorToast(''), 4000);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">Upload your transaction CSV</h2>
        <p className="text-gray-400 text-lg">We securely analyze your transactions to find recurring charges</p>
      </div>

      {errorToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-slide-up">
          {errorToast}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button 
          onClick={handleDownloadSample}
          className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-medium transition-colors"
        >
          Download Sample CSV
        </button>
      </div>

      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full h-64 border-2 border-dashed border-indigo-500/50 bg-[#12121a] hover:bg-indigo-500/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group overflow-hidden shadow-lg shadow-indigo-500/5"
      >
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        
        <div className="text-5xl mb-4 group-hover:scale-110 group-hover:text-indigo-400 transition-all text-gray-500">
          {file ? '📄' : '📁'}
        </div>
        
        {!file ? (
          <>
            <p className="text-xl font-bold text-white mb-2">Drag & drop your CSV file here</p>
            <p className="text-gray-400">or click to browse</p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-indigo-400 mb-1">{file.name}</p>
            <p className="text-gray-400">Ready to analyze ~{rowCount} rows</p>
          </>
        )}
      </div>

      {file && preview.length > 0 && (
        <div className="mt-8 animate-slide-up bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-4 bg-[#1e1e2e]/50 border-b border-[#1e1e2e]">
            <h3 className="font-semibold text-white">Previewing First 5 Rows</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#12121a] text-xs uppercase text-gray-500 border-b border-[#1e1e2e]">
                <tr>
                  {Object.keys(preview[0]).map(key => (
                    <th key={key} className="px-6 py-3 font-semibold">{key.replace('_', ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-[#1e1e2e] hover:bg-[#1a1a24] transition-colors">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-6 py-3 truncate max-w-[150px]">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {file && (
        <div className="mt-8 flex justify-end animate-slide-up">
          <button 
            disabled={isUploading}
            onClick={handleUpload}
            className={`px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg ring-1 ring-white/20 transition-all ${isUploading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-105'} flex items-center gap-3`}
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Uploading & Analysing...
              </>
            ) : (
              'Upload & Analyse →'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
