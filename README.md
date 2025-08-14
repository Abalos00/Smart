# SmartBee - Plataforma de Monitoreo Apícola

Una aplicación web moderna para el monitoreo en tiempo real de colmenas y análisis de datos de sensores apícolas. Desarrollada con React y diseñada para ser completamente responsive.

## Características Principales

### Para Apicultores
- Vista en tiempo real: Widgets que muestran los últimos valores de humedad, temperatura y peso
- Análisis histórico: Gráficos interactivos por día, semana, mes y año
- Sistema de alertas: Notificaciones automáticas sobre condiciones anómalas
- Interfaz intuitiva: Diseño limpio y fácil de usar
- Una colmena por apicultor: Cada usuario gestiona su propia colmena

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

### Despliegue en servidor

```bash
# Buildear el projecto.
npm run build
```

Para la instalación en el servidor COPIAR la carpeta /dist en el servidor.

### Cuentas de Prueba

Estas cuentas no tienen funcionalidades y son estaticas, por lo que una vez se reemplace por un backend no van a ser eficientes.
Para testing, utilice estas credenciales:

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

### 2. Variables de Entorno, en caso de ser requeridas.

Cree un archivo `.env` en la raíz del proyecto:

```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_DATABASE_URL=mysql://usuario:password@localhost:5432/smartbee
VITE_MQTT_BROKER_URL=ws://localhost:8883
VITE_MQTT_USERNAME=tu_usuario_mqtt
VITE_MQTT_PASSWORD=tu_password_mqtt
```

### 3. Endpoints de API Requeridos

Su backend debe implementar estos endpoints:

#### Autenticación
- POST /api/auth/login - Iniciar sesión
- POST /api/auth/logout - Cerrar sesión
- GET /api/auth/me - Obtener usuario actual

#### Nodos
- GET /api/nodos - Listar nodos
- GET /api/nodos/:id/datos/tiempo-real - Datos en tiempo real
- GET /api/nodos/:id/datos/historicos?periodo=dia&fecha=2024-01-01 - Datos históricos

#### Alertas
- GET /api/alertas - Listar alertas
- POST /api/alertas - Crear alerta
- PUT /api/alertas/:id/resolver - Resolver alerta
- DELETE /api/alertas/:id - Eliminar alerta

### 4. Integración MQTT para Datos en Tiempo Real

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

### 5. Tópicos MQTT Esperados

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

### 6. Consideraciones de Seguridad

- Use HTTPS en producción
- Implemente autenticación JWT
- Valide todos los datos de entrada
- Use conexiones SSL/TLS para MQTT
- Implemente rate limiting en la API
- Sanitice datos antes de mostrarlos

### 7. Monitoreo y Logs

- Configure logs del servidor
- Implemente métricas de rendimiento
- Use herramientas como Sentry para error tracking
- Configure alertas de sistema

SmartBee - Desarrollado para la comunidad apícola chilena
