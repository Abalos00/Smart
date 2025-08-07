import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../../context/DataContext';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const HistoricalChart = ({ nodeId, nodeName }) => {
  const [period, setPeriod] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeek, setSelectedWeek] = useState(getWeekString(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [chartData, setChartData] = useState(null);
  const { generateHistoricalData } = useData();

  // Función para obtener la semana en formato YYYY-Www
  function getWeekString(date) {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
  }

  const periods = [
    { value: 'day', label: 'Día' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' }
  ];

  useEffect(() => {
    let referenceDate;
    
    switch (period) {
      case 'day':
        referenceDate = new Date(selectedDate);
        break;
      case 'week':
        // Convertir semana seleccionada a fecha
        const [weekYear, weekNum] = selectedWeek.split('-W');
        const startOfYear = new Date(parseInt(weekYear), 0, 1);
        const daysToAdd = (parseInt(weekNum) - 1) * 7;
        referenceDate = new Date(startOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        referenceDate = new Date(selectedMonth + '-01');
        break;
      case 'year':
        referenceDate = new Date(parseInt(selectedYear), 0, 1);
        break;
      default:
        referenceDate = new Date();
    }
    
    const data = generateHistoricalData(nodeId, period, referenceDate);
    
    const chartConfig = {
      labels: data.map(d => d.timestamp),
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: data.map(d => ({ x: d.timestamp, y: parseFloat(d.temperature) })),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Humedad (%)',
          data: data.map(d => ({ x: d.timestamp, y: parseFloat(d.humidity) })),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    // Agregar peso si existe
    if (data[0]?.weight) {
      chartConfig.datasets.push({
        label: 'Peso (kg)',
        data: data.map(d => ({ x: d.timestamp, y: parseFloat(d.weight) })),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        yAxisID: 'y2'
      });
    }

    setChartData(chartConfig);
  }, [nodeId, period, selectedDate, selectedWeek, selectedMonth, selectedYear, generateHistoricalData]);

  const renderDateSelector = () => {
    switch (period) {
      case 'day':
        return (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );
      case 'week':
        return (
          <input
            type="week"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );
      case 'month':
        return (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );
      case 'year':
        return (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        );
      default:
        return null;
    }
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Datos Históricos - ${nodeName}`,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: period === 'day' ? 'hour' : period === 'week' ? 'day' : period === 'month' ? 'day' : 'month'
        },
        title: {
          display: true,
          text: 'Tiempo'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperatura (°C)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Humedad (%)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: false,
        position: 'right',
      }
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 lg:p-6 border border-gray-100 dark:border-gray-700 min-h-[500px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 text-left">
          <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Análisis Histórico</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {renderDateSelector()}
          </div>
          
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  period === p.value
                    ? 'bg-white dark:bg-gray-600 text-yellow-700 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] lg:min-h-[400px]">
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 min-h-[200px]">
            Cargando datos...
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalChart;