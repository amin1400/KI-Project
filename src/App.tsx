import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ClusterCard } from './components/ClusterCard';
import { EmployeeData, ClusterMetrics } from './types';
import { analyzeEmployeeData } from './utils/clustering';
import { BarChart2 } from 'lucide-react';

function App() {
  const [clusteredData, setClusteredData] = useState<EmployeeData[]>([]);
  const [clusterMetrics, setClusterMetrics] = useState<ClusterMetrics[]>([]);

  const handleDataLoaded = (data: EmployeeData[]) => {
    const result = analyzeEmployeeData(data);
    setClusteredData(result.clusteredData);
    setClusterMetrics(result.clusterMetrics);
  };

  const getEmployeesInCluster = (clusterIndex: number) => {
    return clusteredData.filter(emp => emp.cluster === clusterIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <BarChart2 className="w-8 h-8 text-violet-600" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Mitarbeiter Bewertungs-Analyse
          </h1>
        </div>

        {clusteredData.length === 0 ? (
          <div className="mt-12">
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {clusterMetrics.map((metrics, index) => (
              <ClusterCard
                key={index}
                metrics={metrics}
                clusterIndex={index}
                employeeCount={getEmployeesInCluster(index).length}
                employees={getEmployeesInCluster(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
