const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const companyARoutes = require('./routes/companyARoutes');
app.use('/api/company-a', companyARoutes);

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect ke MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to Company A'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(
    `Auth service running on port ${PORT} documentation in url: http://localhost:${PORT}/api-docs/`
  )
);
