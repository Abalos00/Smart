import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ALERT_SEVERITY } from '../../types';

const AlertsPanel = () => {
  const { alerts } = useData();
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const severityConfig = {
    [ALERT_SEVERITY.LOW]: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      label: 'Baja'
    },
    [ALERT_SEVERITY.MEDIUM]: {
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      label: 'Media'
    },
    [ALERT_SEVERITY.HIGH]: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Alta'
    },
    [ALERT_SEVERITY.CRITICAL]: {
      color: 'text-red-800',
      bg: 'bg-red-100',
      border: 'border-red-300',
      label: 'Crítica'
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'resolved' && !alert.resolved) return false;
    if (filter === 'unresolved' && alert.resolved) return false;
    
    if (dateFilter) {
      const alertDate = new Date(alert.timestamp).toISOString().split('T')[0];
      if (alertDate !== dateFilter) return false;
    }
    
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 lg:p-6 border border-gray-100 dark:border-gray-700 min-h-[400px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 text-left">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alertas del Sistema</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todas</option>
              <option value="unresolved">Sin resolver</option>
              <option value="resolved">Resueltas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 flex-1 flex flex-col justify-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No hay alertas que mostrar</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const config = severityConfig[alert.severity] || severityConfig[ALERT_SEVERITY.LOW];
            
            return (
              <div
                key={alert.id}
                className={`${config.bg} ${config.border} border rounded-lg p-4 transition-all hover:shadow-md dark:bg-opacity-20`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Nodo: {alert.nodeId}
                      </span>
                    </div>
                    
                    <p className="text-gray-900 dark:text-white mb-2">{alert.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {alert.resolved ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">Resuelta</span>
                      </div>
                    ) : (
                      <button className="px-3 py-1 bg-yellow-600 dark:bg-emerald-600 text-white text-sm rounded-lg hover:bg-yellow-700 dark:hover:bg-emerald-700 transition-colors">
                        Resolver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;