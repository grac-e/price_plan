import assert from 'assert';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import { totalPhoneBill } from '../phoneBill.js';

describe('The totalPhoneBill function', function () {
    let db;

    before(async () => {
        // Setup an in-memory SQLite database for testing purposes
        db = await sqlite.open({
            filename: './data_plan_test.db', 
            driver: sqlite3.Database
        });

        // Insert a test price plan into the table
        await db.run(`INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES (?, ?, ?)`, ['sms 101', 2.75, 0.65]);
    });

    it('should calculate the total bill for calls and SMS based on the given price plan', async function () {
        const pricePlan = 'sms 101';
        const actions = 'call, sms, call';
        const total = await totalPhoneBill(db, pricePlan, actions);
        assert.equal(total, '6.15'); // (2 calls * 2.75) + (1 SMS * 0.65) = 6.15
    });

    it('should handle a price plan with no actions', async function () {
        const pricePlan = 'sms 101';
        const actions = '';
        const total = await totalPhoneBill(db, pricePlan, actions);
        assert.equal(total, '0.00'); // No actions result in a total bill of 0.00
    });

    it('should calculate the total bill correctly with only SMS actions', async function () {
        const pricePlan = 'sms 101';
        const actions = 'sms, sms, sms';
        const total = await totalPhoneBill(db, pricePlan, actions);
        assert.equal(total, '1.95'); // (3 SMS * 0.65) = 1.95
    });

    it('should calculate the total bill correctly with only call actions', async function () {
        const pricePlan = 'sms 101';
        const actions = 'call, call';
        const total = await totalPhoneBill(db, pricePlan, actions);
        assert.equal(total, '5.50'); // (2 calls * 2.75) = 5.50
    });

    it('should return a total of 0.00 for unknown action types', async function () {
        const pricePlan = 'sms 101';
        const actions = 'email, chat';
        const total = await totalPhoneBill(db, pricePlan, actions);
        assert.equal(total, '0.00'); // Unknown actions should not affect the total
    });

    after(async () => {
        // Close the database connection after tests
        await db.close();
    });
});