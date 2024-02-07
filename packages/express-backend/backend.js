import express from "express";
import cors from "cors";

import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  try {
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await userServices.findUserById(id);
  if (result === undefined || result === null)
    res.status(404).send("Resource not found.");
  else {
    res.send({ users_list: result });
  }
});

app.post("/users", async (req, res) => {
  const userToAdd = req.body;
  try {
    const addedUser = await userServices.addUser(userToAdd);
    res.status(201).send(addedUser);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

app.delete("/users/:id", (req, res) => {
  const userToDelete = req.params.id;
  userServices.deleteUser(userToDelete)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send("Could not find user"); 
    });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});