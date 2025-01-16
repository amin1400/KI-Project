import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { EmployeeData } from '../types';

interface Props {
  onDataLoaded: (data: EmployeeData[]) => void;
}

export function FileUpload({ onDataLoaded }: Props) {
  const [error, setError] = useState<string>('');

  const normalizeColumnName = (name: string): string => {
    return name.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const findMatchingColumn = (headers: string[], searchTerms: string[]): string | undefined => {
    const normalizedHeaders = headers.map(normalizeColumnName);
    const normalizedSearchTerms = searchTerms.map(normalizeColumnName);
    
    return headers[normalizedHeaders.findIndex(header => 
      normalizedSearchTerms.some(term => header.includes(term))
    )];
  };

  const getRequiredColumnMapping = (headers: string[]) => {
    const mapping: Record<string, string[]> = {
      id: ['id', 'mitarbeiter id', 'mitarbeiterid'],
      budgetAdherence: ['budgettreue', 'budget', 'budgeteinhaltung'],
      communityComm: ['kommunikation zwischen gemeinde', 'gemeindekommunikation', 'kommunikation gemeinde'],
      verticalComm: ['kommunikation in der vertikalen ebene', 'vertikale kommunikation', 'kommunikation vertikal'],
      projectCompletionRate: ['projektabschlussrate', 'projektabschluss', 'abschlussrate'],
      workQuality: ['qualität der arbeit', 'arbeitsqualität', 'qualität']
    };

    const result: Record<string, string> = {};
    
    for (const [key, searchTerms] of Object.entries(mapping)) {
      const matchingColumn = findMatchingColumn(headers, searchTerms);
      if (matchingColumn) {
        result[key] = matchingColumn;
      }
    }

    return result;
  };

  const validateColumnMapping = (mapping: Record<string, string>): boolean => {
    const requiredFields = ['id', 'budgetAdherence', 'communityComm', 'verticalComm', 'projectCompletionRate', 'workQuality'];
    return requiredFields.every(field => mapping[field] !== undefined);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError('Die Excel-Datei enthält keine Daten.');
          return;
        }

        const headers = Object.keys(jsonData[0]);
        const columnMapping = getRequiredColumnMapping(headers);

        if (!validateColumnMapping(columnMapping)) {
          setError('Einige erforderliche Spalten wurden nicht gefunden. Bitte überprüfen Sie die Spaltenüberschriften.');
          return;
        }

        const employeeData: EmployeeData[] = jsonData.map((row: any, index: number) => {
          const getValue = (columnName: string): number => {
            const value = row[columnMapping[columnName]];
            const numValue = parseFloat(value);
            return isNaN(numValue) ? 0 : Math.max(0, Math.min(10, numValue));
          };

          return {
            id: (row[columnMapping.id]?.toString() || `employee-${index + 1}`).trim(),
            budgetAdherence: getValue('budgetAdherence'),
            communityComm: getValue('communityComm'),
            verticalComm: getValue('verticalComm'),
            projectCompletionRate: getValue('projectCompletionRate'),
            workQuality: getValue('workQuality')
          };
        });

        onDataLoaded(employeeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Verarbeiten der Excel-Datei.');
      }
    };

    reader.onerror = () => {
      setError('Fehler beim Lesen der Datei.');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label
        className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <Upload className="w-12 h-12 text-gray-400" />
        <span className="mt-2 text-base text-gray-600">Excel-Datei hochladen</span>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />
      </label>
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Erforderliche Spalten (oder ähnliche Bezeichnungen):</p>
        <ul className="list-disc list-inside space-y-1">
          <li>ID / Mitarbeiter ID</li>
          <li>Budgettreue / Budget / Budgeteinhaltung</li>
          <li>Kommunikation zwischen Gemeinde / Gemeindekommunikation</li>
          <li>Kommunikation in der vertikalen Ebene / Vertikale Kommunikation</li>
          <li>Projektabschlussrate / Projektabschluss</li>
          <li>Qualität der Arbeit / Arbeitsqualität</li>
        </ul>
      </div>
    </div>
  );
}