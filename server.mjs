import { Flagsmith } from "flagsmith-nodejs";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Inicializar cliente de Flagsmith
const flagsmith = new Flagsmith({
  environmentKey: process.env.FLAGSMITH_ENV_KEY,
});

app.get("/", async (req, res) => {
  // Identificador del usuario para evaluación de flags
  const userId = "user-key-123abcde";

  try {
    // Obtener flags para el usuario (identity flags = flags + traits del user)
    const flags = await flagsmith.getIdentityFlags(userId, {
      email: "test@example.com",
    });

    // Evaluar el feature flag
    const showFeature = flags.isFeatureEnabled("feat-new-menu");

    if (showFeature) {
      console.log("feature true");
      res.send("🎉 Feature flag is ON - New menu active!");
    } else {
      console.log("feature false");
      res.send("Feature flag is OFF - Original menu");
    }
  } catch (error) {
    console.error("Error evaluating flags:", error);
    res.status(500).send("Error evaluating flags");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
