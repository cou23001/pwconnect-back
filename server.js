const app = require('./app');
const { connectToDatabase } = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    // Start the server after connecting to the database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start the server:', error);
  });