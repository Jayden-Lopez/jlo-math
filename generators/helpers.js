// generators/helpers.js - Shared helper functions for math generators

// Greatest Common Divisor - used by fractions and ratios
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}

// Make it globally available
window.gcd = gcd;

// Least Common Multiple - useful for fractions
window.lcm = function(a, b) {
    return (a * b) / gcd(a, b);
};

// Random number in range - useful for all generators
window.randomInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Check if a number is prime - might be useful for advanced topics
window.isPrime = function(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
};

// Simplify a fraction - returns {numerator, denominator}
window.simplifyFraction = function(num, den) {
    const g = gcd(Math.abs(num), Math.abs(den));
    return {
        numerator: num / g,
        denominator: den / g
    };
};
