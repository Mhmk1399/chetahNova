'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

interface ImportModalProps {
  onClose: () => void;
  onImportComplete: () => void;
}

export default function ImportModal({ onClose, onImportComplete }: ImportModalProps) {
  const [importType, setImportType] = useState<'crawl' | 'excel'>('crawl');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [excelData, setExcelData] = useState<any[]>([]);
  const [crawlFilters, setCrawlFilters] = useState({ country: '', category: '' });

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(json);
        setError('');
      } catch (err) {
        setError('Failed to read Excel file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportFromCrawl = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/crm/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'crawl',
          filters: crawlFilters
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully imported ${data.results.imported} customers. Skipped ${data.results.skipped} duplicates.`);
        setTimeout(() => {
          onImportComplete();
          onClose();
        }, 2000);
      } else {
        setError(data.error || 'Failed to import');
      }
    } catch (err) {
      setError('Error importing data');
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromExcel = async () => {
    if (excelData.length === 0) {
      setError('Please upload an Excel file first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/crm/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'excel',
          data: excelData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully imported ${data.results.imported} customers. Skipped ${data.results.skipped} duplicates.`);
        setTimeout(() => {
          onImportComplete();
          onClose();
        }, 2000);
      } else {
        setError(data.error || 'Failed to import');
      }
    } catch (err) {
      setError('Error importing data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-start p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Import Customers</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Import Type Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Import Source
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setImportType('crawl')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                  importType === 'crawl'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}
              >
                From Crawled Data
              </button>
              <button
                onClick={() => setImportType('excel')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                  importType === 'excel'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}
              >
                From Excel File
              </button>
            </div>
          </div>

          {/* Import from Crawl */}
          {importType === 'crawl' && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Import all businesses from the crawled data. You can optionally filter by country or category.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={crawlFilters.country}
                  onChange={(e) => setCrawlFilters({ ...crawlFilters, country: e.target.value })}
                  placeholder="Filter by country (optional)"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
                />
                <input
                  type="text"
                  value={crawlFilters.category}
                  onChange={(e) => setCrawlFilters({ ...crawlFilters, category: e.target.value })}
                  placeholder="Filter by category (optional)"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
                />
              </div>
              <button
                onClick={handleImportFromCrawl}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Importing...' : 'Import from Crawled Data'}
              </button>
            </div>
          )}

          {/* Import from Excel */}
          {importType === 'excel' && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Upload an Excel file with columns: Name, Phone, Email, Instagram, Address, Description, Country, Category
              </p>
              <div>
                <label className="block w-full">
                  <div className="w-full px-4 py-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer text-center">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                      className="hidden"
                    />
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {excelData.length > 0
                        ? `✓ Loaded ${excelData.length} rows`
                        : 'Click to upload Excel file'}
                    </p>
                  </div>
                </label>
              </div>
              {excelData.length > 0 && (
                <button
                  onClick={handleImportFromExcel}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Importing...' : `Import ${excelData.length} Customers`}
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
