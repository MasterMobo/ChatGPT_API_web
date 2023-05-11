const express = require("express");
const app = express();
const fs = require("fs");
const date = require("date-and-time");

const chatRouter = require("./routes/chat");

app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1/chat", chatRouter);

const PORT = process.env.PORT || 3000;
const start = async () => {
    app.listen(PORT, console.log(`Server is running on port ${PORT}`));
    const now = date.format(new Date(), "DD/MM/YYYY HH:mm:ss");
    fs.appendFileSync("chat.log", `[${now}] <<SESSION STARTED>>\n`, (err) => {
        if (err) throw err;
    });
};
start();
