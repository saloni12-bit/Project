const result = document.getElementById('result');

// Prevent invalid input combinations
function appendNumber(number) {
    const currentValue = result.value;
    const lastChar = currentValue.slice(-1);
    
    // Prevent multiple decimal points
    if (number === '.' && currentValue.includes('.')) {
        return;
    }
    
    // Prevent leading zeros
    if (number === '0' && currentValue === '0') {
        return;
    }
    
    result.value += number;
}

function appendOperator(operator) {
    const currentValue = result.value;
    const lastChar = currentValue.slice(-1);
    
    // Prevent multiple operators
    if ('+-*/%'.includes(lastChar)) {
        result.value = currentValue.slice(0, -1) + operator;
        return;
    }
    
    // Don't add operator if display is empty
    if (currentValue === '' && operator !== '-') {
        return;
    }
    
    result.value += operator;
}

function clearDisplay() {
    result.value = '';
}

function deleteLastChar() {
    result.value = result.value.slice(0, -1);
}

function appendPi() {
    result.value += Math.PI;
}

function calculateRoot() {
    try {
        const currentValue = parseFloat(result.value);
        if (currentValue < 0) {
            throw new Error('Cannot calculate square root of negative number');
        }
        result.value = Math.sqrt(currentValue);
    } catch (error) {
        result.value = 'Error';
        setTimeout(clearDisplay, 1000);
    }
}

function calculate() {
    try {
        // Replace × with * for calculation
        let expression = result.value.replace('×', '*');
        
        // Check for division by zero
        if (expression.includes('/0')) {
            throw new Error('Division by zero');
        }
        
        // Evaluate the expression
        let answer = eval(expression);
        
        // Check if the answer is a valid number
        if (isNaN(answer) || !isFinite(answer)) {
            throw new Error('Invalid calculation');
        }
        
        // Round to 8 decimal places to avoid floating point issues
        answer = Math.round(answer * 100000000) / 100000000;
        
        // Format large numbers
        if (answer.toString().length > 12) {
            answer = answer.toExponential(8);
        }
        
        result.value = answer;
    } catch (error) {
        result.value = 'Error';
        setTimeout(clearDisplay, 1000);
    }
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if (/[0-9+\-*/.=]/.test(key)) {
        event.preventDefault();
    }
    
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLastChar();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === 'p' && event.ctrlKey) {
        appendPi();
    } else if (key === 'r' && event.ctrlKey) {
        calculateRoot();
    }
}); 