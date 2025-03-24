# Documentación API Nexo - Integración con ESP32

## Descripción General

Esta API maneja la comunicación entre los dispositivos ESP32 y el servidor para el sistema de lealtad. Se divide en dos tipos de dispositivos:

1. ESP32 con sensor RFID (lector)
2. ESP32 con pantalla (display)

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

## Flujo de Operación

1. **ESP32 con Sensor RFID:**

   - Cuando detecta una tarjeta RFID:
     1. Llama a `/registrarVisita` para registrar la visita
     2. Inmediatamente después, llama a `/mostrarEnPantalla` para crear el mensaje

2. **ESP32 con Pantalla:**
   - Realiza polling cada X segundos a `/mensajePantalla/:establecimientoID`
   - Si hay un mensaje nuevo, lo muestra en pantalla
   - Si no hay mensajes, continúa con el polling

## Códigos de Estado HTTP

- 200: Operación exitosa
- 205: No hay mensajes para mostrar
- 404: Recurso no encontrado
- 500: Error interno del servidor

## Notas Importantes

1. El ESP32 con pantalla debe implementar un intervalo de polling razonable (recomendado: 2-5 segundos)
2. Los mensajes se marcan automáticamente como mostrados al ser recuperados
3. Solo se devuelve el mensaje más reciente no mostrado
4. Es importante manejar los errores de red y reintentar las peticiones en caso de fallo

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
