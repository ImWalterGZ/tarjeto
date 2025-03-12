import cron from "node-cron";
import mongoose from "mongoose";
import { ProgramaLealtad } from "../models/programaLealtad.model.js";
import { Cliente } from "../models/cliente.model.js";

const validateProgram = (programa) => {
  if (!programa.temporadaActual || !programa.temporadaActual.fechaFin) {
    throw new Error("Invalid program data: missing season end date");
  }
  if (!programa.negocioID) {
    throw new Error("Invalid program data: missing business ID");
  }
  return true;
};

const processClientLevel = async (cliente, programa, transiciones) => {
  try {
    const tarjeta = cliente.tarjetas.find(
      (t) => t.negocio_id.toString() === programa.negocioID.toString()
    );

    if (!tarjeta) {
      console.log(`No loyalty card found for client ${cliente._id}`);
      return null;
    }

    const nivelAnterior = tarjeta.nivel;
    let nuevoNivel = nivelAnterior;

    // Process level changes
    if (programa.debeSerDegradado(nivelAnterior, tarjeta.visitas)) {
      switch (nivelAnterior) {
        case 2:
          nuevoNivel = 1;
          transiciones.descensos.plataABronce++;
          break;
        case 3:
          nuevoNivel = 2;
          transiciones.descensos.oroAPlata++;
          break;
        case 4:
          nuevoNivel = 3;
          transiciones.descensos.rubiAOro++;
          break;
      }
    } else if (programa.puedeSerPromovido(nivelAnterior, tarjeta.visitas)) {
      switch (nivelAnterior) {
        case 1:
          nuevoNivel = 2;
          transiciones.ascensos.bronceAPlata++;
          break;
        case 2:
          nuevoNivel = 3;
          transiciones.ascensos.plataAOro++;
          break;
        case 3:
          nuevoNivel = 4;
          transiciones.ascensos.oroARubi++;
          break;
      }
    }

    // Always reset visits for new season
    tarjeta.visitas = 0;

    // Update level if changed
    if (nuevoNivel !== nivelAnterior) {
      tarjeta.nivel = nuevoNivel;
      console.log(
        `Client ${cliente._id} level changed: ${nivelAnterior} -> ${nuevoNivel}`
      );
    }

    return {
      clienteID: cliente._id,
      nivelAnterior,
      nuevoNivel,
      cambioNivel: nivelAnterior !== nuevoNivel,
    };
  } catch (error) {
    console.error(`Error processing client ${cliente._id}:`, error);
    return null;
  }
};

// Internal function to process end of season
export const procesarFinTemporadaInterno = async (programaID) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(`Starting season processing for program ${programaID}`);

    const programa = await ProgramaLealtad.findById(programaID).session(
      session
    );
    if (!programa || !programa.temporadaActual.activa) {
      throw new Error("Program not found or inactive");
    }

    // Validate program data
    validateProgram(programa);

    // Get all clients with cards for this business
    const clientes = await Cliente.find({
      "tarjetas.negocio_id": programa.negocioID,
    }).session(session);

    console.log(
      `Processing ${clientes.length} clients for program ${programaID}`
    );

    const transiciones = {
      ascensos: {
        bronceAPlata: 0,
        plataAOro: 0,
        oroARubi: 0,
      },
      descensos: {
        plataABronce: 0,
        oroAPlata: 0,
        rubiAOro: 0,
      },
    };

    // Process each client's level change
    const clientProcessingResults = [];
    for (const cliente of clientes) {
      const result = await processClientLevel(cliente, programa, transiciones);
      if (result) {
        clientProcessingResults.push(result);
      }
    }

    // Save all client changes
    const savePromises = clientes.map((cliente) => cliente.save({ session }));
    await Promise.all(savePromises);

    // Archive current season with final statistics
    const temporadaFinalizada = {
      ...programa.temporadaActual.toObject(),
      estadisticas: {
        ...programa.temporadaActual.estadisticas,
        clientesAscendidos: transiciones.ascensos,
        clientesDescendidos: transiciones.descensos,
      },
    };
    programa.temporadasAnteriores.push(temporadaFinalizada);

    // Start new season
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 3);

    programa.temporadaActual = {
      fechaInicio,
      fechaFin,
      duracionMeses: 3,
      activa: true,
      estadisticas: {
        promocionesCanjeadas: 0,
        clientesAscendidos: {
          bronceAPlata: 0,
          plataAOro: 0,
          oroARubi: 0,
        },
        clientesDescendidos: {
          plataABronce: 0,
          oroAPlata: 0,
          rubiAOro: 0,
        },
        visitasTotales: 0,
      },
    };

    await programa.save({ session });
    await session.commitTransaction();

    console.log(`Season processed successfully for program ${programaID}`);
    console.log("Transitions summary:", {
      ascensos: transiciones.ascensos,
      descensos: transiciones.descensos,
    });

    return {
      success: true,
      transiciones,
      clientProcessingResults,
    };
  } catch (error) {
    console.error("Error processing end of season:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Initialize cron job with improved season end date checking
export const initializeSeasonProcessor = () => {
  // Run daily at midnight to check for season endings
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running daily season check...");

      // Find all active programs where current season end date has passed
      const programas = await ProgramaLealtad.find({
        "temporadaActual.activa": true,
        "temporadaActual.fechaFin": { $lte: new Date() },
      });

      console.log(
        `Found ${programas.length} programs requiring season processing`
      );

      for (const programa of programas) {
        try {
          console.log(`Processing program ${programa._id}`);
          await procesarFinTemporadaInterno(programa._id);
        } catch (programError) {
          console.error(
            `Error processing program ${programa._id}:`,
            programError
          );
          // Continue with next program even if one fails
        }
      }
    } catch (error) {
      console.error("Error in season processor cron job:", error);
    }
  });

  console.log("Season processor initialized successfully");
};
