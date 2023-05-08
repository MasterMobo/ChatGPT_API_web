const express = require("express");
const app = express();

const chatRouter = require("./routes/chat");

app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1/chat", chatRouter);

const PORT = process.env.PORT || 3000;
const start = async () => {
    app.listen(PORT, console.log(`Server is running on port ${PORT}`));
};
start();
