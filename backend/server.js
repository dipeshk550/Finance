// import 'dotenv/config'
// import app from './app.js'
// import { connectDB } from './config/db.js'

// const PORT = process.env.PORT || 5000

// async function start() {
//   await connectDB()
//   app.listen(PORT, () => {
//     console.log(`Finance API running on http://localhost:${PORT}`)
//     console.log(`API docs: http://localhost:${PORT}/api-docs`)
//   })
// }

// start()
import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});