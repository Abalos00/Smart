import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALERT_TYPES, ALERT_SEVERITY } from '../types';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);

  // Simular datos iniciales
  useEffect(() => {
    const mockNodes = [
      { id: 'node_001', name: 'Juan Pérez', type: 'colmena', lat: -34.6037, lng: -58.3816, userId: 2 },
      { id: 'node_002', name: 'María García', type: 'colmena', lat: -34.6137, lng: -58.3916, userId: 3 },
      { id: 'node_003', name: 'Carlos López', type: 'colmena', lat: -34.6237, lng: -58.4016, userId: 4 },
      { id: 'node_004', name: 'Ana Martínez', type: 'colmena', lat: -34.6337, lng: -58.4116, userId: 5 },
      { id: 'node_A_001', name: 'Juan Pérez', type: 'Ambiente', lat: -34.6037, lng: -58.3816, userId: 2 },
      { id: 'node_A_002', name: 'María García', type: 'Ambiente', lat: -34.6137, lng: -58.3916, userId: 3 },
      { id: 'node_A_003', name: 'Carlos López', type: 'Ambiente', lat: -34.6237, lng: -58.4016, userId: 4 },
      { id: 'node_A_004', name: 'Ana Martínez', type: 'Ambiente', lat: -34.6337, lng: -58.4116, userId: 5 }
    ];

    const mockUsers = [
      { id: 1, name: 'Administrador', email: 'admin@apicultor.com', role: 'admin' },
      { id: 2, name: 'Juan Pérez', email: 'apicultor@test.com', role: 'apicultor', nodes: ['node_001', 'node_A_02'] },
      { id: 3, name: 'María García', email: 'maria@apicultor.com', role: 'apicultor', nodes: ['node_002', 'node_A_02'] },
      { id: 4, name: 'Carlos López', email: 'carlos@apicultor.com', role: 'apicultor', nodes: ['node_003', 'node_A_02'] },
      { id: 5, name: 'Ana Martínez', email: 'ana@apicultor.com', role: 'apicultor', nodes: ['node_004', 'node_A_02'] }
    ];

    const mockAlerts = [
      {
        id: 1,
        nodeId: 'node_001',
        type: ALERT_TYPES.TEMPERATURA_ALTA,
        severity: ALERT_SEVERITY.HIGH,
        message: 'Temperatura elevada detectada en Colmena Norte',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        resolved: false
      },
      {
        id: 2,
        nodeId: 'node_002',
        type: ALERT_TYPES.PESO_ANOMALO,
        severity: ALERT_SEVERITY.MEDIUM,
        message: 'Variación anómala de peso en Colmena Sur',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
        resolved: true
      },
      {
        id: 3,
        nodeId: 'node_A_001',
        type: ALERT_TYPES.HUMEDAD_ALTA,
        severity: ALERT_SEVERITY.LOW,
        message: 'Humedad alta en Ambiente ',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        resolved: false
      },
      {
        id: 4,
        nodeId: 'node_A_002',
        type: ALERT_TYPES.TEMPERATURA_BAJA,
        severity: ALERT_SEVERITY.MEDIUM,
        message: 'Temperatura baja en el Ambiente ',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
        resolved: false
      }

    ];

    setNodes(mockNodes);
    setUsers(mockUsers);
    setAlerts(mockAlerts);

    // Simular datos en tiempo real
    generateRealTimeData(mockNodes);
  }, []);

  const generateRealTimeData = (nodeList) => {
    const data = {};
    nodeList.forEach(node => {
      data[node.id] = {
        timestamp: new Date(),
        temperature: (Math.random() * 15 + 20).toFixed(1), // 20-35°C
        humidity: (Math.random() * 30 + 40).toFixed(1), // 40-70%
        weight: node.type === 'colmena' ? (Math.random() * 10 + 45).toFixed(2) : null // 45-55kg
      };
    });
    setRealTimeData(data);
  };

  // Simular actualización de datos cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      generateRealTimeData(nodes);
    }, 30000);

    return () => clearInterval(interval);
  }, [nodes]);

  const generateHistoricalData = (nodeId, period, referenceDate = new Date()) => {
    const data = [];
    const baseDate = new Date(referenceDate);
    let points = 24; // Por defecto para día
    let interval = 60 * 60 * 1000; // 1 hora

    // Encontrar el nodo para verificar su tipo
    const node = nodes.find(n => n.id === nodeId);
    const isBeehive = node && node.type === 'colmena';

    switch (period) {
      case 'week':
        points = 7;
        interval = 24 * 60 * 60 * 1000; // 1 día
        // Para semana, empezar desde el lunes de esa semana
        const dayOfWeek = baseDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        baseDate.setDate(baseDate.getDate() + mondayOffset);
        baseDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        points = 30;
        interval = 24 * 60 * 60 * 1000; // 1 día
        // Para mes, empezar desde el día 1 del mes
        baseDate.setDate(1);
        baseDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        points = 12;
        interval = 30 * 24 * 60 * 60 * 1000; // 1 mes
        // Para año, empezar desde enero
        baseDate.setMonth(0, 1);
        baseDate.setHours(0, 0, 0, 0);
        break;
      default: // day
        // Para día, empezar desde las 00:00 del día seleccionado
        baseDate.setHours(0, 0, 0, 0);
        break;
    }

    for (let i = 0; i < points; i++) {
      const timestamp = new Date(baseDate.getTime() + i * interval);
      const dataPoint = {
        timestamp,
        temperature: (Math.random() * 15 + 20).toFixed(1),
        humidity: (Math.random() * 30 + 40).toFixed(1)
      };
      
      // Solo agregar peso si es una colmena
      if (isBeehive) {
        dataPoint.weight = (Math.random() * 10 + 45).toFixed(2);
      }
      
      data.push(dataPoint);
    }

    return data;
  };

  const value = {
    nodes,
    realTimeData,
    alerts,
    users,
    setUsers,
    setAlerts,
    generateHistoricalData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};