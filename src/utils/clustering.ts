import { kmeans } from 'ml-kmeans';

const KPI_NAMES = [
  'Budgettreue',
  'Kommunikation mit Gemeinde',
  'Kommunikation vertikal',
  'Projektabschlussrate',
  'Arbeitsqualität'
];

const getRecommendedTraining = (weaknesses: string[]): string[] => {
  const recommendations: string[] = [];
  
  const hasCommunicationWeakness = weaknesses.some(w => 
    w.toLowerCase().includes('kommunikation')
  );
  
  const hasMultipleCommunicationWeaknesses = 
    weaknesses.filter(w => w.toLowerCase().includes('kommunikation')).length > 1;

  if (hasMultipleCommunicationWeaknesses) {
    recommendations.push('Intensives Kommunikationstraining (2 Wochen)');
  } else if (hasCommunicationWeakness) {
    recommendations.push('Grundlegendes Kommunikationstraining (1 Woche)');
  }

  if (weaknesses.some(w => w.includes('Budgettreue'))) {
    recommendations.push('Schulung: Budgetmanagement und Kostenkontrolle');
  }

  if (weaknesses.some(w => w.includes('Projektabschlussrate'))) {
    recommendations.push('Workshop: Effizientes Projektmanagement');
  }

  if (weaknesses.some(w => w.includes('Arbeitsqualität'))) {
    recommendations.push('Qualitätsmanagement-Schulung');
  }

  return recommendations;
};

export function analyzeEmployeeData(data: EmployeeData[]): {
  clusteredData: EmployeeData[];
  clusterMetrics: ClusterMetrics[];
} {
  const matrix = data.map(employee => [
    employee.budgetAdherence,
    employee.communityComm,
    employee.verticalComm,
    employee.projectCompletionRate,
    employee.workQuality
  ]);

  const result = kmeans(matrix, 3, {
    iterations: 100,
    initialization: 'kmeans++'
  });

  const clusteredData = data.map((employee, index) => ({
    ...employee,
    cluster: result.clusters[index]
  }));

  const clusterMetrics = result.centroids.map((centroid, i) => {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    centroid.forEach((value, index) => {
      if (value >= 7) {
        strengths.push(KPI_NAMES[index]);
      } else if (value <= 4) {
        weaknesses.push(KPI_NAMES[index]);
      }
    });

    const recommendedTraining = getRecommendedTraining(weaknesses);

    return {
      centroid,
      strength: strengths,
      weakness: weaknesses,
      recommendedTraining
    };
  });

  return { clusteredData, clusterMetrics };
}