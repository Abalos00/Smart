import React from 'react';
import { Activity, MapPin, User, Wifi, WifiOff } from 'lucide-react';
import { useData } from '../../context/DataContext';

const NodeManagement = () => {
  const { nodes, realTimeData, users } = useData();

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'No asignado';
  };

  const isNodeOnline = (nodeId) => {
    const data = realTimeData[nodeId];
    return data && (Date.now() - new Date(data.timestamp).getTime()) < 5 * 60 * 1000;
  };

  return (
    <div className="space-y-6 min-h-full flex flex-col">
      <div className="flex justify-between items-center text-left">
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">Gestión de Nodos</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Total de nodos: {nodes.length}
        </div>
      </div>

      <div className="grid gap-4 lg:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-1">
        {nodes.map((node) => {
          const isOnline = isNodeOnline(node.id);
          const data = realTimeData[node.id];
          
          return (
            <div key={node.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 lg:p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700 min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    node.type === 'colmena' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Activity className={`w-5 h-5 ${
                      node.type === 'colmena' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{node.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{node.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isOnline ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isOnline ? 'En línea' : 'Desconectado'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{getUserName(node.userId)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    node.type === 'colmena' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {node.type === 'colmena' ? 'Colmena' : 'Ambiental'}
                  </span>
                </div>

                {data && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Temp:</span>
                        <span className="ml-2 font-medium">{data.temperature}°C</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Hum:</span>
                        <span className="ml-2 font-medium">{data.humidity}%</span>
                      </div>
                      {data.weight && (
                        <div className="col-span-2">
                          <span className="text-gray-500 dark:text-gray-400">Peso:</span>
                          <span className="ml-2 font-medium">{data.weight} kg</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Última actualización: {new Date(data.timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeManagement;