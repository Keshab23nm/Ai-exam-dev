import { config } from "./src/config/config.js";
import app from "./src/app.js";
import connectdb from "./src/config/db.js";
connectdb();
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}   );
