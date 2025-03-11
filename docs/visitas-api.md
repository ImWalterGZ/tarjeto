# Visitas API Documentation

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Register Visit](#register-visit)
  - [Get Business Visits](#get-business-visits)
  - [Get Client Visits](#get-client-visits)
  - [Get Visit Statistics](#get-visit-statistics)
  - [Get Hourly Traffic](#get-hourly-traffic)
- [Models](#models)
- [Error Handling](#error-handling)

## Overview

This API provides endpoints to manage and analyze visits in the Tarjeto platform. It includes functionality for registering visits, retrieving visit history, and analyzing traffic patterns.

## Base URL

```
http://your-api-domain/api/visitas
```

## Authentication

All endpoints require authentication via JWT token (implementation details to be added).

## Endpoints

### Register Visit

Register a new visit to a business establishment.

```http
POST /api/visitas/

Headers:
{
    "Content-Type": "application/json"
}

Body:
{
    "negocioID": "NEG12345678",        // Business publicID
    "establecimientoID": "EST87654321", // Establishment ID
    "clienteID": "CLI98765432"         // Client publicID
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "_id": "65f4c3d123456789",
    "clienteID": "65f4c3d123456789",
    "negocioID": "65f4c3d123456789",
    "establecimientoID": "EST87654321",
    "fecha": "2024-03-15T14:30:00.000Z",
    "hora": 14,
    "trafico": 1
  }
}
```

### Get Business Visits

Retrieve visits for a specific business with optional date filtering.

```http
GET /api/visitas/negocio/:negocioID

Example: GET /api/visitas/negocio/NEG12345678

Optional Query Parameters:
?startDate=2024-03-01T00:00:00.000Z
?endDate=2024-03-15T23:59:59.999Z

Headers:
{
    "Content-Type": "application/json"
}
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f4c3d123456789",
      "clienteID": {
        "publicID": "CLI98765432",
        "datosPersonales": {
          "nombre": "Juan Pérez"
        }
      },
      "fecha": "2024-03-15T14:30:00.000Z",
      "hora": 14,
      "trafico": 1
    }
    // ... more visits
  ]
}
```

### Get Client Visits

Retrieve visits for a specific client with optional date filtering.

```http
GET /api/visitas/cliente/:clienteID

Example: GET /api/visitas/cliente/CLI98765432

Optional Query Parameters:
?startDate=2024-03-01T00:00:00.000Z
?endDate=2024-03-15T23:59:59.999Z

Headers:
{
    "Content-Type": "application/json"
}
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f4c3d123456789",
      "negocioID": {
        "publicID": "NEG12345678",
        "nombreComercial": "Restaurant Example"
      },
      "fecha": "2024-03-15T14:30:00.000Z",
      "hora": 14,
      "trafico": 1
    }
    // ... more visits
  ]
}
```

### Get Visit Statistics

Get detailed visit statistics for a business.

```http
GET /api/visitas/stats/:negocioID

Example: GET /api/visitas/stats/NEG12345678

Optional Query Parameters:
?startDate=2024-03-01T00:00:00.000Z
?endDate=2024-03-15T23:59:59.999Z

Headers:
{
    "Content-Type": "application/json"
}
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "year": 2024,
        "month": 3,
        "day": 15
      },
      "horasPico": [
        {
          "hora": 14,
          "visitas": 25,
          "traficoPromedio": 1.2
        }
        // ... more hours
      ],
      "totalVisitasDia": 150
    }
    // ... more days
  ]
}
```

### Get Hourly Traffic

Get traffic patterns by hour for a business.

```http
GET /api/visitas/trafico/:negocioID

Example: GET /api/visitas/trafico/NEG12345678

Headers:
{
    "Content-Type": "application/json"
}
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": 14,
      "totalVisitas": 250,
      "traficoPromedio": 1.3
    }
    // ... more hours
  ]
}
```

## Models

### Visit Schema

```javascript
{
    clienteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    negocioID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Negocio",
        required: true,
    },
    establecimientoID: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now,
    },
    hora: {
        type: Number,
        required: true,
    },
    trafico: {
        type: Number,
        required: true,
    }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side issue

### Examples of Error Responses

#### Resource Not Found

```json
{
  "success": false,
  "message": "Cliente no encontrado"
}
```

```json
{
  "success": false,
  "message": "Negocio no encontrado"
}
```

```json
{
  "success": false,
  "message": "Establecimiento no encontrado para este negocio"
}
```

#### Invalid Input

```json
{
  "success": false,
  "message": "Datos de visita inválidos"
}
```

#### Date Range Error

```json
{
  "success": false,
  "message": "Rango de fechas inválido"
}
```

## Notes

- All timestamps are in ISO 8601 format
- Hour values are in 24-hour format (0-23)
- Traffic values start at 1 and may be adjusted based on concurrent visits
- Date ranges are inclusive of start and end dates
- All responses include a `success` boolean indicator
