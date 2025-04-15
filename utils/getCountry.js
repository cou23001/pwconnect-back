// Util to get country name from location
// input: "Ciudad Obregón, Sonora, Mexico"
// output: "Mexico"


const getCountry = (location) => {
    const locationParts = location.split(', ');
    const country = locationParts[locationParts.length - 1];
    return country;
}
module.exports = getCountry;
// Example usage
// const location = "Ciudad Obregón, Sonora, Mexico";
// const country = getCountry(location);
// console.log(country); // Output: "Mexico"