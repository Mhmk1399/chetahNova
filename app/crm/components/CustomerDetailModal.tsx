'use client';

import { useState } from 'react';

interface CustomerDetailProps {
  customer: any;
  onClose: () => void;
  onUpdate: () => void;
}

const STATUSES = [
  { value: 'new', label: 'جدید' },
  { value: 'contacted', label: 'تماس گرفته شده' },
  { value: 'interested', label: 'علاقمند' },
  { value: 'not_interested', label: 'علاقه ندارد' },
  { value: 'meeting_scheduled', label: 'جلسه تنظیم شده' },
  { value: 'proposal_sent', label: 'پیشنهاد ارسال شده' },
  { value: 'negotiation', label: 'در حال مذاکره' },
  { value: 'won', label: 'موفق' },
  { value: 'lost', label: 'ناموفق' },
];

const CONTACT_TYPES = [
  { value: 'call', label: 'تماس تلفنی' },
  { value: 'message', label: 'پیام' },
  { value: 'email', label: 'ایمیل' },
  { value: 'meeting', label: 'جلسه حضوری' },
];

export default function CustomerDetailModal({ customer, onClose, onUpdate }: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'notes' | 'contact'>('info');
  const [status, setStatus] = useState(customer.status);
  const [newNote, setNewNote] = useState('');
  const [newContact, setNewContact] = useState({ type: 'call', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crm/customers/${customer._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-customer-id': customer._id
        },
        body: JSON.stringify({
          action: 'update_status',
          data: { status: newStatus }
        }),
      });

      if (response.ok) {
        setStatus(newStatus);
        onUpdate();
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/crm/customers/${customer._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-customer-id': customer._id
        },
        body: JSON.stringify({
          action: 'add_note',
          data: { content: newNote }
        }),
      });

      if (response.ok) {
        setNewNote('');
        onUpdate();
      } else {
        setError('Failed to add note');
      }
    } catch (err) {
      setError('Error adding note');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.notes.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/crm/customers/${customer._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-customer-id': customer._id
        },
        body: JSON.stringify({
          action: 'add_contact',
          data: newContact
        }),
      });

      if (response.ok) {
        setNewContact({ type: 'call', notes: '' });
        onUpdate();
      } else {
        setError('Failed to add contact history');
      }
    } catch (err) {
      setError('Error adding contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-zinc-200 dark:border-zinc-700">
          <div>
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">{customer.name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{customer.phoneNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Status Selector */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            وضعیت مشتری
          </label>
          <select
            value={status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            اطلاعات
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            یادداشت‌ها ({customer.notes.length})
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            تاریخچه تماس ({customer.contactHistory.length})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    نام
                  </label>
                  <p className="text-zinc-900 dark:text-zinc-100">{customer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    تلفن
                  </label>
                  <p className="text-zinc-900 dark:text-zinc-100">{customer.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    ایمیل
                  </label>
                  <p className="text-zinc-900 dark:text-zinc-100">{customer.email || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    اینستاگرام
                  </label>
                  <p className="text-zinc-900 dark:text-zinc-100">{customer.instagram || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    کشور
                  </label>
                  <p className="text-zinc-900 dark:text-zinc-100">{customer.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    منبع
                  </label>
                  <p className="text-zinc-900 dark:text-zinc-100">{customer.source}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  آدرس
                </label>
                <p className="text-zinc-900 dark:text-zinc-100">{customer.address || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  توضیحات
                </label>
                <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{customer.description || '-'}</p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="یادداشت جدید اضافه کنید..."
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100 min-h-[100px]"
                />
                <button
                  onClick={handleAddNote}
                  disabled={loading || !newNote.trim()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'در حال افزودن...' : 'افزودن یادداشت'}
                </button>
              </div>

              <div className="space-y-3">
                {customer.notes.map((note: any, index: number) => (
                  <div key={index} className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4">
                    <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                      {new Date(note.createdAt).toLocaleString('fa-IR')}
                    </p>
                  </div>
                ))}
                {customer.notes.length === 0 && (
                  <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
                    هیچ یادداشتی ثبت نشده است
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 space-y-3">
                <select
                  value={newContact.type}
                  onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {CONTACT_TYPES.map(ct => (
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  ))}
                </select>
                <textarea
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  placeholder="جزئیات تماس..."
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100 min-h-[80px]"
                />
                <button
                  onClick={handleAddContact}
                  disabled={loading || !newContact.notes.trim()}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'در حال افزودن...' : 'ثبت تماس'}
                </button>
              </div>

              <div className="space-y-3">
                {customer.contactHistory.map((contact: any, index: number) => (
                  <div key={index} className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {CONTACT_TYPES.find(ct => ct.value === contact.type)?.label || contact.type}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(contact.date).toLocaleString('fa-IR')}
                      </span>
                    </div>
                    <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                ))}
                {customer.contactHistory.length === 0 && (
                  <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
                    هیچ تماسی ثبت نشده است
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
