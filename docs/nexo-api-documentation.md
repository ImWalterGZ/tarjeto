# Nexo IoT Device API Documentation

## Overview

This document describes the APIs available for the Nexo IoT device to interact with the Tarjeto platform. The Nexo device is responsible for handling customer loyalty card operations at physical establishments.

## Base URL

```
https://www.api.tarjeto.app
```

## Authentication

The Nexo device uses HTTPS with certificate validation. The server uses Google Trust Services Root R4 Certificate for SSL/TLS verification.

## Available Endpoints

### 1. Register Nexo Device

Registers a new Nexo device with an establishment using a connection code.

**Endpoint:** `POST /api/nexo/register`

**Request Body:**

```json
{
  "connectionCode": "12345" // 5-digit connection code
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "nexoId": "device_id_here",
    "establecimientoId": "establishment_id_here"
  },
  "message": "Nexo registrado exitosamente"
}
```

**Error Responses:**

- 404: "Código inválido o expirado"
- 400: "Este establecimiento ya tiene un Nexo registrado"
- 500: Server error

### 2. Get Nexo Status

Retrieves the current status and information about a registered Nexo device.

**Endpoint:** `GET /api/nexo/:nexoId/status`

**Parameters:**

- `nexoId`: The ID of the Nexo device

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "nexo_id",
    "establecimientoID": {
      "_id": "establishment_id",
      "nombre": "Establishment Name"
      // ... other establishment details
    },
    "fechaRegistro": "2024-03-21T12:00:00.000Z"
  }
}
```

### 3. Get Customer Data

Retrieves customer information and loyalty card status for a specific customer at an establishment.

**Endpoint:** `GET /api/nexo/datosCliente/:clienteId/:establecimientoID`

**Parameters:**

- `clienteId`: Customer's public ID
- `establecimientoID`: Establishment's ID

**Response:**

```json
{
  "success": true,
  "clienteData": {
    "publicID": "customer_id",
    "resize": false,
    "nombre": "Customer Name",
    "fotoPerfil": "base64_image_data"
  },
  "tieneTarjeta": true,
  "tarjetaInfo": {
    "negocio_id": "business_id",
    "nivel": 0,
    "visitas": 5,
    "ultimaVisita": "2024-03-21T12:00:00.000Z"
  },
  "message": "Cliente tiene tarjeta de lealtad"
}
```

### 4. Create New Loyalty Card

Creates a new loyalty card for a customer at an establishment.

**Endpoint:** `POST /api/nexo/crearTarjetaNueva`

**Request Body:**

```json
{
  "clienteID": "customer_id",
  "establecimientoID": "establishment_id"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Tarjeta de lealtad creada exitosamente",
  "tarjetaInfo": {
    "negocio_id": "business_id",
    "nivel": 0,
    "visitas": 1,
    "ultimaVisita": "2024-03-21T12:00:00.000Z"
  }
}
```

### 5. Register Visit

Records a customer visit at an establishment and updates their loyalty card.

**Endpoint:** `POST /api/nexo/registrarVisita`

**Request Body:**

```json
{
  "clienteID": "customer_id",
  "establecimientoID": "establishment_id"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Visita registrada exitosamente",
  "tarjetaInfo": {
    "negocio_id": "business_id",
    "nivel": 0,
    "visitas": 6,
    "ultimaVisita": "2024-03-21T12:00:00.000Z"
  },
  "visitasTotal": 6
}
```

## Data Flow

1. **Device Registration:**

   - Nexo device connects to WiFi
   - Device registers using establishment's connection code
   - Server validates code and creates Nexo-Establishment association
   - Device stores received nexoId in EEPROM

2. **Customer Visit Flow:**

   - Customer presents loyalty card/ID
   - Device queries customer data
   - If no card exists, creates new loyalty card
   - If card exists, registers visit
   - Updates establishment metrics

3. **Error Handling:**
   - All endpoints return appropriate HTTP status codes
   - Error responses include descriptive messages
   - Device should handle connection errors and retry logic

## Implementation Notes

1. **HTTPS Connection:**

   - Device must use HTTPS with valid certificate
   - Server uses Google Trust Services Root R4 Certificate
   - Implement proper certificate validation

2. **Data Storage:**

   - Device stores nexoId in EEPROM
   - Maximum nexoId length: 24 characters (MongoDB ObjectId)

3. **Error Handling:**

   - Implement retry logic for failed requests
   - Handle network disconnections gracefully
   - Validate all input data before sending

4. **Security:**
   - All communication must be over HTTPS
   - Validate all input data
   - Implement proper error handling
   - No sensitive data should be stored in device memory

## Example Arduino Implementation

The `certificateTest.ino` file provides a reference implementation showing:

- WiFi connection setup
- HTTPS client configuration
- Certificate validation
- API request handling
- Response parsing
- Error handling
- EEPROM storage for nexoId
