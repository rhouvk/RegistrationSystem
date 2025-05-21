import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function LineItemSection({ data, setData, bnpcItems, errors, lineBalances }) {
  const addRow = () => {
    setData('items', [...data.items, { bnpc_item_id: '', quantity: '', line_total: '' }]);
  };

  const removeRow = (index) => {
    setData('items', data.items.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    // Prevent negative values for quantity and line_total
    if ((field === 'quantity' || field === 'line_total') && parseFloat(value) < 0) {
      return;
    }
    
    const updated = [...data.items];
    updated[index][field] = value;
    setData('items', updated);
  };

  return (
    <div>
      <InputLabel value="Items Purchased" />
      {data.items.map((row, i) => {
        const availableItems = bnpcItems.filter(item =>
          !data.items.some((r, j) => j !== i && r.bnpc_item_id == item.id)
        );

        return (
          <div key={i} className="mb-4 border p-4 rounded space-y-3">
            <div>
              <InputLabel htmlFor={`item_${i}`} value="Item Name" />
              <select
                id={`item_${i}`}
                value={row.bnpc_item_id}
                onChange={e => updateRow(i, 'bnpc_item_id', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="">— choose —</option>
                {availableItems.map(x => (
                  <option key={x.id} value={x.id}>{x.name}</option>
                ))}
              </select>
              <InputError message={errors?.[`items.${i}.bnpc_item_id`]} />
            </div>

            <div>
              <InputLabel htmlFor={`qty_${i}`} value="Quantity" />
              <TextInput
                id={`qty_${i}`}
                type="number"
                min="0"
                value={row.quantity}
                onChange={e => updateRow(i, 'quantity', e.target.value)}
                className="mt-1 block w-full"
              />
              <InputError message={errors?.[`items.${i}.quantity`]} />
            </div>

            <div>
              <InputLabel htmlFor={`total_${i}`} value="Line Total Amount (₱)" />
              <TextInput
                id={`total_${i}`}
                type="number"
                min="0"
                step="0.01"
                value={row.line_total}
                onChange={e => updateRow(i, 'line_total', e.target.value)}
                className="mt-1 block w-full"
              />
              <InputError message={errors?.[`items.${i}.line_total`]} />
            </div>

            <p className="text-sm text-gray-600">
              Remaining after this line: ₱{lineBalances[i]?.toFixed(2)}
            </p>

            {data.items.length > 1 && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addRow}
        className="text-blue-600 hover:underline"
      >
        + Add another item
      </button>

      {/* Summary */}
      <div className="mt-6 space-y-4">
        <div>
          <InputLabel htmlFor="total_amount" value="Grand Total (₱)" />
          <TextInput
            id="total_amount"
            type="number"
            value={data.total_amount}
            readOnly
            className="mt-1 block w-full bg-gray-100"
          />
        </div>

        <div>
          <InputLabel htmlFor="remaining_balance" value="Remaining Balance (₱)" />
          <TextInput
            id="remaining_balance"
            type="number"
            value={data.remaining_balance}
            readOnly
            className="mt-1 block w-full bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
