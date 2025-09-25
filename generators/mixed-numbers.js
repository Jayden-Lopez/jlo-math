// Mixed Numbers Generator
window.MixedNumbersGenerator = {
    generate: function() {
        const type = Math.floor(Math.random() * 5);
        
        switch(type) {
            case 0: return this.mixedToImproper();
            case 1: return this.improperToMixed();
            case 2: return this.addMixedNumbers();
            case 3: return this.subtractMixedNumbers();
            case 4: return this.multiplyMixedNumbers();
        }
    },
    
    mixedToImproper: function() {
        const whole = Math.floor(Math.random() * 5) + 1;
        const denominator = Math.floor(Math.random() * 8) + 2;
        const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
        const improper = whole * denominator + numerator;
        
        return {
            question: `Convert ${whole} ${numerator}/${denominator} to an improper fraction`,
            answer: `${improper}/${denominator}`,
            hint: `Multiply whole number by denominator, then add numerator`,
            explanation: `${whole} × ${denominator} + ${numerator} = ${improper}, so answer is ${improper}/${denominator}`
        };
    },
    
    improperToMixed: function() {
        const denominator = Math.floor(Math.random() * 8) + 2;
        const whole = Math.floor(Math.random() * 5) + 1;
        const remainder = Math.floor(Math.random() * (denominator - 1)) + 1;
        const numerator = whole * denominator + remainder;
        
        return {
            question: `Convert ${numerator}/${denominator} to a mixed number`,
            answer: `${whole} ${remainder}/${denominator}`,
            hint: `Divide numerator by denominator to get whole number and remainder`,
            explanation: `${numerator} ÷ ${denominator} = ${whole} remainder ${remainder}, so ${whole} ${remainder}/${denominator}`
        };
    },
    
    addMixedNumbers: function() {
        const den = Math.floor(Math.random() * 6) + 2;
        const whole1 = Math.floor(Math.random() * 3) + 1;
        const num1 = Math.floor(Math.random() * (den - 1)) + 1;
        const whole2 = Math.floor(Math.random() * 3) + 1;
        const num2 = Math.floor(Math.random() * (den - 1)) + 1;
        
        const totalNum = num1 + num2;
        const extraWhole = Math.floor(totalNum / den);
        const finalNum = totalNum % den;
        const finalWhole = whole1 + whole2 + extraWhole;
        
        return {
            question: `Add: ${whole1} ${num1}/${den} + ${whole2} ${num2}/${den}`,
            answer: finalNum === 0 ? `${finalWhole}` : `${finalWhole} ${finalNum}/${den}`,
            hint: `Add whole numbers and fractions separately`,
            explanation: `Whole: ${whole1} + ${whole2} = ${whole1 + whole2}, Fractions: ${num1}/${den} + ${num2}/${den} = ${totalNum}/${den}${extraWhole > 0 ? ` = ${extraWhole} ${finalNum}/${den}` : ''}`
        };
    },
    
    subtractMixedNumbers: function() {
        const den = Math.floor(Math.random() * 6) + 2;
        const whole1 = Math.floor(Math.random() * 3) + 3;
        const num1 = Math.floor(Math.random() * (den - 1)) + 1;
        const whole2 = Math.floor(Math.random() * 2) + 1;
        const num2 = Math.floor(Math.random() * (den - 1)) + 1;
        
        const improper1 = whole1 * den + num1;
        const improper2 = whole2 * den + num2;
        const result = improper1 - improper2;
        const resultWhole = Math.floor(result / den);
        const resultNum = result % den;
        
        return {
            question: `Subtract: ${whole1} ${num1}/${den} - ${whole2} ${num2}/${den}`,
            answer: resultNum === 0 ? `${resultWhole}` : `${resultWhole} ${resultNum}/${den}`,
            hint: `Convert to improper fractions first if needed`,
            explanation: `Convert to improper: ${improper1}/${den} - ${improper2}/${den} = ${result}/${den} = ${resultWhole} ${resultNum}/${den}`
        };
    },
    
    multiplyMixedNumbers: function() {
        const den1 = Math.floor(Math.random() * 4) + 2;
        const den2 = Math.floor(Math.random() * 4) + 2;
        const whole1 = Math.floor(Math.random() * 3) + 1;
        const num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
        const whole2 = Math.floor(Math.random() * 3) + 1;
        const num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
        
        const improper1 = whole1 * den1 + num1;
        const improper2 = whole2 * den2 + num2;
        const resultNum = improper1 * improper2;
        const resultDen = den1 * den2;
        
        // Simplify
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const g = gcd(resultNum, resultDen);
        const finalNum = resultNum / g;
        const finalDen = resultDen / g;
        
        const finalWhole = Math.floor(finalNum / finalDen);
        const finalRemainder = finalNum % finalDen;
        
        return {
            question: `Multiply: ${whole1} ${num1}/${den1} × ${whole2} ${num2}/${den2}`,
            answer: finalRemainder === 0 ? `${finalWhole}` : finalWhole === 0 ? `${finalRemainder}/${finalDen}` : `${finalWhole} ${finalRemainder}/${finalDen}`,
            hint: `Convert to improper fractions, multiply, then simplify`,
            explanation: `${improper1}/${den1} × ${improper2}/${den2} = ${resultNum}/${resultDen} = ${finalWhole} ${finalRemainder}/${finalDen}`
        };
    }
};
