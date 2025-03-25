# Documentación API Nexo - Integración con ESP32

## Descripción General

Esta API maneja la comunicación entre los dispositivos ESP32 y el servidor para el sistema de lealtad. Se divide en dos tipos de dispositivos:

1. ESP32 con sensor RFID (lector)
2. ESP32 con pantalla (display)
3. ESP32 con impresora (para imprimir promociones)

## Conexión de Sensores

### Proceso de Conexión

El sistema implementa un mecanismo para conectar sensores RFID a dispositivos Nexo registrados. Este proceso funciona de la siguiente manera:

1. Un dispositivo Nexo se registra en el sistema (mediante el endpoint `/register`)
2. Inicialmente, el dispositivo se registra con `sensorConectado: false`
3. Un ESP32 con sensor RFID puede consultar si hay dispositivos Nexo sin sensor conectado
4. Cuando encuentra uno, establece la conexión y actualiza el estado del Nexo

### Endpoints para Conexión de Sensores

#### 1. Conectar Sensor

**Endpoint:** `GET /conectarSensor`

**Descripción:** Busca un dispositivo Nexo sin sensor conectado y lo marca como conectado. Si se encuentra un dispositivo disponible, lo actualiza y devuelve sus datos.

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "message": "Sensor conectado exitosamente",
    "data": {
        "establecimientoID": "string",
        "fechaRegistro": "date",
        "ultimoUso": "date",
        "visitasRegistradas": number,
        "sensorConectado": true
    }
}
```

**Respuesta Sin Nexos Disponibles (204):**

```json
{
  "success": false,
  "message": "No hay nexos disponibles"
}
```

#### 2. Verificar Estado del Sensor

**Endpoint:** `GET /:nexoId/status`

**Descripción:** Comprueba el estado actual de un dispositivo Nexo, incluyendo si tiene un sensor conectado.

**Parámetros URL:**

- `nexoId`: ID del dispositivo Nexo

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "data": {
        "establecimientoID": "string",
        "fechaRegistro": "date",
        "ultimoUso": "date",
        "visitasRegistradas": number,
        "sensorConectado": boolean
    }
}
```

**Respuesta Sensor No Conectado (204):**

```json
{
  "success": false,
  "message": "Sensor no conectado"
}
```

## Endpoints para ESP32 con Sensor RFID

### 1. Registrar Visita

**Endpoint:** `POST /registrarVisita`

**Descripción:** Registra la visita de un cliente cuando se detecta su tarjeta RFID.

**Request Body:**

```json
{
  "clienteID": "string", // ID público del cliente
  "establecimientoID": "string" // ID del establecimiento
}
```

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "message": "Visita registrada exitosamente",
    "clienteData": {
        "publicID": "string",
        "nombre": "string",
        "fotoPerfil": "string",
        "resize": boolean
    },
    "tarjetaInfo": {
        "negocio_id": "string",
        "nivel": number,
        "visitas": number,
        "ultimaVisita": "date"
    },
    "visitasTotal": number
}
```

### 2. Mostrar en Pantalla

**Endpoint:** `POST /mostrarEnPantalla`

**Descripción:** Crea un mensaje para mostrar en la pantalla del establecimiento con la información del cliente y sus promociones.

**Request Body:**

```json
{
  "clienteID": "string", // ID público del cliente
  "establecimientoID": "string" // ID del establecimiento
}
```

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "message": "Mensaje creado para pantalla",
    "data": {
        "clienteID": "string",
        "establecimientoID": "string",
        "promociones": ["string"],
        "datosCliente": {
            "nombre": "string",
            "fotoPerfil": "string",
            "nivel": number
        },
        "mostrado": false,
        "fechaCreacion": "date"
    }
}
```

### 3. Crear Tarjeta Nueva

**Endpoint:** `POST /crearTarjetaNueva`

**Descripción:** Crea una nueva tarjeta de lealtad para un cliente cuando visita por primera vez un establecimiento.

**Request Body:**

```json
{
  "clienteID": "string", // ID público del cliente
  "establecimientoID": "string" // ID del establecimiento
}
```

**Respuesta Exitosa (201):**

```json
{
    "success": true,
    "message": "Tarjeta de lealtad creada exitosamente",
    "tarjetaInfo": {
        "negocio_id": "string",
        "nivel": number,
        "visitas": number,
        "ultimaVisita": "date"
    }
}
```

### 4. Obtener Promociones de Usuario

**Endpoint:** `GET /promocionUsuario/:clienteID/:establecimientoID`

**Descripción:** Obtiene las promociones disponibles para un cliente en un establecimiento específico.

**Parámetros URL:**

- `clienteID`: ID público del cliente
- `establecimientoID`: ID del establecimiento

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "message": "Promociones encontradas",
    "data": {
        "promociones": [
            {
                "_id": "string",
                "negocioID": "string",
                "titulo": "string",
                "descripcion": "string",
                "nivelReq": number,
                "status": "string"
            }
        ],
        "nivel": number
    }
}
```

### 5. Canjear Promoción

**Endpoint:** `POST /canjearPromocion/:promocionID/:clienteID/:establecimientoID`

**Descripción:** Registra el canje de una promoción por parte de un cliente.

**Parámetros URL:**

- `promocionID`: ID de la promoción
- `clienteID`: ID público del cliente
- `establecimientoID`: ID del establecimiento

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "message": "Promoción canjeada exitosamente",
    "data": {
        "promocionesCanjeadas": number
    }
}
```

## Endpoint para ESP32 con Pantalla

### 1. Obtener Mensaje de Pantalla

**Endpoint:** `GET /mensajePantalla/:establecimientoID`

**Descripción:** Obtiene el mensaje más reciente no mostrado para el establecimiento. Al obtener el mensaje, se marca automáticamente como mostrado.

**Parámetros URL:**

- `establecimientoID`: ID del establecimiento

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "message": "Mensaje recuperado exitosamente",
    "data": {
        "clienteID": "string",
        "establecimientoID": "string",
        "promociones": ["string"],
        "datosCliente": {
            "nombre": "string",
            "fotoPerfil": "string",
            "nivel": number
        },
        "mostrado": true,
        "fechaCreacion": "date",
        "fechaMostrado": "date"
    }
}
```

**Respuesta Sin Mensajes (205):**

```json
{
  "success": true,
  "message": "No hay mensajes para mostrar"
}
```

## Endpoints para ESP32 con Impresora

### 1. Registrar Impresión de Promoción

**Endpoint:** `POST /nexo/impresoraPromocion`

**Descripción:** Registra una solicitud para imprimir una promoción específica para un cliente.

**Request Body:**

```json
{
  "promocionID": "string", // ID de la promoción
  "clienteID": "string", // ID público del cliente
  "establecimientoID": "string" // ID del establecimiento
}
```

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "message": "Impresión creada exitosamente",
    "data": {
        "clienteID": "string",
        "nombreCliente": "string",
        "nivelCliente": number,
        "establecimientoID": "string",
        "nombreEstablecimiento": "string",
        "promocionID": "string",
        "tituloPromocion": "string",
        "descripcionPromocion": "string",
        "fecha": "date",
        "mostrado": false
    }
}
```

### 2. Obtener Impresiones Pendientes

**Endpoint:** `GET /nexo/impresiones/:establecimientoID`

**Descripción:** Obtiene la siguiente impresión pendiente para un establecimiento. Al obtener la impresión, se marca automáticamente como mostrada.

**Parámetros URL:**

- `establecimientoID`: ID del establecimiento

**Respuesta Exitosa (200):**

```json
{
    "success": true,
    "message": "Impresión recuperada exitosamente",
    "data": {
        "clienteID": "string",
        "nombreCliente": "string",
        "nivelCliente": number,
        "establecimientoID": "string",
        "nombreEstablecimiento": "string",
        "promocionID": "string",
        "tituloPromocion": "string",
        "descripcionPromocion": "string",
        "fecha": "date",
        "mostrado": true
    }
}
```

**Respuesta Sin Impresiones (205):**

```json
{
  "success": true,
  "message": "No hay impresiones pendientes",
  "data": null
}
```

## Flujo de Operación

1. **ESP32 con Sensor RFID:**

   - Cuando detecta una tarjeta RFID:
     1. Llama a `/registrarVisita` para registrar la visita
     2. Inmediatamente después, llama a `/mostrarEnPantalla` para crear el mensaje

2. **ESP32 con Pantalla:**

   - Realiza polling cada X segundos a `/mensajePantalla/:establecimientoID`
   - Si hay un mensaje nuevo, lo muestra en pantalla
   - Si no hay mensajes, continúa con el polling

3. **ESP32 con Impresora:**
   - Realiza polling cada X segundos a `/nexo/impresiones/:establecimientoID`
   - Si hay una impresión pendiente, la imprime
   - Si no hay impresiones, continúa con el polling

## Códigos de Estado HTTP

- 200: Operación exitosa
- 201: Recurso creado exitosamente
- 205: No hay mensajes para mostrar
- 404: Recurso no encontrado
- 500: Error interno del servidor

## Notas Importantes

1. El ESP32 con pantalla debe implementar un intervalo de polling razonable (recomendado: 2-5 segundos)
2. Los mensajes se marcan automáticamente como mostrados al ser recuperados
3. Solo se devuelve el mensaje más reciente no mostrado
4. Es importante manejar los errores de red y reintentar las peticiones en caso de fallo
5. El dispositivo con impresora debe implementar un manejo de cola para las impresiones

## Ejemplo de Implementación en ESP32

### ESP32 con Sensor RFID

```cpp
void handleRFIDDetection(String cardId) {
    // Registrar visita
    HTTPClient http;
    http.begin("http://tu-servidor/registrarVisita");
    http.addHeader("Content-Type", "application/json");

    String jsonBody = "{\"clienteID\":\"" + cardId + "\",\"establecimientoID\":\"TU_ESTABLECIMIENTO_ID\"}";
    int httpCode = http.POST(jsonBody);

    if (httpCode == 200) {
        // Crear mensaje para pantalla
        http.begin("http://tu-servidor/mostrarEnPantalla");
        http.addHeader("Content-Type", "application/json");
        httpCode = http.POST(jsonBody);
    }

    http.end();
}

void connectSensor() {
    // Intentar conectar el sensor a un Nexo disponible
    HTTPClient http;
    http.begin("http://tu-servidor/conectarSensor");
    int httpCode = http.GET();

    if (httpCode == 200) {
        String payload = http.getString();
        // Procesar la respuesta y guardar el ID del Nexo
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, payload);
        String nexoId = doc["data"]["_id"];

        // Guardar el ID del Nexo para futuras consultas
        saveNexoId(nexoId);
        Serial.println("Sensor conectado exitosamente al Nexo: " + nexoId);
    } else if (httpCode == 204) {
        Serial.println("No hay Nexos disponibles para conectar");
        // Esperar un tiempo y volver a intentar
        delay(30000);
    } else {
        Serial.println("Error en la conexión: " + String(httpCode));
    }

    http.end();
}

void setup() {
    // ... other setup code ...

    // Intentar conectar el sensor
    connectSensor();
}

void loop() {
    // ... other loop code ...

    // Si no se ha conectado, intentar de nuevo periódicamente
    if (!isSensorConnected) {
        connectSensor();
    }
}
```

### ESP32 con Pantalla

```cpp
void checkForNewMessages() {
    HTTPClient http;
    http.begin("http://tu-servidor/mensajePantalla/TU_ESTABLECIMIENTO_ID");
    int httpCode = http.GET();

    if (httpCode == 200) {
        String payload = http.getString();
        // Procesar y mostrar el mensaje en la pantalla
        displayMessage(payload);
    }

    http.end();
}

void loop() {
    checkForNewMessages();
    delay(3000); // Esperar 3 segundos antes de la siguiente consulta
}
```

### ESP32 con Impresora

```cpp
void checkForPendingPrints() {
    HTTPClient http;
    http.begin("http://tu-servidor/nexo/impresiones/TU_ESTABLECIMIENTO_ID");
    int httpCode = http.GET();

    if (httpCode == 200) {
        String payload = http.getString();
        // Procesar e imprimir la promoción
        printPromotion(payload);
    }

    http.end();
}

void loop() {
    checkForPendingPrints();
    delay(3000); // Esperar 3 segundos antes de la siguiente consulta
}
```
