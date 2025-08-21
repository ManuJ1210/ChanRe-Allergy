import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ReceptionistLayout from './ReceptionistLayout';
import { fetchReceptionistBillingRequests, generateReceptionistBill, markReceptionistBillPaid } from '../../features/receptionist/receptionistThunks';
import { Search, Filter, Plus, CheckCircle, FileText, IndianRupee, Hash, X } from 'lucide-react';

const currencySymbol = '₹';

export default function ReceptionistBilling() {
  const dispatch = useDispatch();
  const { billingRequests, loading } = useSelector((s) => s.receptionist);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([{ name: '', code: '', quantity: 1, unitPrice: 0 }]);
  const [taxes, setTaxes] = useState(0);
  const [discounts, setDiscounts] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(fetchReceptionistBillingRequests());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (billingRequests || [])
      .filter(r => status === 'all' || r.status === status)
      .filter(r => !term || 
        `${r.patientId?.name || r.patientName || ''} ${r.doctorId?.name || r.doctorName || ''} ${r.testType || ''}`.toLowerCase().includes(term));
  }, [billingRequests, search, status]);

  const subTotal = items.reduce((s, it) => s + (Number(it.quantity || 0) * Number(it.unitPrice || 0)), 0);
  const grandTotal = Math.max(0, subTotal + Number(taxes || 0) - Number(discounts || 0));

  const openBillModal = (req) => {
    setSelected(req);
    if (req.billing?.items?.length) {
      setItems(req.billing.items.map(it => ({ name: it.name, code: it.code, quantity: it.quantity, unitPrice: it.unitPrice })));
      setTaxes(req.billing.taxes || 0);
      setDiscounts(req.billing.discounts || 0);
      setNotes(req.billing.notes || '');
    } else {
      setItems([{ name: req.testType || '', code: '', quantity: 1, unitPrice: 0 }]);
      setTaxes(0);
      setDiscounts(0);
      setNotes('');
    }
  };

  const closeBillModal = () => {
    setSelected(null);
  };

  const updateItem = (idx, patch) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const addItem = () => setItems(prev => [...prev, { name: '', code: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleGenerate = async () => {
    if (!selected) return;
    const payload = { items, taxes: Number(taxes || 0), discounts: Number(discounts || 0), currency: 'INR', notes };
    try {
      await dispatch(generateReceptionistBill({ requestId: selected._id, payload })).unwrap();
      toast.success('Bill generated');
      closeBillModal();
      dispatch(fetchReceptionistBillingRequests());
    } catch (e) {
      toast.error(e || 'Failed to generate bill');
    }
  };

  const handleMarkPaid = async (req) => {
    try {
      await dispatch(markReceptionistBillPaid({ requestId: req._id, paymentNotes: 'Paid at desk' })).unwrap();
      toast.success('Marked as paid');
      dispatch(fetchReceptionistBillingRequests());
    } catch (e) {
      toast.error(e || 'Failed to mark paid');
    }
  };

  return (
    <ReceptionistLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800">Billing</h1>
            <p className="text-slate-600">Generate invoices for doctor test requests and mark payments.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg" placeholder="Search patient, doctor or test" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="px-3 py-2 border border-slate-300 rounded-lg" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="Billing_Pending">Billing Pending</option>
                <option value="Billing_Generated">Billing Generated</option>
                <option value="Billing_Paid">Billing Paid</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Age/Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Test</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(filtered || []).map(req => (
                    <tr key={req._id}>
                      <td className="px-4 py-3 text-sm">{req.patientId?.name || req.patientName || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">{req.patientId?.phone || req.patientphone || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        {req.patientId?.age || req.patientAge || 'N/A'} / {req.patientId?.gender || req.patientGender || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">{req.doctorId?.name || req.doctorName || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">{req.testType || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs border">
                          {req.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {typeof req.billing?.amount === 'number' ? `${currencySymbol}${req.billing.amount.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        {req.status === 'Billing_Pending' && (
                          <button onClick={() => openBillModal(req)} className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-xs">
                            <Plus className="h-3 w-3 mr-1" /> Generate Bill
                          </button>
                        )}
                        {req.status === 'Billing_Generated' && (
                          <>
                            <button onClick={() => openBillModal(req)} className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">
                              <FileText className="h-3 w-3 mr-1" /> View/Edit Bill
                            </button>
                            <button onClick={() => handleMarkPaid(req)} className="inline-flex items-center px-3 py-1 bg-emerald-600 text-white rounded-md text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" /> Mark Paid
                            </button>
                          </>
                        )}
                        {req.status === 'Billing_Paid' && (
                          <span className="inline-flex items-center text-emerald-700 text-xs">
                            <CheckCircle className="h-4 w-4 mr-1" /> Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selected && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
              <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg">
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Generate Invoice</div>
                    <div className="font-semibold text-slate-800">{selected.patientId?.name || selected.patientName || 'N/A'} - {selected.testType || 'N/A'}</div>
                  </div>
                  <button onClick={closeBillModal} className="p-1 rounded hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="text-left text-xs text-slate-500">
                          <th className="py-2">Item</th>
                          <th className="py-2">Code</th>
                          <th className="py-2">Qty</th>
                          <th className="py-2">Unit Price</th>
                          <th className="py-2">Total</th>
                          <th className="py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, idx) => (
                          <tr key={idx} className="text-sm">
                            <td className="py-2 pr-2"><input className="w-full border px-2 py-1 rounded" value={it.name} onChange={(e) => updateItem(idx, { name: e.target.value })} placeholder="Item name" /></td>
                            <td className="py-2 pr-2"><input className="w-full border px-2 py-1 rounded" value={it.code} onChange={(e) => updateItem(idx, { code: e.target.value })} placeholder="Code" /></td>
                            <td className="py-2 pr-2"><input type="number" className="w-20 border px-2 py-1 rounded" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} min={1} /></td>
                            <td className="py-2 pr-2"><input type="number" className="w-28 border px-2 py-1 rounded" value={it.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })} min={0} step="0.01" /></td>
                            <td className="py-2 pr-2">{currencySymbol}{(Number(it.quantity || 0) * Number(it.unitPrice || 0)).toFixed(2)}</td>
                            <td className="py-2"><button onClick={() => removeItem(idx)} className="text-red-600 text-xs">Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button onClick={addItem} className="mt-2 inline-flex items-center px-3 py-1 bg-slate-100 rounded text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Add Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-500">Taxes</label>
                      <input type="number" className="w-full border px-2 py-1 rounded" value={taxes} onChange={(e) => setTaxes(Number(e.target.value))} min={0} step="0.01" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Discounts</label>
                      <input type="number" className="w-full border px-2 py-1 rounded" value={discounts} onChange={(e) => setDiscounts(Number(e.target.value))} min={0} step="0.01" />
                    </div>
                    <div className="flex items-end">
                      <div className="w-full bg-slate-50 border rounded px-3 py-2 text-sm font-medium">Grand Total: {currencySymbol}{grandTotal.toFixed(2)}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500">Notes</label>
                    <textarea className="w-full border px-2 py-1 rounded" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
                  </div>
                </div>
                <div className="p-4 border-t flex items-center justify-end gap-2">
                  <button onClick={closeBillModal} className="px-3 py-2 text-sm rounded bg-slate-100">Cancel</button>
                  <button onClick={handleGenerate} disabled={loading} className="px-3 py-2 text-sm rounded bg-blue-600 text-white">Save Bill</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ReceptionistLayout>
  );
}


