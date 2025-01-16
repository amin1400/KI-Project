import { EmployeeData, EmployeeMetrics, Training } from '../types';

const TRAININGS: Training[] = [
  {
    name: 'Kommunikationstraining',
    description: 'Verbessert die Kommunikationsfähigkeiten in allen Bereichen',
    forMetrics: ['Kommunikation mit Gemeinde', 'Kommunikation vertikal']
  },
  {
    name: 'Effizientes Arbeiten',
    description: 'Optimiert Arbeitsabläufe und steigert die Qualität',
    forMetrics: ['Projektabschlussrate', 'Arbeitsqualität']
  },
  {
    name: 'Finanzverwaltung',
    description: 'Schulung für besseres Budgetmanagement',
    forMetrics: ['Budgettreue']
  }
];

const KPI_THRESHOLDS = {
  STRENGTH: 7,
  WEAKNESS: 4
};

export function analyzeEmployee(employee: EmployeeData): EmployeeMetrics {
  const metrics = [
    { name: 'Budgettreue', value: employee.budgetAdherence },
    { name: 'Kommunikation mit Gemeinde', value: employee.communityComm },
    { name: 'Kommunikation vertikal', value: employee.verticalComm },
    { name: 'Projektabschlussrate', value: employee.projectCompletionRate },
    { name: 'Arbeitsqualität', value: employee.workQuality }
  ];

  const strengths = metrics
    .filter(m => m.value >= KPI_THRESHOLDS.STRENGTH)
    .map(m => m.name);

  const weaknesses = metrics
    .filter(m => m.value <= KPI_THRESHOLDS.WEAKNESS)
    .map(m => m.name);

  // Simple regression model for performance prediction
  const weights = [0.25, 0.2, 0.2, 0.15, 0.2]; // Weights for each KPI
  const predictedPerformance = metrics.reduce((sum, metric, index) => 
    sum + metric.value * weights[index], 0) / weights.reduce((a, b) => a + b);

  const recommendedTrainings = TRAININGS.filter(training =>
    training.forMetrics.some(metric => weaknesses.includes(metric))
  );

  return {
    strengths,
    weaknesses,
    recommendedTrainings,
    predictedPerformance
  };
}