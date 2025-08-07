import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Activity, MapPin, User, Wifi, WifiOff } from 'lucide-react';
import SensorWidget from './SensorWidget';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

const NodeCarousel = ({ nodes, realTimeData, users }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDark } = useTheme();

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'No asignado';
  };

  const isNodeOnline = (nodeId) => {
    const data = realTimeData[nodeId];
    return data && (Date.now() - new Date(data.timestamp).getTime()) < 5 * 60 * 1000;
  };

  const nextNode = () => {
    setCurrentIndex((prev) => (prev + 1) % nodes.length);
  };

  const prevNode = () => {
    setCurrentIndex((prev) => (prev - 1 + nodes.length) % nodes.length);
  };

  if (nodes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <Activity className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No hay nodos disponibles
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Agregue nodos al sistema para comenzar el monitoreo
        </p>
      </div>
    );
  }

  const currentNode = nodes[currentIndex];
  const isOnline = isNodeOnline(currentNode.id);
  const data = realTimeData[currentNode.id];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden">
      {/* Header del carrusel */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              currentNode.type === 'colmena' 
                ? 'bg-yellow-400 dark:bg-yellow-500' 
                : 'bg-blue-400 dark:bg-blue-500'
            }`}>
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentNode.name}</h3>
              <p className="text-emerald-100 text-sm">ID: {currentNode.id}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Estado de conexión */}
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-300" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-300" />
              )}
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                isOnline 
                  ? 'bg-green-400 bg-opacity-20 text-green-100'
                  : 'bg-red-400 bg-opacity-20 text-red-100'
              }`}>
                {isOnline ? 'En línea' : 'Desconectado'}
              </span>
            </div>
            
            {/* Contador */}
            <div className="text-yellow-100 dark:text-emerald-100 text-sm font-medium">
              {currentIndex + 1} / {nodes.length}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Información del nodo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {currentNode.lat.toFixed(4)}, {currentNode.lng.toFixed(4)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Propietario</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {getUserName(currentNode.userId)}
              </p>
            </div>
          </div>
        </div>

        {/* Widget de sensores */}
        <SensorWidget
          nodeId={currentNode.id}
          nodeName={currentNode.name}
          data={data}
          type={currentNode.type}
        />

        {/* Controles de navegación */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={prevNode}
            disabled={nodes.length <= 1}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 hover:from-yellow-600 hover:to-yellow-700 dark:hover:from-emerald-600 dark:hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Indicadores de puntos */}
          <div className="flex space-x-2">
            {nodes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextNode}
            disabled={nodes.length <= 1}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-emerald-500 dark:to-emerald-600 hover:from-yellow-600 hover:to-yellow-700 dark:hover:from-emerald-600 dark:hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeCarousel;