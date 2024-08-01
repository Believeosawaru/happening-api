import app from "./app.js";
import { port } from "./config/keys.js";

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});