import app from "./server/server";
const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
});


//pruebas

import moment = require('moment');

console.log(new Date().getTime());
console.log(moment('2015-01-01', 'YYYY-MM-DD').toDate().getTime())
