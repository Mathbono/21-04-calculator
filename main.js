const input = document.getElementById('calculation');
let calculation = '';
let mustBeOperation = false;
let mustBeNumber = true;

function getLastChar(str, pos = 1) {
	return str[str.length - pos];
}

function preventMultipleOperations(char) {
	if (mustBeNumber === true) {
		throwError();
		return;
	}
	if (char.length === 1) {
		if (getLastChar(calculation) === char) {
			throwError();
			return;
		}
	}
	if (char.length === 2) {
		if (
			getLastChar(calculation) === char[1] &&
			getLastChar(calculation, 2) === char[0]
		) {
			throwError();
			return;
		}
	}
	calculation += char;
	mustBeOperation = false;
	mustBeNumber = true;
}

function reset() {
	input.value = '';
	input.placeholder = '';
	calculation = '';
	mustBeOperation = false;
	mustBeNumber = true;
}

function throwError(expr = null) {
	reset();
	input.placeholder = expr ? 'Expression incorrecte' : 'Syntaxe incorrecte';
}

input.addEventListener('change', e => {
	let value = e.currentTarget.value;
	let newValue = '';
	for (let char of value) {
		switch (char) {
			case ',':
				newValue += '.';
				break;
			case 'x':
				newValue += '*';
				break;
			case '%':
				newValue += '*1/100';
				break;
			case '²':
				newValue += '**2';
				break;
			case 'e':
				newValue += '**';
				break;
			default:
				newValue += char;
				break;
		}
	}
	calculation = newValue;
});

input.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		document.getElementById('enter').click();
	}
});

document.getElementById('buttons').addEventListener('click', e => {
	let button = e.target;
	if (button.tagName !== 'BUTTON') return;
	const results = document.getElementById('results');
	const char = button.textContent;
	if (char !== 'R' && char !== 'C' && char !== '=') {
		input.value += char;
	}
	if (!isNaN(char)) {
		calculation += char;
		mustBeNumber = false;
	}
	if (char === '(') {
		if (!isNaN(getLastChar(calculation))) {
			throwError();
			return;
		}
		calculation += char;
		mustBeNumber = true;
	}
	if (char === ')') {
		calculation += char;
		mustBeOperation = true;
	}
	if (mustBeOperation === true) {
		if (
			char !== '+' &&
			char !== '-' &&
			char !== 'x' &&
			char !== '/' &&
			char !== '%' &&
			char !== ')' &&
			char !== 'R' &&
			char !== 'C' &&
			char !== '='
		) {
			throwError();
			return;
		}
		if (mustBeNumber === true) {
			if (isNaN(char)) {
				throwError();
				return;
			}
		}
	}
	switch (char) {
		case ',':
			preventMultipleOperations('.');
			break;
		case '+':
			preventMultipleOperations('+');
			break;
		case '-':
			preventMultipleOperations('-');
			break;
		case 'x':
			preventMultipleOperations('*');
			break;
		case '/':
			preventMultipleOperations('/');
			break;
		case 'e':
			preventMultipleOperations('**');
			break;
		case '²':
			calculation += '**2';
			mustBeOperation = true;
			break;
		case '%':
			if (mustBeNumber === true) {
				throwError();
				return;
			}
			calculation += '*1/100';
			mustBeOperation = true;
			break;
		case 'R':
			input.value = input.value.slice(0, input.value.length - 1);
			if (calculation.endsWith('*1/100')) {
				calculation = calculation.slice(0, calculation.length - 6);
				mustBeOperation = false;
				break;
			}
			if (calculation.endsWith('**')) {
				calculation = calculation.slice(0, calculation.length - 2);
				break;
			}
			calculation = calculation.slice(0, calculation.length - 1);
			break;
		case 'C':
			reset();
			results.textContent = '';
			break;
		case '=':
			if (calculation === '') break;
			const p = document.createElement('p');
			try {
				p.textContent = eval(calculation);
				results.insertBefore(p, results.firstElementChild);
				reset();
			} catch (e) {
				throwError('expr');
			}
			break;
	}
});
