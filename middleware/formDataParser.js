// middleware/formDataParser.js
const formDataToJson = (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      const nestedBody = {};
      
      // Handle both dot notation and JSON strings
      for (const [key, value] of Object.entries(req.body)) {
        try {
          // Try to parse JSON strings (like {"firstName":"Pedro"})
          if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
            nestedBody[key] = JSON.parse(value);
          } 
          // Handle dot notation (user.firstName)
          else if (key.includes('.')) {
            const [parent, child] = key.split('.');
            nestedBody[parent] = nestedBody[parent] || {};
            nestedBody[parent][child] = value;
          } 
          // Regular fields
          else {
            nestedBody[key] = value;
          }
        } catch (e) {
          console.error(`Error parsing field ${key}:`, e);
          nestedBody[key] = value;
        }
      }
      
      req.body = nestedBody;
    }
    next();
  };
  
  module.exports = formDataToJson;