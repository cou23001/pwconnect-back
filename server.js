const app = require('./app');
const { connectToDatabase } = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3400;

//Connect to MongoDB
connectToDatabase()
  .then(() => {
    // Start the server after connecting to the database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Failed to start the server:', error);
  });