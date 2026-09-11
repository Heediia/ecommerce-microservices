const express = require("express");

const app = express();

const PORT = 3010;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "E-commerce Backend fonctionne !"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});