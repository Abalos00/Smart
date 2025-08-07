import React, { useState } from 'react';
import NodeCarousel from './NodeCarousel';
import HistoricalChart from './HistoricalChart';
import { Activity, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
  const { nodes, realTimeData, alerts, users } = useData();
  const { isDark } = useTheme();
  const [selectedNode, setSelectedNode] = useState(nodes[0] || null);

  const stats = [
    {
      label: 'Total Nodos',
      value: nodes.length,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      border: 'border-blue-200 dark:border-blue-700'
    },
    {
      label: 'Usuarios Activos',
      value: users.filter(u => u.role !== 'admin').length,
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20',
      border: 'border-emerald-200 dark:border-emerald-700'
    },
    {
      label: 'Alertas Activas',
      value: alerts.filter(a => !a.resolved).length,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      border: 'border-red-200 dark:border-red-700'
    },
    {
      label: 'Nodos En Línea',
      value: Object.keys(realTimeData).filter(nodeId => {
        const data = realTimeData[nodeId];
        return data && (Date.now() - new Date(data.timestamp).getTime()) < 5 * 60 * 1000;
      }).length,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      border: 'border-green-200 dark:border-green-700'
    }
  ];

  return (
    <div className="space-y-6 min-h-full flex flex-col">
      <div className="text-left">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent mb-2">
          Panel de Administración
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Vista general del sistema de monitoreo apícola</p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-2xl p-4 lg:p-6 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[120px] flex flex-col justify-center w-full`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selector de nodo para vista detallada */}
      {nodes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-100 dark:border-gray-700 min-h-[100px]">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seleccionar nodo para vista detallada:
            </label>
            <select
              value={selectedNode?.id || ''}
              onChange={(e) => {
                const node = nodes.find(n => n.id === e.target.value);
                setSelectedNode(node);
              }}
              className="w-full max-w-sm px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name} ({node.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Gráfico histórico del nodo seleccionado */}
      {selectedNode && (
        <div>
          <HistoricalChart
            nodeId={selectedNode.id}
            nodeName={selectedNode.name}
          />
        </div>
      )}

      {/* Carrusel de nodos */}
      <div className="flex-1 min-h-[400px]">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Monitoreo de Nodos
        </h3>
        <NodeCarousel 
          nodes={nodes}
          realTimeData={realTimeData}
          users={users}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;