import "dotenv/config";
const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.BACKEND_PORT;
const dataFile = "data.json";

app.use(express.json());

const loadData = () => {
  try {
    const rawData = fs.readFileSync(dataFile);
    return JSON.parse(rawData);
  } catch (err) {
    return [];
  }
};

const saveData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

app.get("/data", (req, res) => {
  const data = loadData();
  res.json(data);
});

app.post("/data", (req, res) => {
  const newData = req.body;
  const data = loadData(); // Charger les données existantes
  data.push(newData); // Ajouter la nouvelle entrée
  saveData(data); // Sauvegarder les données mises à jour

  res.json({ message: "Données enregistrées avec succès", data: newData });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
