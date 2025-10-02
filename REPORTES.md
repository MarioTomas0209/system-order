# Sistema de Reportes

## Descripción General

El sistema de reportes proporciona visualizaciones interactivas de los datos del sistema de órdenes, permitiendo analizar información de órdenes, pagos, entregas, usuarios y sucursales mediante gráficas dinámicas.

## Características

### 📊 5 Secciones de Reportes

#### 1. **Órdenes**
- **Órdenes por Estado**: Gráfica circular mostrando la distribución de órdenes (En Elaboración, Entregada, Cancelada)
- **Órdenes por Sucursal**: Gráfica de barras con la cantidad de órdenes por cada sucursal
- **Órdenes por Mes**: Línea temporal mostrando la evolución mensual de órdenes
- **Ventas Mensuales**: Gráfica de área con totales, anticipos y saldos por mes

#### 2. **Pagos**
- **Pagos por Método**: Distribución circular de pagos (Efectivo, Tarjeta, Transferencia)
- **Total Recaudado por Método**: Monto total en pesos por cada método de pago
- **Pagos por Mes**: Cantidad y monto total de pagos mensuales

#### 3. **Entregas**
- **Entregas por Estado**: Distribución de entregas (Pendiente, Entregado, Parcial)
- **Entregas por Método**: Tipos de entrega (Recolección, Envío, Entrega Directa)
- **Entregas por Mes**: Evolución mensual de entregas realizadas

#### 4. **Usuarios**
- **Usuarios por Estado**: Distribución de usuarios activos e inactivos
- **Usuarios por Rol**: Proporción de administradores vs usuarios regulares
- **Top 10 Usuarios**: Los 10 usuarios más productivos en creación de órdenes

#### 5. **Sucursales**
- **Sucursales por Estado**: Sucursales activas e inactivas
- **Órdenes por Sucursal**: Cantidad de órdenes gestionadas por cada sucursal
- **Ingresos por Sucursal**: Total de ingresos generados por sucursal

## Instalación y Configuración

### 1. Instalar Dependencias

```bash
# Instalar recharts para las gráficas
npm install recharts

# Instalar componente tabs de shadcn/ui
npx shadcn@latest add tabs --yes
```

### 2. Ejecutar Migraciones

```bash
php artisan migrate
```

### 3. Poblar Base de Datos (Opcional)

Para ver las gráficas con datos de prueba:

```bash
php artisan db:seed
```

Esto creará:
- Usuarios de prueba
- Sucursales de prueba
- 50 órdenes con datos variados de los últimos 6 meses
- Pagos asociados a las órdenes
- Entregas asociadas a órdenes completadas

### 4. Compilar Frontend

```bash
npm run dev
# o para producción
npm run build
```

## Uso

1. Navega a la ruta `/reports` en tu aplicación
2. Utiliza las pestañas superiores para cambiar entre secciones
3. Las gráficas son interactivas:
   - Pasa el cursor sobre los elementos para ver detalles
   - Los porcentajes se calculan automáticamente
   - Las leyendas muestran los colores de cada categoría

## Estructura de Archivos

### Backend (PHP/Laravel)

```
app/Http/Controllers/Reports/
└── ReportController.php          # Controlador que procesa y envía datos

routes/
└── reports.php                    # Rutas de reportes
```

### Frontend (React/TypeScript)

```
resources/js/
├── components/charts/
│   ├── chart-config.ts           # Configuración de colores
│   ├── pie-chart-card.tsx        # Componente de gráfica circular
│   ├── bar-chart-card.tsx        # Componente de gráfica de barras
│   ├── line-chart-card.tsx       # Componente de gráfica de líneas
│   └── area-chart-card.tsx       # Componente de gráfica de área
│
└── pages/reports/
    └── Index.tsx                  # Página principal de reportes
```

### Base de Datos

```
database/seeders/
├── DatabaseSeeder.php            # Seeder principal
├── UserSeeder.php                # Datos de usuarios
├── BranchSeeder.php              # Datos de sucursales
└── OrderSeeder.php               # Datos de órdenes, pagos y entregas
```

## Personalización

### Cambiar Colores

Edita el archivo `resources/js/components/charts/chart-config.ts`:

```typescript
export const CHART_COLORS = [
    '#3b82f6', // Azul
    '#10b981', // Verde
    '#f59e0b', // Ámbar
    // ... agrega más colores
];
```

### Agregar Nuevas Gráficas

1. Crea el método de obtención de datos en `ReportController.php`
2. Agrega el componente de gráfica en `resources/js/pages/reports/Index.tsx`
3. Utiliza los componentes existentes (PieChartCard, BarChartCard, etc.)

### Modificar Período de Datos

En `OrderSeeder.php`, cambia el rango de días:

```php
// De 180 días (6 meses) a otro período
$createdDate = Carbon::now()->subDays(rand(0, 365)); // 1 año
```

## Tecnologías Utilizadas

- **Laravel**: Framework PHP para el backend
- **Inertia.js**: Enlace entre Laravel y React
- **React**: Librería de UI
- **TypeScript**: Tipado estático
- **Recharts**: Librería de gráficas para React
- **Tailwind CSS**: Framework de estilos
- **shadcn/ui**: Componentes de UI

## Mantenimiento

### Actualizar Datos

Los reportes se generan en tiempo real desde la base de datos. No se requiere cache ni actualización manual.

### Optimización

Para mejorar el rendimiento con grandes volúmenes de datos:

1. Agregar índices a las columnas de fecha:
   ```sql
   CREATE INDEX idx_orders_created_date ON orders(created_date);
   CREATE INDEX idx_payments_payment_date ON payments(payment_date);
   CREATE INDEX idx_deliveries_delivery_date ON deliveries(delivery_date);
   ```

2. Implementar cache en el controlador:
   ```php
   $data = Cache::remember('reports_data', 3600, function() {
       return [
           'orders' => $this->getOrdersData(),
           // ...
       ];
   });
   ```

## Soporte

Para problemas o preguntas:
1. Verifica que todas las migraciones estén ejecutadas
2. Asegúrate de que hay datos en la base de datos
3. Revisa los logs de Laravel en `storage/logs/laravel.log`
4. Verifica la consola del navegador para errores de JavaScript

---

**Versión**: 1.0.0  
**Fecha**: Octubre 2025

