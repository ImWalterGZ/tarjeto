const express = require("express");

const app = express();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log("Server started"));

app.use(express.static("build"));

const users = [
  {
    name: "Walter",
    apellido: "Gonzalez",
    tarjetas: [
      {
        nombre: "Shugu",
        nivel: 2,
        visitasTotales: 14,
        visitasParaSiguienteNivel: 24,
      },
      {
        nombre: "Perlita Joyería",
        nivel: 1,
        visitasTotales: 3,
        visitasParaSiguienteNivel: 8,
      },
      {
        nombre: "Caffenio",
        nivel: 3,
        visitasTotales: 25,
        visitasParaSiguienteNivel: 50,
      },
    ],
  },
];
app.get("/api/users", (req, res) => {
  res.send(users);
});
