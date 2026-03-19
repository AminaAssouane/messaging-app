require("dotenv/config");
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(3000, (error) => {
  if (error) console.log("Error occured : ", error);
  else console.log(`Server running on port ${PORT}`);
});
