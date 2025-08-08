# SmartBee - Panel de Configuraciones

## SettingsPanel Component

El componente `SettingsPanel` es un panel de configuraciones completo y modular que permite a los usuarios personalizar su experiencia en SmartBee. Diseñado siguiendo los principios de UX/UI y manteniendo coherencia con el diseño general del proyecto.

### Características Principales

#### 🔔 Gestión de Notificaciones
- **Activación/Desactivación global** de notificaciones
- **Configuración de canales**: sonido, email, push notifications
- **Alertas específicas**: temperatura, humedad, peso, conectividad
- **Integración con contexto** de notificaciones para gestión centralizada

#### 🎨 Configuración de Tema y Pantalla
- **Selector de tema**: claro, oscuro, automático
- **Modo compacto** para optimizar el espacio
- **Control de animaciones** para mejor rendimiento
- **Integración con ThemeContext** para cambios en tiempo real

#### 💾 Gestión de Datos
- **Backup automático** configurable
- **Retención de datos** con opciones predefinidas
- **Formatos de exportación**: CSV, JSON, Excel
- **Exportación manual** de datos del usuario

#### 👤 Información de Cuenta
- **Edición de perfil** en línea
- **Configuraciones de seguridad**
- **Autenticación de dos factores** (preparado)
- **Gestión de permisos** de notificación del navegador
- **Zona de peligro** para eliminación de cuenta

### Diseño y UX

#### Lineamiento Gráfico
- **Colores principales**: 
  - Modo claro: Gradientes amarillos (`yellow-500` a `yellow-600`)
  - Modo oscuro: Gradientes esmeralda (`emerald-500` a `emerald-600`)
- **Iconografía**: Lucide React icons consistentes
- **Tipografía**: Sistema de fuentes Tailwind CSS
- **Espaciado**: Diseño responsivo con grid y flexbox

#### Componentes Reutilizables

##### ToggleSwitch
```jsx
<ToggleSwitch
  enabled={settings.notifications.enabled}
  onChange={(value) => updateSetting('notifications', 'enabled', value)}
  size="md" // sm, md, lg
/>
```

##### SettingItem
```jsx
<SettingItem
  icon={Bell}
  label="Activar notificaciones"
  description="Habilitar todas las notificaciones del sistema"
  divider={true}
>
  {children}
</SettingItem>
```

##### SectionHeader
```jsx
<SectionHeader 
  icon={Bell} 
  title="Notificaciones" 
  description="Configura cómo y cuándo recibir alertas"
/>
```

### Funcionalidades Técnicas

#### Persistencia de Datos
- **LocalStorage**: Almacenamiento local de configuraciones
- **Sincronización automática** con contextos de la aplicación
- **Validación de datos** al cargar configuraciones guardadas

#### Integración con Contextos
- **ThemeContext**: Para cambios de tema en tiempo real
- **AuthContext**: Para información del usuario
- **NotificationContext**: Para gestión de notificaciones (opcional)

#### Notificaciones de Estado
- **Feedback visual** para acciones del usuario
- **Toasts personalizados** para confirmaciones
- **Estados de carga** para operaciones asíncronas

### Uso

```jsx
import SettingsPanel from './components/Dashboard/SettingsPanel';

// En el componente padre
<SettingsPanel />
```

### Configuración por Defecto

```javascript
const defaultSettings = {
  notifications: {
    enabled: true,
    sound: true,
    email: true,
    push: true,
    alerts: {
      temperature: true,
      humidity: true,
      weight: true,
      connectivity: true
    }
  },
  display: {
    theme: 'light',
    autoTheme: false,
    animations: true,
    compactMode: false
  },
  data: {
    autoBackup: true,
    retentionDays: 30,
    exportFormat: 'csv'
  }
};
```

### Responsividad

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: 
  - `sm`: 640px+
  - `md`: 768px+
  - `lg`: 1024px+ (sidebar lateral)
- **Navigation**: Tabs en móvil, sidebar en desktop

### Accesibilidad

- **Keyboard navigation**: Navegación completa por teclado
- **ARIA labels**: Etiquetas descriptivas para lectores de pantalla
- **Focus management**: Estados de foco visibles
- **Color contrast**: Cumple con WCAG 2.1 AA

### Extensibilidad

El componente está diseñado para ser fácilmente extensible:

1. **Nuevas secciones**: Agregar elementos al array `sections`
2. **Nuevas configuraciones**: Expandir el objeto `settings`
3. **Nuevos tipos de input**: Crear componentes personalizados
4. **Integración con APIs**: Agregar funciones async para guardar en servidor

### Próximas Mejoras

- [ ] Sincronización con backend
- [ ] Configuraciones por rol de usuario
- [ ] Temas personalizables
- [ ] Importación/exportación de configuraciones
- [ ] Configuraciones avanzadas de alertas
- [ ] Historial de cambios

---

*Desarrollado siguiendo las mejores prácticas de React y UX/UI para SmartBee v1.0*
