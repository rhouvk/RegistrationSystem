import React from 'react';
import { Dialog } from '@headlessui/react';
import { Bar } from 'react-chartjs-2';

export default function DistrictDetailsModal({ isOpen, onClose, districtData, isLoading }) {
  if (!districtData && !isLoading) return null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[80vh] flex flex-col">
          <div className="p-4 border-b">
            <Dialog.Title className="text-xl font-bold text-cyan-950">
              {isLoading ? 'Loading...' : `${districtData.district} District Details`}
            </Dialog.Title>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-900"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Barangays Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barangay</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Male</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Female</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {districtData.barangays.map((barangay, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{barangay.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{barangay.total_population}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{barangay.male_count}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{barangay.female_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Disability Stats Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-cyan-950">Disability Distribution</h3>
                <div className="h-[250px]">
                  <Bar
                    data={{
                      labels: Object.keys(districtData.disability_stats),
                      datasets: [{
                        label: 'Number of PWDs',
                        data: Object.values(districtData.disability_stats),
                        backgroundColor: [
                          '#0B3B46', '#1F5562', '#2F7E91', '#3EA9BD', 
                          '#5DC8D9', '#84D7E3', '#AADFE8', '#C5ECF4',
                          '#E0F6FA', '#F4FCFD'
                        ],
                      }],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="p-4 border-t mt-auto">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 