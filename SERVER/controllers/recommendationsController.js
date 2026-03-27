exports.getAIRecommendations = async (req, res, next) => {
  try {
    const { subscriptions, sessionId } = req.body;
    
    if (!subscriptions || !Array.isArray(subscriptions)) {
      return res.status(400).json({ success: false, error: 'Invalid subscriptions format' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'AI service API key not configured' });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const promptText = `You are a smart personal finance advisor. A user has these active subscriptions: ${JSON.stringify(subscriptions)}. Analyze each subscription and return ONLY a valid JSON array with no markdown, no backticks, no explanation. Each object in the array must have exactly these fields: merchantName (string), shouldCancel (boolean), reason (string, one sentence why to cancel or keep), alternativeSuggestion (string, cheaper alternative if exists or empty string), annualSavingsIfCancelled (number, amount * 12 if shouldCancel is true else 0). Return the array for all subscriptions provided.`;
    
    const requestBody = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ]
    };
    
    // Using native fetch in Node 18+
    const fetchResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!fetchResponse.ok) {
      throw new Error(`Gemini API Error: ${fetchResponse.status} ${fetchResponse.statusText}`);
    }
    
    const aiData = await fetchResponse.json();
    
    // Extract text from Gemini response structure
    let responseText = '';
    
    if (aiData.candidates && aiData.candidates[0] && aiData.candidates[0].content && aiData.candidates[0].content.parts[0]) {
      responseText = aiData.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from AI service');
    }
    
    // Strip markdown formatting if any (like ```json ... ```)
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedArray = JSON.parse(responseText);
      res.json({ success: true, recommendations: parsedArray });
    } catch (parseError) {
      throw new Error('Failed to parse JSON response from AI');
    }

  } catch (error) {
    if (error.message.includes('Gemini API Error') || error.message.includes('AI service') || error.message.includes('parse JSON')) {
      return res.status(200).json({ success: false, error: 'AI service unavailable', details: error.message });
    }
    next(error);
  }
};
