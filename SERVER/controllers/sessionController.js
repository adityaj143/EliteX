const crypto = require('crypto');
const Session = require('../models/Session');

exports.createSession = async (req, res, next) => {
  try {
    const { inputMethod } = req.body;
    const sessionId = crypto.randomUUID();
    
    const session = new Session({
      sessionId,
      inputMethod
    });
    
    await session.save();
    
    res.json({ success: true, sessionId });
  } catch (error) {
    next(error);
  }
};
