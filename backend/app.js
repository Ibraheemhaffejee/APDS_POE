const express = require('express');
const connectDB = require('./config/db');         
const authRoutes = require('./routes/auth');      
const userRoutes = require('./routes/user');      
const transactionRoutes = require('./routes/transaction'); 
const postRoutes = require('./routes/posts');
const helmet = require('helmet');                 
const expressBrute = require('express-brute');    
const morgan = require('morgan');                 
const cors = require('cors');                     
const fs = require('fs');                         
const https = require('https');                   
require('dotenv').config();                       

const privateKey = fs.readFileSync('C:/Users/Administrator/Downloads/P2_APDS_Final 6/P2_APDS_Final 5/backend/private.key', 'utf8');
const certificate = fs.readFileSync('C:/Users/Administrator/Downloads/P2_APDS_Final 6/P2_APDS_Final 5/backend/certificate.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();

// Connect to MongoDB
connectDB();

app.use(helmet());               
app.use(morgan('combined'));     

const store = new expressBrute.MemoryStore();    
const bruteforce = new expressBrute(store,{
  freeRetries: 100,   // Increase the retry limit for testing
  minWait: 1 * 60 * 1000,  // Minimum wait time of 1 minute
  maxWait: 60 * 60 * 1000  // Maximum wait time of 1 hour
});      

// Set up CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','x-auth-token'],
  credentials: true
}));

app.options('*', cors());

// ** Add logging middleware here **
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}' from ${req.headers.origin}`);
  next();
});

app.use(express.json()); 

// Define routes with brute force protection
app.use('/api/auth', bruteforce.prevent, authRoutes);             
app.use('/api/user', bruteforce.prevent, userRoutes);             
app.use('/api/transactions', bruteforce.prevent, transactionRoutes);
app.use('/api/posts',bruteforce.prevent, postRoutes); // Define the route for posts



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/', (req, res) => {
  res.send('API is running with CORS and security middleware active!');
});

https.createServer(credentials, app).listen(5001, () => {
  console.log('Secure server running on https://localhost:5001');
});


//const port = process.env.PORT || 3000;//was 3000
  //app.listen(port, () => {
  //console.log(`HTTP server running on http://localhost:${port}`);
//});
