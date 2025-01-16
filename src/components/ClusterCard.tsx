import React, { useState } from 'react';
import { ClusterMetrics, EmployeeData } from '../types';
import { TrendingUp, TrendingDown, Users, X } from 'lucide-react';
import { RadarChart } from './RadarChart';
import { EmployeeDashboard } from './EmployeeDashboard';

interface Props {
  metrics: ClusterMetrics;
  clusterIndex: number;
  employeeCount: number;
  employees: EmployeeData[];
}

export function ClusterCard({ metrics, clusterIndex, employeeCount, employees }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);

  const colors = [
    'bg-emerald-50 border-emerald-200',
    'bg-violet-50 border-violet-200',
    'bg-blue-50 border-blue-200'
  ];

  const chartData = [
    { name: 'Budgettreue', value: metrics.centroid[0] },
    { name: 'Gemeinde Komm.', value: metrics.centroid[1] },
    { name: 'Vertikale Komm.', value: metrics.centroid[2] },
    { name: 'Projektabschluss', value: metrics.centroid[3] },
    { name: 'Arbeitsqualität', value: metrics.centroid[4] }
  ];

  return (
    <>
      <div 
        className={`p-6 rounded-xl border ${colors[clusterIndex]} transition-all cursor-pointer hover:shadow-md`}
        onClick={() => setShowDetails(true)}
      >
        <h3 className="text-lg font-semibold mb-4">Cluster {clusterIndex + 1}</h3>
        <p className="text-sm text-gray-600 mb-2">{employeeCount} Mitarbeiter</p>
        
        <div className="space-y-4">
          {metrics.strength.length > 0 && (
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <p className="font-medium text-sm text-emerald-700">Stärken</p>
                <ul className="mt-1 text-sm text-gray-600">
                  {metrics.strength.map(str => (
                    <li key={str}>{str}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {metrics.weakness.length > 0 && (
            <div className="flex items-start gap-2">
              <TrendingDown className="w-5 h-5 text-red-600 mt-1" />
              <div>
                <p className="font-medium text-sm text-red-700">Schwächen</p>
                <ul className="mt-1 text-sm text-gray-600">
                  {metrics.weakness.map(str => (
                    <li key={str}>{str}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Cluster {clusterIndex + 1} Details</h2>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">KPI Übersicht</h3>
                    <div className="w-full h-64">
                      <RadarChart data={chartData} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Empfohlene Schulungen</h3>
                    <ul className="space-y-2">
                      {metrics.recommendedTraining.map((training, index) => (
                        <li 
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded"
                        >
                          {training}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-medium">Mitarbeiter IDs</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {employees.map(emp => (
                        <div 
                          key={emp.id}
                          className="text-sm text-gray-600 bg-white px-3 py-2 rounded border border-gray-100 cursor-pointer hover:bg-violet-50 hover:border-violet-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(emp);
                          }}
                        >
                          {emp.id}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <EmployeeDashboard 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}
    </>
  );
}