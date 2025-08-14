import React from 'react';
import { Thermometer, Droplet, Weight, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SensorWidget = ({ nodeId, nodeName, data, type }) => {
  const { isDark } = useTheme();
  const isOnline = data && (Date.now() - new Date(data.timestamp).getTime()) < 5 * 60 * 1000; // 5 minutos

  const widgets = [
    {
      key: 'temperature',
      label: 'Temperatura',
      value: data?.temperature,
      unit: '°C',
      icon: Thermometer,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      border: 'border-red-200 dark:border-red-700'
    },
    {
      key: 'humidity',
      label: 'Humedad',
      value: data?.humidity,
      unit: '%',
      icon: Droplet,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      border: 'border-blue-200 dark:border-blue-700'
    }
  ];

  if (type === 'colmena' && data?.weight) {
    widgets.push({
      key: 'weight',
      label: 'Peso',
      value: data.weight,
      unit: 'kg',
      icon: Weight,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-emerald-50 dark:to-emerald-100 dark:dark:from-emerald-900/20 dark:dark:to-emerald-800/20',
      border: 'border-yellow-200 dark:border-emerald-200 dark:dark:border-emerald-700'
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 min-h-[200px]">
      <h1 className='text-gray-600 dark:text-gray-100 lg:text-2xl font-medium m-2' >
        {type === 'Ambiente' ? 'DATOS DEL AMBIENTE' : 'DATOS DE COLMENA'}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {widgets.map((widget) => {
          const Icon = widget.icon;
          return (
            <div
              key={widget.key}
              className={`${widget.bg} ${widget.border} border rounded-xl p-3 lg:p-4 hover:scale-105 transition-transform duration-200 min-h-[100px] flex flex-col justify-center`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{widget.label}</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    {widget.value || '--'}
                    <span className="text-sm font-normal ml-1">{widget.unit}</span>
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${widget.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {data && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Última actualización: {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
  
};

export default SensorWidget;