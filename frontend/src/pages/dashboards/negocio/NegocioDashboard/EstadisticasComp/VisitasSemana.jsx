import Container from "../../../Components/Cards/Container";
import { useEffect, useState } from "react";
import apiClient from "../../../../../config/axios";

export default function VisitasSemana({ negocio }) {
  const tarjetaStyle = "bg-white rounded-lg shadow-lg w-1/2 h-full p-4 ";
  const [stats, setStats] = useState({
    totalVisitas: 0,
    clientesFrecuentes: 0,
    clientesNuevos: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchVisitStats = async () => {
      console.log("Starting fetchVisitStats with negocio:", negocio);
      if (!negocio?.publicID) {
        console.log("No publicID found, skipping fetch");
        return;
      }

      try {
        // Get current week's start and end dates
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        ); // Monday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
        endOfWeek.setHours(23, 59, 59, 999);

        // Get last 30 days date for frequent customers
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        console.log("Date ranges calculated:", {
          startOfWeek: startOfWeek.toISOString(),
          endOfWeek: endOfWeek.toISOString(),
          thirtyDaysAgo: thirtyDaysAgo.toISOString(),
          today: today.toISOString(),
        });

        console.log(
          "Making API calls to:",
          `/api/visita/negocio/${negocio.publicID}`
        );

        // Fetch visits for this week
        const [weekVisits, monthVisits] = await Promise.all([
          apiClient.get(`/api/visita/negocio/${negocio.publicID}`, {
            params: {
              startDate: startOfWeek.toISOString(),
              endDate: endOfWeek.toISOString(),
            },
          }),
          apiClient.get(`/api/visita/negocio/${negocio.publicID}`, {
            params: {
              startDate: thirtyDaysAgo.toISOString(),
              endDate: today.toISOString(),
            },
          }),
        ]);

        console.log("API responses received:", {
          weekVisits: weekVisits.data,
          monthVisits: monthVisits.data,
        });

        // Process the data
        const weeklyVisits = weekVisits.data.data;
        const monthlyVisits = monthVisits.data.data;

        console.log("Processing visits data:", {
          weeklyVisitsCount: weeklyVisits.length,
          monthlyVisitsCount: monthlyVisits.length,
        });

        // Count unique clients this week (including anonymous visitors)
        const uniqueClientsThisWeek = new Set(
          weeklyVisits.map((v) => v.clienteID.publicID)
        );

        console.log("Unique clients this week:", uniqueClientsThisWeek.size);

        // Separate anonymous and registered visits for better metrics
        const anonymousVisits = monthlyVisits.filter((visit) =>
          visit.clienteID.publicID.startsWith("anonymous-")
        );

        const registeredVisits = monthlyVisits.filter(
          (visit) => !visit.clienteID.publicID.startsWith("anonymous-")
        );

        console.log(
          `Anonymous visits: ${anonymousVisits.length}, Registered visits: ${registeredVisits.length}`
        );

        // Count frequent clients (2+ visits in last 30 days) - only for registered clients
        const visitsByClient = registeredVisits.reduce((acc, visit) => {
          const clientID = visit.clienteID.publicID;
          acc[clientID] = (acc[clientID] || 0) + 1;
          return acc;
        }, {});

        console.log("Visits by client:", visitsByClient);

        const frequentClients = Object.values(visitsByClient).filter(
          (visits) => visits >= 2
        ).length;

        console.log("Frequent clients count:", frequentClients);

        // Count new clients (first visit ever was this week)
        const registeredWeeklyVisits = weeklyVisits.filter(
          (visit) => !visit.clienteID.publicID.startsWith("anonymous-")
        );

        const newClients = registeredWeeklyVisits.reduce((count, visit) => {
          const clientVisits = visitsByClient[visit.clienteID.publicID];
          return count + (clientVisits === 1 ? 1 : 0);
        }, 0);

        console.log("New clients count:", newClients);

        setStats({
          totalVisitas: uniqueClientsThisWeek.size,
          clientesFrecuentes: frequentClients,
          clientesNuevos: newClients,
          loading: false,
          error: null,
        });

        console.log("Stats updated successfully");
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params,
          },
        });

        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Error al cargar las estadísticas",
        }));
      }
    };

    fetchVisitStats();
  }, [negocio?.publicID]);

  if (stats.loading) {
    return (
      <Container
        titulo={"Visitas de la semana"}
        button={"Ver las estadísticas"}
      >
        <div className="flex items-center justify-center h-full">
          <p>Cargando estadísticas...</p>
        </div>
      </Container>
    );
  }

  if (stats.error) {
    return (
      <Container
        titulo={"Visitas de la semana"}
        button={"Ver las estadísticas"}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{stats.error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container titulo={"Visitas de la semana"} button={"Ver las estadísticas"}>
      <div className="flex flex-row gap-2 h-full">
        <div className={`${tarjetaStyle} `}>
          <div>
            <h1 className=" text-red-primary font-bold text-2xl">
              {stats.totalVisitas}
            </h1>
            <h2>clientes, han visitado tu negocio esta semana</h2>
          </div>
          <div>
            <h1 className=" text-red-primary font-bold text-2xl">13</h1>
            <h2>clientes frecuentes</h2>
          </div>
          <div>
            <h1 className=" text-red-primary font-bold text-2xl">9</h1>
            <h2>clientes nuevos.</h2>
          </div>
        </div>
        <div
          className={`${tarjetaStyle} h-full relative flex flex-row justify-end gap-2 items-baseline bg-green-300 `}
        >
          {" "}
          <div className="h-2/6 bg-neutral-700 rounded-xl flex items-end px-2 pb-4 text-sm text-white">
            Semana {new Date().getWeek() - 2}
          </div>
          <div className="h-4/6 bg-neutral-700 rounded-xl flex items-end px-2 pb-4 text-sm text-white">
            Semana {new Date().getWeek() - 1}
          </div>
          <div className="h-5/6 bg-red-primary rounded-xl flex items-end px-2 pb-4 text-sm text-white">
            {" "}
            Semana {new Date().getWeek()}
          </div>
        </div>
      </div>
    </Container>
  );
}

// Helper function to get week number
Date.prototype.getWeek = function () {
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(
    ((this - firstDayOfYear) / 86400000 + firstDayOfYear.getDay() + 1) / 7
  );
};
