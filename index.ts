import app from "./server/server";

import { Request, Response } from "express";

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
});
