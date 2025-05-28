const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./docs/swagger');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const absenseRoutes = require('./routes/absenseRoutes');
app.use('/api/absense', absenseRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to Absense Service'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(
    `Auth service running on port ${PORT} documentation in url: http://localhost:${PORT}/api-docs/`
  )
);
