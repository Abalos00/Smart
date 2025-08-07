# SmartBee - Plataforma de Monitoreo Apícola

Una aplicación web moderna para el monitoreo en tiempo real de colmenas y análisis de datos de sensores apícolas. Desarrollada con React y diseñada para ser completamente responsive.

## Características Principales

### Para Apicultores
- Vista en tiempo real: Widgets que muestran los últimos valores de humedad, temperatura y peso
- Análisis histórico: Gráficos interactivos por día, semana, mes y año
- Sistema de alertas: Notificaciones automáticas sobre condiciones anómalas
- Interfaz intuitiva: Diseño limpio y fácil de usar
- Una colmena por apicultor: Cada usuario gestiona su propia colmena

### Para Administradores
- Gestión de usuarios: Crear, editar y eliminar usuarios apicultores
- Administración de nodos: Visualizar y gestionar todos los nodos del sistema
- Vista general: Dashboard con estadísticas completas del sistema
- Asignación de nodos: Vincular nodos específicos a cada apicultor
- Acceso completo: Visualización de todas las colmenas del sistema

## Tecnologías Utilizadas

### Frontend
- React 18 - Framework principal
- Tailwind CSS - Estilos y diseño responsive
- Chart.js - Visualización de gráficos interactivos
- Lucide React - Iconografía moderna
- Date-fns - Manejo de fechas

### Arquitectura
- Context API - Manejo de estado global
- Componentes modulares - Arquitectura escalable y mantenible
- Hooks personalizados - Lógica reutilizable
- Responsive Design - Optimizado para todos los dispositivos

## Instalación y Configuración

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación Local

```bash
# Clonar el repositorio
git clone [repository-url]
cd smartbee

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Cuentas de Prueba

Para testing, utilice estas credenciales:

**Administrador:**
- Email: admin@apicultor.com
- Password: admin123

**Apicultores:**
- Juan Pérez: apicultor@test.com / api123
- María García: maria@apicultor.com / maria123
- Carlos López: carlos@apicultor.com / carlos123
- Ana Martínez: ana@apicultor.com / ana123

## Funcionalidades del Sistema

### Dashboard del Apicultor
- Monitoreo de una sola colmena asignada
- Datos en tiempo real de temperatura, humedad y peso
- Gráficos históricos con filtros por día, semana, mes y año
- Panel de alertas específicas de su colmena
- Selección de fechas específicas para análisis histórico

### Dashboard del Administrador
- Vista general de todas las colmenas del sistema
- Estadísticas globales: total de nodos, usuarios activos, alertas
- Carrusel de nodos para navegación entre colmenas
- Selector de nodo para vista detallada
- Gestión completa de usuarios y nodos

### Sistema de Alertas
- Alertas automáticas por condiciones anómalas
- Diferentes niveles de severidad: baja, media, alta, crítica
- Filtros por fecha y estado (resueltas/sin resolver)
- Resolución manual de alertas

### Análisis Histórico
- Gráficos interactivos con múltiples métricas
- Filtros temporales: día, semana, mes, año
- Selección de fechas específicas para cada período
- Visualización de tendencias y patrones

## Integración con Base de Datos Real

Actualmente SmartBee utiliza datos simulados para demostración. Para conectar con datos reales de una base de datos, siga estos pasos:

### 1. Configuración del Backend

Necesitará un servidor backend que proporcione una API REST. Recomendamos:

- Node.js con Express
- Python con FastAPI
- PHP con Laravel
- Java con Spring Boot

### 2. Variables de Entorno

Cree un archivo `.env` en la raíz del proyecto:

```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_DATABASE_URL=postgresql://usuario:password@localhost:5432/smartbee
VITE_MQTT_BROKER_URL=ws://localhost:8883
VITE_MQTT_USERNAME=tu_usuario_mqtt
VITE_MQTT_PASSWORD=tu_password_mqtt
```

### 3. Estructura de Base de Datos

#### Tabla: usuarios
```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'apicultor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla: nodos
```sql
CREATE TABLE nodos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla: datos_sensores
```sql
CREATE TABLE datos_sensores (
    id SERIAL PRIMARY KEY,
    nodo_id VARCHAR(50) REFERENCES nodos(id),
    temperatura DECIMAL(5, 2),
    humedad DECIMAL(5, 2),
    peso DECIMAL(8, 3),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla: alertas
```sql
CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    nodo_id VARCHAR(50) REFERENCES nodos(id),
    tipo VARCHAR(100) NOT NULL,
    severidad VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    resuelto BOOLEAN DEFAULT false,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Se puede usar otra base de datos solo hay que adaptarlo.

### 4. Endpoints de API Requeridos

Su backend debe implementar estos endpoints:

#### Autenticación
- POST /api/auth/login - Iniciar sesión
- POST /api/auth/logout - Cerrar sesión
- GET /api/auth/me - Obtener usuario actual

#### Usuarios (solo administradores)
- GET /api/usuarios - Listar usuarios
- POST /api/usuarios - Crear usuario
- PUT /api/usuarios/:id - Actualizar usuario
- DELETE /api/usuarios/:id - Eliminar usuario

#### Nodos
- GET /api/nodos - Listar nodos
- GET /api/nodos/:id/datos/tiempo-real - Datos en tiempo real
- GET /api/nodos/:id/datos/historicos?periodo=dia&fecha=2024-01-01 - Datos históricos

#### Alertas
- GET /api/alertas - Listar alertas
- POST /api/alertas - Crear alerta
- PUT /api/alertas/:id/resolver - Resolver alerta
- DELETE /api/alertas/:id - Eliminar alerta

### 5. Formato de Datos

#### Usuario
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "rol": "apicultor"
}
```

#### Nodo
```json
{
  "id": "nodo_001",
  "nombre": "Colmena Norte",
  "tipo": "colmena",
  "latitud": -34.6037,
  "longitud": -58.3816,
  "usuario_id": 2,
  "activo": true
}
```

#### Datos de Sensor
```json
{
  "nodo_id": "nodo_001",
  "temperatura": 25.5,
  "humedad": 65.2,
  "peso": 48.7,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Alerta
```json
{
  "id": 1,
  "nodo_id": "nodo_001",
  "tipo": "temperatura_alta",
  "severidad": "alta",
  "mensaje": "Temperatura elevada detectada",
  "resuelto": false,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 6. Modificar el Código para Usar Datos Reales

#### Paso 1: Crear servicio de API

Cree el archivo `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Usuarios
  async getUsuarios() {
    return this.request('/usuarios');
  }

  async createUsuario(userData) {
    return this.request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Nodos
  async getNodos() {
    return this.request('/nodos');
  }

  async getDatosTiempoReal(nodoId) {
    return this.request(`/nodos/${nodoId}/datos/tiempo-real`);
  }

  async getDatosHistoricos(nodoId, periodo, fecha) {
    return this.request(`/nodos/${nodoId}/datos/historicos?periodo=${periodo}&fecha=${fecha}`);
  }

  // Alertas
  async getAlertas() {
    return this.request('/alertas');
  }

  async resolverAlerta(alertaId) {
    return this.request(`/alertas/${alertaId}/resolver`, {
      method: 'PUT',
    });
  }
}

export default new ApiService();
```

#### Paso 2: Modificar DataContext

Actualice `src/context/DataContext.jsx` para usar la API real:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [nodesData, usersData, alertsData] = await Promise.all([
        ApiService.getNodos(),
        ApiService.getUsuarios(),
        ApiService.getAlertas(),
      ]);

      setNodes(nodesData);
      setUsers(usersData);
      setAlerts(alertsData);

      // Cargar datos en tiempo real para cada nodo
      const realTimePromises = nodesData.map(node =>
        ApiService.getDatosTiempoReal(node.id)
      );
      
      const realTimeResults = await Promise.all(realTimePromises);
      const realTimeMap = {};
      
      nodesData.forEach((node, index) => {
        realTimeMap[node.id] = realTimeResults[index];
      });
      
      setRealTimeData(realTimeMap);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHistoricalData = async (nodeId, period) => {
    try {
      const fecha = new Date().toISOString().split('T')[0];
      return await ApiService.getDatosHistoricos(nodeId, period, fecha);
    } catch (error) {
      console.error('Error cargando datos históricos:', error);
      return [];
    }
  };

  const value = {
    nodes,
    realTimeData,
    alerts,
    users,
    loading,
    setUsers,
    setAlerts,
    generateHistoricalData,
    refreshData: loadInitialData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
```

### 7. Integración MQTT para Datos en Tiempo Real

Para recibir datos de sensores en tiempo real vía MQTT:

#### Instalar dependencia MQTT
```bash
npm install mqtt
```

#### Crear servicio MQTT
Cree `src/services/mqtt.js`:

```javascript
import mqtt from 'mqtt';

class MqttService {
  constructor() {
    this.client = null;
    this.subscribers = new Map();
  }

  connect() {
    const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL;
    const username = import.meta.env.VITE_MQTT_USERNAME;
    const password = import.meta.env.VITE_MQTT_PASSWORD;

    this.client = mqtt.connect(brokerUrl, {
      username,
      password,
    });

    this.client.on('connect', () => {
      console.log('Conectado al broker MQTT');
    });

    this.client.on('message', (topic, message) => {
      const data = JSON.parse(message.toString());
      
      // Notificar a los suscriptores
      this.subscribers.forEach((callback, subscriberId) => {
        callback(topic, data);
      });
    });
  }

  subscribe(topics, callback) {
    const subscriberId = Date.now().toString();
    this.subscribers.set(subscriberId, callback);
    
    if (this.client) {
      topics.forEach(topic => {
        this.client.subscribe(topic);
      });
    }
    
    return subscriberId;
  }

  unsubscribe(subscriberId) {
    this.subscribers.delete(subscriberId);
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

export default new MqttService();
```

### 8. Tópicos MQTT Esperados

Configure sus sensores para enviar datos a estos tópicos:

- `sensor/[nodo_id]/temperatura`
- `sensor/[nodo_id]/humedad`
- `sensor/[nodo_id]/peso`
- `alertas/[nodo_id]`

Formato de mensaje JSON:
```json
{
  "nodo_id": "nodo_001",
  "valor": 25.5,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 9. Consideraciones de Seguridad

- Use HTTPS en producción
- Implemente autenticación JWT
- Valide todos los datos de entrada
- Use conexiones SSL/TLS para MQTT
- Implemente rate limiting en la API
- Sanitice datos antes de mostrarlos

### 10. Monitoreo y Logs

- Configure logs del servidor
- Implemente métricas de rendimiento
- Use herramientas como Sentry para error tracking
- Configure alertas de sistema

## Soporte

Para soporte técnico o consultas:
- Abrir un issue en GitHub
- Email: soporte@smartbee.com

SmartBee - Desarrollado para la comunidad apícola chilena