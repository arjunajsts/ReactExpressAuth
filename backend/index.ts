import { connectToDB } from "@/config/db.js";
import { PORT } from "@/constants/env.js";
import app from "app.js";
import "colors";
import morgan from "morgan";

// Middleware for development logging
app.use(morgan("dev"));

app
  .listen(PORT, async () => {
    console.log(`Application is running on http://localhost:${PORT}`);
    await connectToDB();
  })
  .on("error", (error) => {
    console.log(error);
  });
