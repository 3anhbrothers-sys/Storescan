import OpenAI from 'openai';

// openai initializing stuff
const openai = new OpenAI({
  apiKey: 'replace ts with teh actual key when ready to showcase',
  dangerouslyAllowBrowser: true,
});

// This gets the AI reccomendation
export async function getStoreRecommendation(userQuestion) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a shopping assistant. When users ask where to buy products, respond ONLY with valid JSON in this exact format:
{
  "summary": "A brief 1-2 sentence recommendation",
  "stores": [
    {
      "name": "Store Name",
      "distance": "0.5 mi",
      "totalPrice": "$10.99",
      "recommended": true,
      "products": [
        {"name": "Product Name", "price": "$5.99", "inStock": true},
        {"name": "Another Product", "price": "$4.00", "inStock": true}
      ]
    }
  ]
}

CRITICAL RULES:
- Include 2-3 different stores. Choose from a variety: Target, Walmart, Kroger, Safeway, Whole Foods, Costco, Aldi, Trader Joe's, Food Lion, Publix, H-E-B, Meijer, Giant, Stop & Shop
- Vary the stores - don't always use the same ones
- Mark the best value as "recommended": true
- Include realistic current market prices
- Always include distance in miles (0.3-2.0 mi range)
- LIST EVERY SINGLE PRODUCT the user asked for in the products array
- for example If user asks for "ketchup and bread", include BOTH in products array
- for example If user asks for "milk, eggs, and cheese", include ALL THREE in products array
- Calculate totalPrice as the sum of ALL product prices
- Respond with ONLY valid JSON, absolutely no other text before or after
- Ensure all JSON is properly formatted with correct quotes and commas`
        },
        {
          role: 'user',
          content: userQuestion
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const responseText = response.choices[0].message.content.trim();
    
    console.log('Raw OpenAI Response:', responseText);
    
    // Parse the JSON response so it can be put into the table on store details
    const jsonData = JSON.parse(responseText);
    
    console.log('Parsed JSON:', jsonData);
    
    return jsonData;
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}