# Sistema de Gestión de Pedidos

Este proyecto es un sistema de gestión de pedidos para una tienda online, desarrollado con Node.js (Usando Express) y TypeScript.

## Características

- Registrar pedidos con validación de datos
- Cálculo automático del total del pedido
- Actualizar el estado de un pedido con validación de transiciones permitidas
- Consultar pedidos por email del cliente o estado
- Persistencia en memoria
- API REST con Express
- Validaciones de datos de entrada
- Sistema de logs para todas las acciones

## Estructura del Proyecto

```
orders-management-system/
├── src/
│   ├── controllers/     # Controladores de la API
│   ├── middleware/      # Middleware para validación y logging
│   ├── models/          # Interfaces y modelos de datos
│   ├── repositories/    # Capa de acceso a datos
│   ├── routes/          # Definición de rutas de la API
│   ├── services/        # Lógica de negocio
│   ├── utils/           
│   ├── index.ts         # Punto de entrada de la aplicación
│   └── app.test.ts      # Pruebas de integración
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Tecnologías Utilizadas

- Node.js
- TypeScript
- Express.js para la API REST
- Jest para pruebas unitarias e integración
- UUID para generación de identificadores únicos
- Patrón Singleton para la persistencia de datos

## Requisitos

- Node.js 14 o superior
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   cd orders-management-system
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Compilar la aplicación:
   ```
   npm run build
   ```

## Ejecución

Para iniciar la aplicación en modo desarrollo:
```
npm run dev
```

Para iniciar la aplicación en modo producción:
```
npm start
```

## Pruebas

Para ejecutar las pruebas unitarias:
```
npm test
```

Para ejecutar las pruebas con cobertura:
```
npm run test:coverage
```

## API Endpoints

### Pedidos

- `POST /api/orders`: Crear un nuevo pedido
  - Body: 
    ```json
    {
      "customer": {
        "name": "Nombre Cliente",
        "email": "cliente@ejemplo.com"
      },
      "products": [
        {
          "name": "Producto ejemplo",
          "price": 100,
          "quantity": 2
        }
      ]
    }
    ```

- `GET /api/orders`: Obtener todos los pedidos

- `GET /api/orders/:id`: Obtener un pedido por su ID

- `GET /api/orders/search?email=cliente@ejemplo.com`: Buscar pedidos por email del cliente

- `GET /api/orders/status?status=pendiente`: Buscar pedidos por estado

- `PATCH /api/orders/:id/status`: Actualizar el estado de un pedido
  - Body: 
    ```json
    {
      "status": "procesando"
    }
    ```

## Decisiones de Diseño

### Arquitectura

Se ha seguido un enfoque de arquitectura por capas:
- **Controllers**: Manejan las peticiones HTTP
- **Services**: Contienen la lógica de negocio
- **Repositories**: Gestión de los datos (persistencia)
- **Models**: Interfaces y definiciones de datos

### Validaciones

- Validación de datos en el middleware antes de llegar al controlador
- Validaciones adicionales de lógica de negocio en el servicio
- Transiciones de estado controladas según las reglas definidas

### Persistencia

Se ha implementado un patrón Singleton para el repositorio, simulando una base de datos en memoria.

### Logging

Sistema de logs que registra todas las peticiones y sus resultados, guardando en un archivo JSON y mostrando en consola.