'use client';

import { useState } from 'react';
import Image from 'next/image';import Link from 'next/link';
const CATEGORIES = [
  { value: 'buildingServices', label: 'خدمات ساختمانی' },
  { value: 'education', label: 'آموزش' },
  { value: 'realState', label: 'مشاور املاک' },
  { value: 'cosmetic', label: 'آرایش و زیبایی' },
  { value: 'healthcare&beauty', label: 'پزشکی و سلامت' },
  { value: 'dentists', label: 'دندان پزشکی' },
  { value: 'pets', label: 'خدمات پت' },
  { value: 'marketings', label: 'مارکتینگ' },
  { value: 'sweets', label: 'شیرینی و خشکبار' },
  { value: 'resturants', label: 'رستوران و کیترینگ' },
  { value: 'other', label: 'سایر مشاغل' },
  { value: 'insurance', label: 'بیمه' },
  { value: 'contentcreation', label: 'عکس و فیلم' },
  { value: 'homeStaffs', label: 'لوازم منزل' },
  { value: 'cars', label: 'اتومبیل' },
  { value: 'finance', label: 'وام و مورگج' },
  { value: 'transportation', label: 'حمل و نقل' },
  { value: 'clothes', label: 'لباس و زیورآلات' },
  { value: 'imagination', label: 'خدمات مهاجرتی' },
  { value: 'music', label: 'موسیقی' },
  { value: 'exchange', label: 'صرافی' },
  { value: 'foodsuply', label: 'مواد غذایی' },
  { value: 'accountant', label: 'حسابداری' },
  { value: 'lawer', label: 'وکیل و خدمات حقوقی' },
  { value: 'athlit', label: 'ورزش' },
  { value: 'tourism', label: 'خدمات مسافرتی' },
  { value: 'flowe', label: 'گلفروشی' },
  { value: 'supermarket', label: 'سوپرمارکت' },
];

interface CrawlResult {
  url: string;
  businesses: BusinessData[];
  count: number;
  totalPages?: number;
  pagesCrawled?: number;
  crawledAt: string;
}

interface BusinessData {
  name: string;
  phoneNumber: string;
  instagram: string;
  address: string;
  email: string;
  description: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [selectedBusinesses, setSelectedBusinesses] = useState<number[]>([]);
  const [crawlAllPages, setCrawlAllPages] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');

  const handleCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setSaveSuccess('');
    setCrawlProgress('');

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, crawlAllPages }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to crawl');
      }

      setResult(data);
      // Select all businesses by default
      if (data.businesses) {
        setSelectedBusinesses(data.businesses.map((_: any, index: number) => index));
      }
      
      if (data.totalPages > 1) {
        setCrawlProgress(`Crawled ${data.totalPages} pages successfully`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result || !result.businesses) return;
    
    if (selectedBusinesses.length === 0) {
      setError('Please select at least one business to save');
      return;
    }
    
    // Show modal to get country and category
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (!result || !result.businesses) return;
    
    if (!country.trim()) {
      setError('Please enter a country');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }

    setSaving(true);
    setError('');
    setSaveSuccess('');
    setShowSaveModal(false);

    try {
      // Get selected businesses to save
      const businessesToSave = selectedBusinesses.map(index => result.businesses[index]);

      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businesses: businessesToSave,
          country: country.trim(),
          category: category,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      setSaveSuccess(`Successfully saved ${data.saved} of ${data.total} businesses to database!`);
      if (data.errors && data.errors.length > 0) {
        setError(`Some businesses failed to save: ${data.errors.map((e: any) => e.name).join(', ')}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const toggleBusinessSelection = (index: number) => {
    setSelectedBusinesses(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    if (result && selectedBusinesses.length === result.businesses.length) {
      setSelectedBusinesses([]);
    } else if (result) {
      setSelectedBusinesses(result.businesses.map((_, index) => index));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex w-full max-w-6xl flex-col gap-8 py-16 px-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1"></div>
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={24}
              priority
            />
            <div className="flex-1 flex justify-end">
              <Link
                href="/crm"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                CRM مدیریت مشتریان
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
            Business Data Crawler
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-center">
            Enter a URL to extract business information
          </p>
        </div>

        <form onSubmit={handleCrawl} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="url" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Website URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-white font-medium transition-colors hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Crawling...' : 'Start Crawl'}
            </button>
          </form>
  
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
              {error}
            </div>
          )}
  
          {saveSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
              {saveSuccess}
            </div>
          )}
  
          {result && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black dark:text-zinc-50">
                Extracted Data ({result.count} businesses found{result.totalPages && result.totalPages > 1 ? ` across ${result.totalPages} pages` : ''})
                </h2>
                <div className="flex gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-600 px-4 text-white text-sm font-medium transition-colors hover:bg-zinc-700"
                >
                  {selectedBusinesses.length === result.businesses.length ? 'Deselect All' : 'Select All'}
                </button>
                <Link
                  href="/crm"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 text-white text-sm font-medium transition-colors hover:bg-purple-700"
                >
                  View in CRM
                </Link>
                <button
                  onClick={handleSave}
                  disabled={saving || selectedBusinesses.length === 0}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 text-white font-medium transition-colors hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : `Save Selected (${selectedBusinesses.length})`}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={selectedBusinesses.length === result.businesses.length && result.businesses.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">#</th>
                    <th className="px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Name</th>
                    <th className="px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Phone</th>
                    <th className="px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Instagram</th>
                    <th className="px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Address</th>
                    <th className="px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email</th>
                    <th className="px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {result.businesses.map((business, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${selectedBusinesses.includes(index) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedBusinesses.includes(index)}
                          onChange={() => toggleBusinessSelection(index)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-black dark:text-zinc-100 font-medium">{business.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-black dark:text-zinc-100">
                        {business.phoneNumber ? (
                          <a href={`tel:${business.phoneNumber}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                            {business.phoneNumber}
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-black dark:text-zinc-100">
                        {business.instagram ? (
                          business.instagram.startsWith('@') ? (
                            <a href={`https://instagram.com/${business.instagram.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                              {business.instagram}
                            </a>
                          ) : (
                            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                              {business.instagram}
                            </a>
                          )
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-black dark:text-zinc-100 max-w-xs truncate">{business.address || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-black dark:text-zinc-100">
                        {business.email ? (
                          <a href={`mailto:${business.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                            {business.email}
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-black dark:text-zinc-100 max-w-xs truncate">{business.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              Crawled at: {new Date(result.crawledAt).toLocaleString()}
            </div>
          </div>
        )}
      </main>
      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">Save Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country (e.g., Toronto)"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}    </div>
  );
}
