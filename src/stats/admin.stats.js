const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Order = require('../orders/order.model')
const Book = require('../books/book.model')

// function to calculate admin stats
router.get("/", async (req, res) => {
    try{
        // 1. total number of orders
        const totalOrders = await Order.countDocuments();

        // 2. total sales (sum of all  totalprice from orders)
        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice"},
                }
            }
        ]);

        // 4. trending books statistics:
        const trendingBooksCount = await Book.aggregate([
            { $match: { trending: true } }, // match only trending books
            { $count: "trendingBooksCount" } // return the count of trending books
        ]);

        // if you want just the count as a number, you can extract it like this:
        const trendingBooks = trendingBooksCount.length > 0 ? trendingBooksCount[0].
        trendingBooksCount : 0;

        // 5. total number of books
        const totalBooks = await Book.countDocuments();

        // 6. monthly sales (group by month and sum total sales for each month)
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    // by year and month
                    totalSales: { $sum: "$totalPrice"}, // sum totalprice for each month
                    totalOrders: { $sum: 1 } //count total orders for each month
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // result summary
        res.status(200).json({ totalOrders,
            totalSales: totalSales[0]?.totalSales || 0,
            trendingBooks,
            totalBooks,
            monthlySales,
        })
        
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats"})
        
    }
})

module.exports = router;