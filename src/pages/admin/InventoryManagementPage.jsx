import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiFetchProducts, apiRestock } from '../../api/mockApi';
import { showSnackbar } from '../../store/slices/uiSlice';

export default function InventoryManagementPage() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch products directly from mock API (no Redux slice needed)
  useEffect(() => {
    apiFetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const lowStock = products.filter((p) => p.stock < p.lowStockThreshold);

  const handleRestock = async (product) => {
    const qty = Number(amounts[product.id]) || 10;
    const updated = await apiRestock(product.id, qty);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    dispatch(showSnackbar({ message: `Added ${qty} units of ${product.name}.` }));
    setAmounts((prev) => ({ ...prev, [product.id]: '' }));
  };

  if (loading) return <div className="text-center text-gray-500 py-10">Loading inventory…</div>;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold m-0" style={{ fontFamily: 'var(--serif)' }}>Inventory management</h2>
        <p className="text-sm text-gray-500 mt-1 mb-0">Track stock on hand and restock before you run out.</p>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg text-sm font-medium">
          ⚠ {lowStock.length} product{lowStock.length > 1 ? 's are' : ' is'} below its safe stock threshold.
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2.5 font-bold">Product</th>
              <th className="text-left px-4 py-2.5 font-bold">Supplier</th>
              <th className="text-right px-4 py-2.5 font-bold">Stock</th>
              <th className="text-right px-4 py-2.5 font-bold">Threshold</th>
              <th className="text-left px-4 py-2.5 font-bold">Status</th>
              <th className="text-right px-4 py-2.5 font-bold">Restock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLow = p.stock < p.lowStockThreshold;
              return (
                <tr key={p.id} className={isLow ? 'bg-red-50/50' : ''}>
                  <td className="px-4 py-2.5 border-b border-gray-200">{p.name}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">{p.supplier}</td>
                  <td className={`px-4 py-2.5 border-b border-gray-200 text-right font-mono ${isLow ? 'font-bold text-red-700' : ''}`}>{p.stock}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right font-mono">{p.lowStockThreshold}</td>
                  <td className="px-4 py-2.5 border-b border-gray-200">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${isLow ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {isLow ? 'Low stock' : 'Healthy'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 border-b border-gray-200 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        className="w-[70px] px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                        value={amounts[p.id] || ''}
                        onChange={(e) => setAmounts((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      />
                      <button className="btn btn-outline btn-small" onClick={() => handleRestock(p)}>Restock</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
