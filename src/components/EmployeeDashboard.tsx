import React from 'react';
import { X, Award, TrendingDown, Lightbulb, TrendingUp, Activity } from 'lucide-react';
import { EmployeeData } from '../types';
import { analyzeEmployee } from '../utils/analysis';
import { RadarChart } from './RadarChart';

interface Props {
  employee: EmployeeData;
  onClose: () => void;
}

export function EmployeeDashboard({ employee, onClose }: Props) {
  const metrics = analyzeEmployee(employee);
  
  const chartData = [
    { name: 'Budgettreue', value: employee.budgetAdherence },
    { name: 'Gemeinde Komm.', value: employee.communityComm },
    { name: 'Vertikale Komm.', value: employee.verticalComm },
    { name: 'Projektabschluss', value: employee.projectCompletionRate },
    { name: 'Arbeitsqualität', value: employee.workQuality }
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Mitarbeiter {employee.id}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Activity className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Leistungsprognose: 
                  <span className={`ml-2 font-semibold ${getPerformanceColor(metrics.predictedPerformance)}`}>
                    {metrics.predictedPerformance.toFixed(1)} / 10
                  </span>
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">KPI Übersicht</h3>
                <div className="w-full h-64">
                  <RadarChart data={chartData} />
                </div>
              </div>

              <div className="space-y-6">
                {metrics.strengths.length > 0 && (
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-medium text-emerald-900">Stärken</h4>
                    </div>
                    <ul className="space-y-1">
                      {metrics.strengths.map(strength => (
                        <li key={strength} className="text-sm text-emerald-800">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {metrics.weaknesses.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <h4 className="font-medium text-red-900">Verbesserungspotential</h4>
                    </div>
                    <ul className="space-y-1">
                      {metrics.weaknesses.map(weakness => (
                        <li key={weakness} className="text-sm text-red-800">
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-medium">Empfohlene Schulungen</h3>
              </div>
              
              <div className="space-y-4">
                {metrics.recommendedTrainings.map(training => (
                  <div 
                    key={training.name}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{training.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{training.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {training.forMetrics.map(metric => (
                        <span 
                          key={metric}
                          className="text-xs px-2 py-1 bg-violet-50 text-violet-700 rounded-full"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                
                {metrics.recommendedTrainings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
                    <p>Keine Schulungen erforderlich</p>
                    <p className="text-sm mt-1">Alle KPIs sind im guten Bereich</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}