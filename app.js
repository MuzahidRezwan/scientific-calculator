/**
 * OmniCalc Scientific Calculator Engine
 * Author: Muzahid Rezwan
 * Features: High-precision trigonometry (DEG/RAD), logarithms, exponents,
 *           memory buffers, history caching & full keyboard navigation.
 */

class ScientificCalculator {
  constructor() {
    this.mainDisplay = document.getElementById('main-display');
    this.exprDisplay = document.getElementById('expression-display');
    this.degRadBtn = document.getElementById('deg-rad-btn');
    this.angleModeIndicator = document.getElementById('angle-mode-indicator');
    this.memoryIndicator = document.getElementById('memory-indicator');
    this.historyDrawer = document.getElementById('history-drawer');
    this.historyList = document.getElementById('history-list');

    this.currentInput = '0';
    this.expression = '';
    this.isDegree = true; // True for DEG, False for RAD
    this.memory = 0;
    this.history = JSON.parse(localStorage.getItem('omni_calc_history') || '[]');
    this.waitingForOperand = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderHistory();
    this.updateDisplay();
  }

  bindEvents() {
    // Button Clicks
    document.querySelector('.keypad-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const val = btn.dataset.val;
      const op = btn.dataset.op;
      const action = btn.dataset.action;

      if (val !== undefined) this.inputDigit(val);
      else if (op !== undefined) this.inputOperator(op);
      else if (action !== undefined) this.handleAction(action);
    });

    // Degree / Radian toggle
    this.degRadBtn.addEventListener('click', () => this.toggleAngleMode());

    // History drawer controls
    document.getElementById('history-toggle').addEventListener('click', () => {
      this.historyDrawer.classList.add('active');
    });
    document.getElementById('close-history-btn').addEventListener('click', () => {
      this.historyDrawer.classList.remove('active');
    });
    document.getElementById('clear-history-btn').addEventListener('click', () => {
      this.history = [];
      localStorage.removeItem('omni_calc_history');
      this.renderHistory();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  inputDigit(val) {
    if (this.waitingForOperand) {
      this.currentInput = val === '.' ? '0.' : val;
      this.waitingForOperand = false;
    } else {
      if (val === '.') {
        if (!this.currentInput.includes('.')) {
          this.currentInput += '.';
        }
      } else {
        this.currentInput = this.currentInput === '0' ? val : this.currentInput + val;
      }
    }
    this.updateDisplay();
  }

  inputOperator(op) {
    const symbolMap = { '/': ' ÷ ', '*': ' × ', '+': ' + ', '-': ' − ', '%': ' % ' };
    const displaySymbol = symbolMap[op] || ` ${op} `;

    if (this.expression && !this.waitingForOperand) {
      this.expression += `${this.currentInput}${displaySymbol}`;
    } else if (!this.expression) {
      this.expression = `${this.currentInput}${displaySymbol}`;
    } else {
      // Replace last operator
      this.expression = this.expression.replace(/ [÷×+−%] $/, displaySymbol);
    }

    this.waitingForOperand = true;
    this.updateDisplay();
  }

  handleAction(action) {
    const num = parseFloat(this.currentInput);

    switch (action) {
      case 'clear':
        this.currentInput = '0';
        this.expression = '';
        this.waitingForOperand = false;
        break;

      case 'backspace':
        if (this.currentInput.length > 1) {
          this.currentInput = this.currentInput.slice(0, -1);
        } else {
          this.currentInput = '0';
        }
        break;

      case 'calculate':
        this.evaluate();
        break;

      case 'negate':
        this.currentInput = (num * -1).toString();
        break;

      // Trigonometry
      case 'sin':
        this.applyUnary('sin', (x) => Math.sin(this.toRadians(x)));
        break;
      case 'cos':
        this.applyUnary('cos', (x) => Math.cos(this.toRadians(x)));
        break;
      case 'tan':
        this.applyUnary('tan', (x) => {
          const rad = this.toRadians(x);
          if (Math.abs(Math.cos(rad)) < 1e-15) return 'Error';
          return Math.tan(rad);
        });
        break;
      case 'asin':
        this.applyUnary('sin⁻¹', (x) => {
          if (x < -1 || x > 1) return 'Error';
          return this.fromRadians(Math.asin(x));
        });
        break;
      case 'acos':
        this.applyUnary('cos⁻¹', (x) => {
          if (x < -1 || x > 1) return 'Error';
          return this.fromRadians(Math.acos(x));
        });
        break;
      case 'atan':
        this.applyUnary('tan⁻¹', (x) => this.fromRadians(Math.atan(x)));
        break;

      // Powers & Roots
      case 'square':
        this.applyUnary('sqr', (x) => Math.pow(x, 2));
        break;
      case 'sqrt':
        this.applyUnary('√', (x) => (x < 0 ? 'Error' : Math.sqrt(x)));
        break;
      case 'power':
        this.expression = `${this.currentInput} ^ `;
        this.waitingForOperand = true;
        break;
      case 'inv':
        this.applyUnary('1/', (x) => (x === 0 ? 'Error' : 1 / x));
        break;
      case 'abs':
        this.applyUnary('abs', (x) => Math.abs(x));
        break;

      // Logs & Exponents
      case 'log':
        this.applyUnary('log', (x) => (x <= 0 ? 'Error' : Math.log10(x)));
        break;
      case 'ln':
        this.applyUnary('ln', (x) => (x <= 0 ? 'Error' : Math.log(x)));
        break;
      case 'exp':
        this.currentInput += 'e+0';
        break;

      // Factorial
      case 'fact':
        this.applyUnary('fact', (x) => this.factorial(x));
        break;

      // Constants
      case 'pi':
        this.currentInput = Math.PI.toString();
        this.waitingForOperand = true;
        break;
      case 'e':
        this.currentInput = Math.E.toString();
        this.waitingForOperand = true;
        break;

      // Memory
      case 'mc':
        this.memory = 0;
        this.memoryIndicator.classList.add('hidden');
        break;
      case 'mr':
        this.currentInput = this.memory.toString();
        this.waitingForOperand = true;
        break;
      case 'm-plus':
        this.memory += num;
        this.memoryIndicator.classList.remove('hidden');
        break;
      case 'm-minus':
        this.memory -= num;
        this.memoryIndicator.classList.remove('hidden');
        break;
    }
    this.updateDisplay();
  }

  applyUnary(fnName, calcFn) {
    const num = parseFloat(this.currentInput);
    const result = calcFn(num);

    if (result === 'Error' || isNaN(result)) {
      this.currentInput = 'Error';
    } else {
      this.saveHistory(`${fnName}(${num})`, result);
      this.currentInput = this.formatNumber(result);
    }
    this.waitingForOperand = true;
  }

  evaluate() {
    let fullExpr = this.expression + this.currentInput;
    if (!fullExpr) return;

    // Convert display operators to JS operators
    let evalString = fullExpr
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/−/g, '-')
      .replace(/\^/g, '**');

    try {
      // Validate safe evaluation characters
      if (/[^0-9\+\-\*\/\.\(\)\s\*\*%eE]/.test(evalString)) {
        throw new Error('Invalid Input');
      }

      // Compute mathematical result
      let result = Function(`'use strict'; return (${evalString})`)();

      if (!isFinite(result) || isNaN(result)) {
        this.currentInput = 'Error';
      } else {
        this.saveHistory(fullExpr, result);
        this.currentInput = this.formatNumber(result);
        this.expression = '';
      }
    } catch (e) {
      this.currentInput = 'Error';
    }

    this.waitingForOperand = true;
    this.updateDisplay();
  }

  toRadians(val) {
    return this.isDegree ? (val * Math.PI) / 180 : val;
  }

  fromRadians(val) {
    return this.isDegree ? (val * 180) / Math.PI : val;
  }

  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return 'Error';
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) {
      res *= i;
      if (!isFinite(res)) return 'Infinity';
    }
    return res;
  }

  toggleAngleMode() {
    this.isDegree = !this.isDegree;
    const mode = this.isDegree ? 'DEG' : 'RAD';
    this.degRadBtn.textContent = mode;
    this.angleModeIndicator.textContent = mode;
  }

  formatNumber(val) {
    const parsed = Number(val);
    if (Math.abs(parsed) > 1e12 || (Math.abs(parsed) < 1e-6 && parsed !== 0)) {
      return parsed.toExponential(6);
    }
    // Round floats nicely to 10 decimal places to fix floating point math quirks
    return parseFloat(parsed.toFixed(10)).toString();
  }

  saveHistory(expr, res) {
    this.history.unshift({ expr, res: this.formatNumber(res), timestamp: new Date().toLocaleTimeString() });
    if (this.history.length > 30) this.history.pop();
    localStorage.setItem('omni_calc_history', JSON.stringify(this.history));
    this.renderHistory();
  }

  renderHistory() {
    if (this.history.length === 0) {
      this.historyList.innerHTML = '<li class="empty-state">No calculations yet</li>';
      return;
    }

    this.historyList.innerHTML = this.history
      .map(
        (item) => `
        <li class="history-item" onclick="calc.recallHistory('${item.res}')">
          <div class="history-expr">${item.expr} =</div>
          <div class="history-res">${item.res}</div>
        </li>`
      )
      .join('');
  }

  recallHistory(val) {
    this.currentInput = val;
    this.waitingForOperand = true;
    this.updateDisplay();
    this.historyDrawer.classList.remove('active');
  }

  updateDisplay() {
    this.mainDisplay.textContent = this.currentInput;
    this.exprDisplay.textContent = this.expression;
  }

  handleKeyboard(e) {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      this.inputDigit(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
      this.inputOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      this.evaluate();
    } else if (e.key === 'Backspace') {
      this.handleAction('backspace');
    } else if (e.key === 'Escape') {
      this.handleAction('clear');
    }
  }
}

// Instantiate
const calc = new ScientificCalculator();
