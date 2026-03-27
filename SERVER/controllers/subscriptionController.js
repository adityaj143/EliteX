const papa = require('papaparse');
const Subscription = require('../models/Subscription');

exports.manualSubscriptions = async (req, res, next) => {
  try {
    const { sessionId, subscriptions } = req.body;
    
    if (!sessionId || !subscriptions || !Array.isArray(subscriptions)) {
      return res.status(400).json({ success: false, error: 'Invalid data format' });
    }

    const newSubscriptions = subscriptions.map(sub => ({
      sessionId,
      merchantName: sub.merchantName,
      amount: sub.amount,
      category: sub.category,
      usageFrequency: sub.usageFrequency,
      dateStarted: sub.dateStarted,
      isRecurring: true
    }));

    await Subscription.deleteMany({ sessionId });
    const result = await Subscription.insertMany(newSubscriptions);
    res.json({ success: true, count: result.length });
  } catch (error) {
    next(error);
  }
};

exports.csvSubscriptions = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const file = req.file;

    if (!sessionId || !file) {
      return res.status(400).json({ success: false, error: 'Missing sessionId or file' });
    }

    const csvString = file.buffer.toString('utf-8');
    
    papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data;
          
          // Recurring detection: Group rows by merchantName
          const merchantCounts = {};
          
          rows.forEach(row => {
            const mName = row.merchant_name;
            const amt = Number(row.amount);
            
            if (mName && !isNaN(amt)) {
              if (!merchantCounts[mName]) merchantCounts[mName] = {};
              if (!merchantCounts[mName][amt]) merchantCounts[mName][amt] = 0;
              merchantCounts[mName][amt]++;
            }
          });
          
          let recurringCount = 0;
          
          const newSubscriptions = rows.map(row => {
            const mName = row.merchant_name;
            const amt = Number(row.amount);
            
            let isRecurring = false;
            
            if (mName && !isNaN(amt) && merchantCounts[mName] && merchantCounts[mName][amt] >= 2) {
              isRecurring = true;
              recurringCount++;
            }
            
            return {
              sessionId,
              merchantName: mName,
              amount: amt,
              category: row.category,
              usageFrequency: row.usage_frequency,
              dateStarted: row.date_started ? new Date(row.date_started) : undefined,
              isRecurring
            };
          }).filter(sub => sub.merchantName && !isNaN(sub.amount));
          
          // Purge old dashboard data for this session to give a clean CSV view
          await Subscription.deleteMany({ sessionId });
          const savedDocs = await Subscription.insertMany(newSubscriptions);
          
          res.json({ 
            success: true, 
            count: savedDocs.length, 
            recurringCount 
          });
        } catch (dbError) {
          next(dbError);
        }
      },
      error: (error) => {
        next(new Error('CSV Parsing Error: ' + error.message));
      }
    });

  } catch (error) {
    next(error);
  }
};
