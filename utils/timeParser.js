// Converts .env time strings (e.g., "7d", "24h") to milliseconds
function parseEnvTimeToMs(timeString) {
    const unit = timeString.slice(-1); // Extract unit (d, h, m, s)
    const value = parseInt(timeString.slice(0, -1)); // Extract number
  
    switch (unit) {
      case 'd': return value * 24 * 60 * 60 * 1000; // Days
      case 'h': return value * 60 * 60 * 1000;       // Hours
      case 'm': return value * 60 * 1000;            // Minutes
      case 's': return value * 1000;                 // Seconds
      default:  return value;                        // Default to ms (if no unit)
    }
}

module.exports = {
    parseEnvTimeToMs,
};