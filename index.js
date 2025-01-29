const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'https://book-app-frontend-green.vercel.app'],
    credentials: true,
}))

// routes
const bookRoutes = require('./src/books/book.route')
const orderRoutes = require('./src/orders/order.route')
const userRoutes = require('./src/users/user.route')
const adminRoutes = require('./src/stats/admin.stats')

app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auth", userRoutes)
app.use("/api/admin", adminRoutes)



// 85VLBqvccRbRv22c

console.log(process.env.DB_URL)
async function main() {
    await mongoose.connect(process.env.DB_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Stop waiting if no response after 5s
      socketTimeoutMS: 45000, // Avoid dropped connections
    });
    app.use('/', (req, res) => {
        res.send('Book server is running')
      })
}

main().then(() => console.log("Mongodb connected successfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})