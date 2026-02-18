"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CustomerDetailModal from "./components/CustomerDetailModal";
import ImportModal from "./components/ImportModal";

const CATEGORIES = [
  { value: "buildingServices", label: "خدمات ساختمانی" },
  { value: "education", label: "آموزش" },
  { value: "realState", label: "مشاور املاک" },
  { value: "cosmetic", label: "آرایش و زیبایی" },
  { value: "healthcare&beauty", label: "پزشکی و سلامت" },
  { value: "dentists", label: "دندان پزشکی" },
  { value: "pets", label: "خدمات پت" },
  { value: "marketings", label: "مارکتینگ" },
  { value: "sweets", label: "شیرینی و خشکبار" },
  { value: "resturants", label: "رستوران و کیترینگ" },
  { value: "other", label: "سایر مشاغل" },
  { value: "insurance", label: "بیمه" },
  { value: "contentcreation", label: "عکس و فیلم" },
  { value: "homeStaffs", label: "لوازم منزل" },
  { value: "cars", label: "اتومبیل" },
  { value: "finance", label: "وام و مورگج" },
  { value: "transportation", label: "حمل و نقل" },
  { value: "clothes", label: "لباس و زیورآلات" },
  { value: "imagination", label: "خدمات مهاجرتی" },
  { value: "music", label: "موسیقی" },
  { value: "exchange", label: "صرافی" },
  { value: "foodsuply", label: "مواد غذایی" },
  { value: "accountant", label: "حسابداری" },
  { value: "lawer", label: "وکیل و خدمات حقوقی" },
  { value: "athlit", label: "ورزش" },
  { value: "tourism", label: "خدمات مسافرتی" },
  { value: "flowe", label: "گلفروشی" },
  { value: "supermarket", label: "سوپرمارکت" },
];

const STATUSES = [
  {
    value: "new",
    label: "جدید",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    value: "contacted",
    label: "تماس گرفته شده",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    value: "interested",
    label: "علاقمند",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    value: "not_interested",
    label: "علاقه ندارد",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    value: "meeting_scheduled",
    label: "جلسه تنظیم شده",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    value: "proposal_sent",
    label: "پیشنهاد ارسال شده",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  {
    value: "negotiation",
    label: "در حال مذاکره",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    value: "won",
    label: "موفق",
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  {
    value: "lost",
    label: "ناموفق",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
];

interface Customer {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  instagram?: string;
  address?: string;
  description?: string;
  country: string;
  category: string;
  status: string;
  source: string;
  notes: Array<{ content: string; createdAt: string }>;
  contactHistory: Array<{ date: string; type: string; notes: string }>;
  lastContactedAt?: string;
  createdAt: string;
}

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<"crawl" | "excel">("crawl");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [addingNoteFor, setAddingNoteFor] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter, categoryFilter, page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("category", categoryFilter);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("limit", itemsPerPage.toString());

      const response = await fetch(`/api/crm/customers?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCustomers(data.customers);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.total);
        }
      } else {
        setError(data.error || "Failed to fetch customers");
      }
    } catch (err) {
      setError("Error loading customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const getStatusLabel = (status: string) => {
    return STATUSES.find((s) => s.value === status)?.label || status;
  };

  const getStatusColor = (status: string) => {
    return (
      STATUSES.find((s) => s.value === status)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const handleStatusChange = async (customerId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/crm/customers/${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-customer-id": customerId,
        },
        body: JSON.stringify({
          action: "update_status",
          data: { status: newStatus },
        }),
      });

      if (response.ok) {
        fetchCustomers();
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      setError("Error updating status");
    }
  };

  const handleAddNote = async (customerId: string) => {
    if (!newNoteText.trim()) return;

    try {
      const response = await fetch(`/api/crm/customers/${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-customer-id": customerId,
        },
        body: JSON.stringify({
          action: "add_note",
          data: { content: newNoteText },
        }),
      });

      if (response.ok) {
        setNewNoteText("");
        setAddingNoteFor(null);
        fetchCustomers();
      } else {
        setError("Failed to add note");
      }
    } catch (err) {
      setError("Error adding note");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
              مدیریت مشتریان CRM
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Sales Customer Relationship Management
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              بازگشت به خانه
            </Link>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Import Data
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو (نام، تلفن، ایمیل)"
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
              >
                <option value="">همه وضعیت‌ها</option>
                {STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
              >
                <option value="">همه دسته‌ها</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                جستجو
              </button>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              کل مشتریان
            </div>
            <div className="text-2xl font-bold text-black dark:text-zinc-50">
              {customers.length}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">جدید</div>
            <div className="text-2xl font-bold text-blue-600">
              {customers.filter((c) => c.status === "new").length}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              علاقمند
            </div>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter((c) => c.status === "interested").length}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">موفق</div>
            <div className="text-2xl font-bold text-emerald-600">
              {customers.filter((c) => c.status === "won").length}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Customer List */}
        {loading ? (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              در حال بارگذاری...
            </p>
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              هیچ مشتری‌ای یافت نشد
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      #
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      نام
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      تلفن
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      دسته
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      کشور
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      یادداشت‌ها
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {customers.map((customer, index) => (
                    <tr
                      key={customer._id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-4 py-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                        {(page - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {customer.phoneNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {getCategoryLabel(customer.category)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {customer.country}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={customer.status}
                          onChange={(e) =>
                            handleStatusChange(customer._id, e.target.value)
                          }
                          className={`px-2 py-1 text-xs rounded border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(customer.status)}`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {customer.notes.length > 0 && (
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xs">
                              <div className="font-medium mb-1">
                                آخرین یادداشت:
                              </div>
                              <div className="truncate">
                                {
                                  customer.notes[customer.notes.length - 1]
                                    .content
                                }
                              </div>
                              <div
                                className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline mt-1"
                                onClick={() => setSelectedCustomer(customer)}
                              >
                                ({customer.notes.length} یادداشت)
                              </div>
                            </div>
                          )}
                          {addingNoteFor === customer._id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                                placeholder="یادداشت جدید..."
                                className="flex-1 px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-zinc-100"
                                onKeyPress={(e) =>
                                  e.key === "Enter" &&
                                  handleAddNote(customer._id)
                                }
                              />
                              <button
                                onClick={() => handleAddNote(customer._id)}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setAddingNoteFor(null);
                                  setNewNoteText("");
                                }}
                                className="px-2 py-1 bg-zinc-600 text-white text-xs rounded hover:bg-zinc-700"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingNoteFor(customer._id)}
                              className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                              + افزودن یادداشت
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          مشاهده
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  نمایش {(page - 1) * itemsPerPage + 1} تا{" "}
                  {Math.min(page * itemsPerPage, totalCount)} از {totalCount}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    «
                  </button>
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    ‹
                  </button>
                  <span className="px-3 py-1 text-sm text-zinc-700 dark:text-zinc-300">
                    صفحه {page} از {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={fetchCustomers}
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={fetchCustomers}
        />
      )}
    </div>
  );
}
