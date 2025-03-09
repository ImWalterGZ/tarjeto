# MongoDB/Mongoose Example Queries for Tarjeto Application

This document contains example queries using Mongoose for the different collections in the Tarjeto application.

## Adding Elements to Arrays

### Add a new tarjeta (card) to a client's tarjetas array

```javascript
// Using Mongoose Model
await Cliente.findOneAndUpdate(
  { clienteID: "12345" },
  {
    $push: {
      tarjetas: {
        negocio_id: "67890",
        nivel: 1,
        visitas: 1,
        ultimaVisita: new Date(),
      },
    },
  },
  { new: true } // Returns the updated document
);
```

### Add a new establecimiento to a negocio

```javascript
// Using Mongoose Model
await Negocio.findOneAndUpdate(
  { negocioID: "67890" },
  {
    $push: {
      establecimientos: {
        establecimientoID: "EST123",
        nombre: "Sucursal Centro",
        ubicacion: {
          direccion: "Av. Principal 123",
          ciudad: "Ciudad de México",
          estado: "CDMX",
          codigoPostal: "01000",
          coordenadas: {
            latitude: 19.4326,
            longitude: -99.1332,
          },
        },
      },
    },
  },
  { new: true }
);
```

## Modifying Document Information

### Update user information

```javascript
// Using Mongoose Model
await User.findOneAndUpdate(
  { email: "usuario@ejemplo.com" },
  {
    $set: {
      nombre: "Nombre Actualizado",
      "notificaciones.email": false,
      "notificaciones.push": true,
      ultimaConexion: new Date(),
    },
  },
  { new: true }
);

// Alternative using save()
const user = await User.findOne({ email: "usuario@ejemplo.com" });
if (user) {
  user.nombre = "Nombre Actualizado";
  user.notificaciones.email = false;
  user.notificaciones.push = true;
  user.ultimaConexion = new Date();
  await user.save();
}
```

### Update negocio information

```javascript
// Using Mongoose Model
await Negocio.findOneAndUpdate(
  { negocioID: "67890" },
  {
    $set: {
      "informacionGeneral.nombreComercial": "Nuevo Nombre",
      "informacionGeneral.sitioWeb": "www.nuevositio.com",
      color: "#FF5733",
      gradient: "linear-gradient(45deg, #FF5733, #33FF57)",
    },
  },
  { new: true }
);
```

## Removing Elements from Arrays

### Remove a specific tarjeta from a client

```javascript
// Using Mongoose Model
await Cliente.findOneAndUpdate(
  { clienteID: "12345" },
  { $pull: { tarjetas: { negocio_id: "67890" } } },
  { new: true }
);
```

### Remove a specific categoria from a negocio

```javascript
// Using Mongoose Model
await Negocio.findOneAndUpdate(
  { negocioID: "67890" },
  { $pull: { "informacionGeneral.categoria": "Restaurante" } },
  { new: true }
);
```

## Complex Queries with $and

### Find clients with specific card level and visits

```javascript
// Using Mongoose Model
const clients = await Cliente.find({
  $and: [
    { "tarjetas.nivel": { $gte: 3 } },
    { "tarjetas.visitas": { $gt: 10 } },
  ],
});

// Alternative using query builder
const clients = await Cliente.find()
  .where("tarjetas.nivel")
  .gte(3)
  .where("tarjetas.visitas")
  .gt(10)
  .exec();
```

### Find negocios in specific location with high traffic

```javascript
// Using Mongoose Model
const negocios = await Negocio.find({
  $and: [
    { "establecimientos.ubicacion.ciudad": "Ciudad de México" },
    { "establecimientos.metricas.visitasTotales": { $gt: 1000 } },
  ],
});

// Alternative using query builder
const negocios = await Negocio.find()
  .where("establecimientos.ubicacion.ciudad")
  .equals("Ciudad de México")
  .where("establecimientos.metricas.visitasTotales")
  .gt(1000)
  .exec();
```

## Updating Nested Arrays with Conditions

### Update specific establecimiento metrics

```javascript
// Using Mongoose Model
await Negocio.findOneAndUpdate(
  {
    negocioID: "67890",
    "establecimientos.establecimientoID": "EST123",
  },
  {
    $set: {
      "establecimientos.$.metricas.visitasTotales": 1500,
      "establecimientos.$.metricas.visitasPromedioDiarias": 50,
    },
  },
  { new: true }
);
```

### Update specific promotion analytics

```javascript
// Using Mongoose Model
await Promocion.findOneAndUpdate(
  {
    negocioID: "67890",
    "tipoPromo.tipo": "temporal",
  },
  {
    $set: {
      "analitica.vistas": 1000,
      "analitica.usos": 500,
      "analitica.promedioVistaUso": 0.5,
    },
  },
  { new: true }
);
```

## Aggregation Pipeline Examples

### Create a view-like aggregation for active promotions

```javascript
// Using Mongoose Aggregation
const activePromotions = await Promocion.aggregate([
  {
    $match: {
      activo: true,
      "tipoPromo.periodo.fechaFin": { $gt: new Date() },
    },
  },
]);
```

### Aggregate Negocios and their Visitas

```javascript
// Using Mongoose Aggregation
const negociosWithVisits = await Negocio.aggregate([
  {
    $lookup: {
      from: "visitas", // Collection name is usually lowercase and plural
      localField: "negocioID",
      foreignField: "negocioID",
      as: "visitas",
    },
  },
  {
    $project: {
      negocioID: 1,
      "informacionGeneral.nombreComercial": 1,
      establecimientos: 1,
      visitasTotales: { $size: "$visitas" },
    },
  },
]);
```

## Additional Examples

### Find all clients with a specific achievement using populate

```javascript
// Using Mongoose Model with population
const clients = await Cliente.find({
  "logros.categoria": "Fidelidad",
})
  .populate("tarjetas.negocio_id") // If you need to populate related fields
  .exec();
```

### Update client engagement metrics with validation

```javascript
// Using Mongoose Model with validation
const client = await Cliente.findOne({ clienteID: "12345" });
if (client) {
  client.engagement.sesionesTotal += 1;
  client.engagement.ultimoLogin = new Date();
  client.engagement.tiempoPromedioSesion = 15;
  await client.save(); // This will run validation
}
```

### Find promotions by date range with lean query

```javascript
// Using Mongoose Model with lean() for better performance
const promotions = await Promocion.find({
  "tipoPromo.periodo.fechaInicio": { $gte: new Date("2024-01-01") },
  "tipoPromo.periodo.fechaFin": { $lte: new Date("2024-12-31") },
})
  .lean() // Convert to plain JavaScript objects
  .exec();
```

### Bulk update multiple visits

```javascript
// Using Mongoose Model for bulk operations
await Visita.updateMany(
  {
    establecimientoID: "EST123",
    fecha: {
      $gte: new Date("2024-01-01"),
      $lte: new Date("2024-01-31"),
    },
  },
  { $inc: { trafico: 1 } }
);

// Alternative using bulkWrite for multiple operations
await Visita.bulkWrite([
  {
    updateMany: {
      filter: {
        establecimientoID: "EST123",
        fecha: {
          $gte: new Date("2024-01-01"),
          $lte: new Date("2024-01-31"),
        },
      },
      update: { $inc: { trafico: 1 } },
    },
  },
]);
```
