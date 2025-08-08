import React, { useState } from 'react';
import SensorWidget from './SensorWidget';
import HistoricalChart from './HistoricalChart';
import AlertsPanel from './AlertsPanel';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const ApicultorDashboard = () => {
  const { nodes, realTimeData } = useData();
  const { user } = useAuth();

  // Filtrar nodos del usuario actual
  const userNodes = nodes.filter(node => node.userId === user.id);
  
  // Los apicultores tienen una colmena y un sensor de ambiente
  const userNode = userNodes.find(node => node.type === 'colmena');
  const userAmbientNode = userNodes.find(node => node.type === 'Ambiente');

  if (!userNode) {
    return (
      <div className="space-y-6 min-h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            No hay colmena asignada
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Contacte al administrador para que le asigne una colmena.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-full flex flex-col">
      <div className="text-left">
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent mb-2">Panel del Apicultor</h2>
        <p className="text-gray-600 dark:text-gray-300">Monitoreo en tiempo real de su colmena: {userNode.name}</p>
      </div>

      {/* Widget en tiempo real de la colmena */}
      <SensorWidget
        nodeId={userNode.id}
        nodeName={userNode.name}
        data={realTimeData[userNode.id]}
        type={userNode.type}
      />
      {/* widget en tiempo real de Ambiente */}
      {userAmbientNode && (
        <SensorWidget
          nodeId={userAmbientNode.id}
          nodeName={userAmbientNode.name}
          data={realTimeData[userAmbientNode.id]}
          type={userAmbientNode.type}
        />
      )}
      
      {/* Gráficos históricos */}
      <div className="space-y-6">
        {/* Gráfico de colmena */}
        <HistoricalChart
          nodeId={userNode.id}
          nodeName={`${userNode.name} - Colmena`}
        />
        
        {/* Gráfico de ambiente */}
        {userAmbientNode && (
          <HistoricalChart
            nodeId={userAmbientNode.id}
            nodeName={`${userAmbientNode.name} - Ambiente`}
          />
        )}
      </div>

      {/* Panel de alertas */}
      <div className="flex-1 min-h-[300px]">
        <AlertsPanel />
      </div>
    </div>
  );
};

export default ApicultorDashboard;