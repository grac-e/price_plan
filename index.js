import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import { totalPhoneBill } from './phoneBill.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.static('public'))
app.use(express.json())

const db = await sqlite.open({
    filename: './data_plan.db',
    driver: sqlite3.Database
});

await db.migrate();

// Calculate the phone bill total using the specified price plan data.
app.post('/api/phonebill', async (req, res) => {
    const { price_plan, actions } = req.body;
    let plan = await totalPhoneBill(price_plan, actions);
    console.log(plan);
    res.json({
        success: true,
        message: 'Phone bill calculated successfully',
        total: `R${plan}`
    });
});

// Return a list of all the available price plans.
app.get('/api/price_plans', async (req, res) => {
    let rows = await db.all("SELECT * FROM price_plan");
    res.json({
        success: true,
        message: 'Price plans retrieved successfully',
        price_plans: rows
    });
});

// create a new price plan
app.post('/api/price_plan/create', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    await db.run("INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES (?, ?, ?)",
        [name, call_cost, sms_cost]);
    res.json({
        success: true,
        message: 'Price plan created successfully'
    });
});

// Update a price plan.
app.post('/api/price_plan/update', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    const result = await db.run("UPDATE price_plan SET call_price = ?, sms_price = ? WHERE plan_name = ?",
        [call_cost, sms_cost, name]);
    
    if (result.changes === 0) {
        return res.status(404).json({ success: false, message: 'Price plan not found' });
    }

    res.json({
        success: true,
        message: 'Price plan updated successfully'
    });
});

// Delete a price plan
app.post('/api/price_plan/delete', async (req, res) => {
    const { id } = req.body;
    const result = await db.run("DELETE FROM price_plan WHERE id = ?", [id]);

    if (result.changes === 0) {
        return res.status(404).json({ success: false, message: 'Price plan not found' });
    }

    res.json({
        success: true,
        message: 'Price plan deleted successfully'
    });
});

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
    console.log(`Server started ${PORT}`);
});