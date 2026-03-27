const Subscription = require('../models/Subscription');

exports.getDashboard = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const subscriptions = await Subscription.find({ sessionId }).lean();
    
    let totalMonthly = 0;
    let potentialMonthlySavings = 0;
    
    const byCategory = {
      Entertainment: 0,
      Utilities: 0,
      Health: 0,
      Software: 0,
      Food: 0,
      Other: 0
    };
    
    let healthScoreRaw = 100;
    
    const subsWithPriority = subscriptions.map(sub => {
      // Basic metrics
      totalMonthly += sub.amount;
      
      if (sub.category && byCategory[sub.category] !== undefined) {
        byCategory[sub.category] += sub.amount;
      }
      
      // Health Score & Priority
      let frequencyScore = 0;
      
      if (sub.usageFrequency === 'rarely') {
        potentialMonthlySavings += sub.amount;
        healthScoreRaw -= 15;
        frequencyScore = 3;
      } else if (sub.usageFrequency === 'sometimes') {
        healthScoreRaw -= 5;
        frequencyScore = 1;
      } else if (sub.usageFrequency === 'daily') {
        frequencyScore = 0;
      }
      
      const priorityScore = sub.amount * frequencyScore;
      
      return {
        ...sub,
        priorityScore
      };
    });
    
    // Process Health Score
    healthScoreRaw = Math.max(0, healthScoreRaw);
    let label = '';
    if (healthScoreRaw >= 80) label = 'Excellent';
    else if (healthScoreRaw >= 60) label = 'Good';
    else if (healthScoreRaw >= 40) label = 'Needs Attention';
    else label = 'Critical';
    
    // Sort recommendations
    const cancelRecommendations = [...subsWithPriority].sort((a, b) => b.priorityScore - a.priorityScore);
    
    res.json({
      success: true,
      data: {
        totalMonthly,
        totalAnnual: totalMonthly * 12,
        subscriptionCount: subscriptions.length,
        potentialMonthlySavings,
        potentialAnnualSavings: potentialMonthlySavings * 12,
        byCategory,
        healthScore: {
          score: healthScoreRaw,
          label
        },
        subscriptions,
        cancelRecommendations: cancelRecommendations.map(sub => {
          const { priorityScore, ...rest } = sub;
          return rest;
        })
      }
    });
    
  } catch (error) {
    next(error);
  }
};

exports.getSavingsSimulator = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const yearsParam = req.query.years || '1';
    const years = parseInt(yearsParam, 10);
    
    if (![1, 3, 5].includes(years)) {
      return res.status(400).json({ success: false, error: 'Invalid years parameter. Supported values are 1, 3, 5.' });
    }
    
    const rarelyUsedSubs = await Subscription.find({ sessionId, usageFrequency: 'rarely' }).lean();
    
    let monthlySavings = 0;
    
    rarelyUsedSubs.forEach(sub => {
      monthlySavings += sub.amount;
    });
    
    res.json({
      success: true,
      data: {
        monthlySavings,
        projections: {
          oneYear: monthlySavings * 12,
          threeYears: monthlySavings * 36,
          fiveYears: monthlySavings * 60
        }
      }
    });

  } catch (error) {
    next(error);
  }
};
