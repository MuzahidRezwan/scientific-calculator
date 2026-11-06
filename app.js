/**
 * OmniCalc PRO Suite
 * Author: Muzahid Rezwan
 * Modules:
 *  1. Advanced Scientific Calculator
 *  2. Mathematical Equation Solvers (Quadratic & 2x2 Linear Systems)
 *  3. Daffodil International University (DIU) CGPA & SGPA Engine
 */

// ================= 1. TAB CONTROLLER =================
document.querySelectorAll('.nav-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));

    tab.classList.add('active');
    const targetId = tab.dataset.tab;
    const targetPane = document.getElementById(targetId);
    if (targetPane) targetPane.classList.add('active');
  });
});

// ================= 2. SCIENTIFIC CALCULATOR ENGINE =================
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
    this.isDegree = true;
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

    this.degRadBtn.addEventListener('click', () => this.toggleAngleMode());

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

    window.addEventListener('keydown', (e) => {
      const activeTab = document.querySelector('.nav-tab.active');
      if (!activeTab || activeTab.dataset.tab !== 'tab-scientific') return;

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
    });
  }

  inputDigit(val) {
    if (this.waitingForOperand) {
      this.currentInput = val === '.' ? '0.' : val;
      this.waitingForOperand = false;
    } else {
      if (val === '.') {
        if (!this.currentInput.includes('.')) this.currentInput += '.';
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
        this.currentInput = this.currentInput.length > 1 ? this.currentInput.slice(0, -1) : '0';
        break;

      case 'calculate':
        this.evaluate();
        break;

      case 'negate':
        this.currentInput = (num * -1).toString();
        break;

      case 'sin':
        this.applyUnary('sin', (x) => Math.sin(this.toRadians(x)));
        break;
      case 'cos':
        this.applyUnary('cos', (x) => Math.cos(this.toRadians(x)));
        break;
      case 'tan':
        this.applyUnary('tan', (x) => {
          const rad = this.toRadians(x);
          return Math.abs(Math.cos(rad)) < 1e-15 ? 'Error' : Math.tan(rad);
        });
        break;
      case 'asin':
        this.applyUnary('sin⁻¹', (x) => (x < -1 || x > 1 ? 'Error' : this.fromRadians(Math.asin(x))));
        break;
      case 'acos':
        this.applyUnary('cos⁻¹', (x) => (x < -1 || x > 1 ? 'Error' : this.fromRadians(Math.acos(x))));
        break;
      case 'atan':
        this.applyUnary('tan⁻¹', (x) => this.fromRadians(Math.atan(x)));
        break;

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

      case 'log':
        this.applyUnary('log', (x) => (x <= 0 ? 'Error' : Math.log10(x)));
        break;
      case 'ln':
        this.applyUnary('ln', (x) => (x <= 0 ? 'Error' : Math.log(x)));
        break;
      case 'exp':
        this.currentInput += 'e+0';
        break;
      case 'fact':
        this.applyUnary('fact', (x) => this.factorial(x));
        break;

      case 'pi':
        this.currentInput = Math.PI.toString();
        this.waitingForOperand = true;
        break;
      case 'e':
        this.currentInput = Math.E.toString();
        this.waitingForOperand = true;
        break;

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

    let evalString = fullExpr
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/−/g, '-')
      .replace(/\^/g, '**');

    try {
      if (/[^0-9\+\-\*\/\.\(\)\s\*\*%eE]/.test(evalString)) throw new Error('Invalid');
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

  toRadians(val) { return this.isDegree ? (val * Math.PI) / 180 : val; }
  fromRadians(val) { return this.isDegree ? (val * 180) / Math.PI : val; }

  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return 'Error';
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
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
}

const calc = new ScientificCalculator();

// ================= 3. MATHEMATICAL EQUATION SOLVER =================
document.getElementById('solve-quadratic-btn').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('quad-a').value);
  const b = parseFloat(document.getElementById('quad-b').value);
  const c = parseFloat(document.getElementById('quad-c').value);
  const output = document.getElementById('quad-output');

  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    output.innerHTML = '<span style="color:#ef4444">⚠️ Please enter valid numerical coefficients (a, b, c).</span>';
    return;
  }

  if (a === 0) {
    if (b === 0) {
      output.innerHTML = c === 0 ? 'Infinite solutions (Identity: 0 = 0)' : '<span style="color:#ef4444">No solution (Contradiction).</span>';
    } else {
      const root = -c / b;
      output.innerHTML = `Linear Equation: <b>x = ${root.toFixed(4)}</b>`;
    }
    return;
  }

  // Discriminant: Δ = b² - 4ac
  const discriminant = b * b - 4 * a * c;
  let resultHTML = `<div><b>Discriminant (Δ):</b> ${discriminant.toFixed(4)}</div>`;

  if (discriminant > 0) {
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    resultHTML += `
      <div style="margin-top:6px"><b>Nature:</b> Two distinct real roots</div>
      <div style="color:#00ff87; font-size:1.05rem; margin-top:4px;">
        x₁ = <b>${x1.toFixed(4)}</b> &nbsp;|&nbsp; x₂ = <b>${x2.toFixed(4)}</b>
      </div>`;
  } else if (discriminant === 0) {
    const x = -b / (2 * a);
    resultHTML += `
      <div style="margin-top:6px"><b>Nature:</b> One repeated real root</div>
      <div style="color:#00ff87; font-size:1.05rem; margin-top:4px;">
        x₁ = x₂ = <b>${x.toFixed(4)}</b>
      </div>`;
  } else {
    const realPart = (-b / (2 * a)).toFixed(4);
    const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
    resultHTML += `
      <div style="margin-top:6px"><b>Nature:</b> Two complex conjugate roots</div>
      <div style="color:#00f2fe; font-size:1.05rem; margin-top:4px;">
        x₁ = <b>${realPart} + ${imagPart}i</b><br>
        x₂ = <b>${realPart} - ${imagPart}i</b>
      </div>`;
  }

  // Vertex of Parabola
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  resultHTML += `<div style="margin-top:6px; color:#9ca3af; font-size:0.75rem">Vertex: (${vertexX.toFixed(3)}, ${vertexY.toFixed(3)})</div>`;

  output.innerHTML = resultHTML;
});

// Solve 2x2 System of Linear Equations (Cramer's Rule)
document.getElementById('solve-linear-btn').addEventListener('click', () => {
  const a1 = parseFloat(document.getElementById('lin-a1').value);
  const b1 = parseFloat(document.getElementById('lin-b1').value);
  const c1 = parseFloat(document.getElementById('lin-c1').value);

  const a2 = parseFloat(document.getElementById('lin-a2').value);
  const b2 = parseFloat(document.getElementById('lin-b2').value);
  const c2 = parseFloat(document.getElementById('lin-c2').value);
  const output = document.getElementById('linear-output');

  if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
    output.innerHTML = '<span style="color:#ef4444">⚠️ Please fill in all coefficients properly.</span>';
    return;
  }

  // Determinant D = a1*b2 - a2*b1
  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  if (Math.abs(D) < 1e-12) {
    if (Math.abs(Dx) < 1e-12 && Math.abs(Dy) < 1e-12) {
      output.innerHTML = '<span style="color:#4facfe">Infinite solutions (Coincident lines).</span>';
    } else {
      output.innerHTML = '<span style="color:#ef4444">No solution (Parallel lines).</span>';
    }
  } else {
    const x = Dx / D;
    const y = Dy / D;
    output.innerHTML = `
      <div><b>Determinant (D):</b> ${D.toFixed(4)}</div>
      <div style="color:#00ff87; font-size:1.1rem; margin-top:6px;">
        x = <b>${x.toFixed(4)}</b> &nbsp;|&nbsp; y = <b>${y.toFixed(4)}</b>
      </div>`;
  }
});

// ================= 4. DAFFODIL INTERNATIONAL UNIVERSITY (DIU) CGPA ENGINE =================
const DIU_GRADES = [
  { grade: 'A+', point: 4.00, marks: '80% and above' },
  { grade: 'A',  point: 3.75, marks: '75% to < 80%' },
  { grade: 'A-', point: 3.50, marks: '70% to < 75%' },
  { grade: 'B+', point: 3.25, marks: '65% to < 70%' },
  { grade: 'B',  point: 3.00, marks: '60% to < 65%' },
  { grade: 'B-', point: 2.75, marks: '55% to < 60%' },
  { grade: 'C+', point: 2.50, marks: '50% to < 55%' },
  { grade: 'C',  point: 2.25, marks: '45% to < 50%' },
  { grade: 'D',  point: 2.00, marks: '40% to < 45%' },
  { grade: 'F',  point: 0.00, marks: 'Less than 40%' }
];

const INITIAL_COURSES = [
  { name: 'Data Structures & Algorithms', credit: 3.0, grade: 'A+' },
  { name: 'Data Structures Lab', credit: 1.0, grade: 'A+' },
  { name: 'Statistics & Probability', credit: 3.0, grade: 'A' },
  { name: 'Discrete Mathematics', credit: 3.0, grade: 'A-' },
  { name: 'Object Oriented Programming', credit: 3.0, grade: 'A+' }
];

const courseListBody = document.getElementById('course-list-body');

function renderCourseRow(course = { name: '', credit: 3.0, grade: 'A+' }) {
  const tr = document.createElement('tr');
  const gradeOptions = DIU_GRADES.map(
    (g) => `<option value="${g.grade}" ${g.grade === course.grade ? 'selected' : ''}>${g.grade} (${g.point.toFixed(2)})</option>`
  ).join('');

  tr.innerHTML = `
    <td><input type="text" class="course-name" placeholder="Course Name" value="${course.name}"></td>
    <td><input type="number" class="course-credit" min="0.5" max="6.0" step="0.5" value="${course.credit}"></td>
    <td><select class="course-grade">${gradeOptions}</select></td>
    <td class="course-point" style="font-family:'Fira Code'; font-weight:600; text-align:center;">4.00</td>
    <td style="text-align:center;"><button class="del-course-btn" title="Remove Course">✕</button></td>
  `;

  // Update grade point display dynamically
  const select = tr.querySelector('.course-grade');
  const pointTd = tr.querySelector('.course-point');
  const updatePoint = () => {
    const found = DIU_GRADES.find((g) => g.grade === select.value);
    pointTd.textContent = found ? found.point.toFixed(2) : '0.00';
  };
  select.addEventListener('change', updatePoint);
  updatePoint();

  // Delete row handler
  tr.querySelector('.del-course-btn').addEventListener('click', () => tr.remove());

  courseListBody.appendChild(tr);
}

function initDIUCourses() {
  courseListBody.innerHTML = '';
  INITIAL_COURSES.forEach((c) => renderCourseRow(c));
}

document.getElementById('add-course-btn').addEventListener('click', () => {
  renderCourseRow({ name: '', credit: 3.0, grade: 'A' });
});

document.getElementById('reset-courses-btn').addEventListener('click', () => {
  initDIUCourses();
  document.getElementById('prev-cgpa').value = '';
  document.getElementById('prev-credits').value = '';
  document.getElementById('res-sgpa').textContent = '--';
  document.getElementById('res-cgpa').textContent = '--';
  document.getElementById('res-credits').textContent = '--';
  document.getElementById('res-standing').textContent = 'Enter courses and click calculate';
});

// Calculate SGPA & Cumulative CGPA
document.getElementById('calculate-cgpa-btn').addEventListener('click', () => {
  const rows = courseListBody.querySelectorAll('tr');
  if (rows.length === 0) {
    alert('Please add at least one course.');
    return;
  }

  let semesterCreditPoints = 0;
  let semesterTotalCredits = 0;
  let semesterEarnedCredits = 0;

  rows.forEach((row) => {
    const credit = parseFloat(row.querySelector('.course-credit').value) || 0;
    const gradeStr = row.querySelector('.course-grade').value;
    const gradeObj = DIU_GRADES.find((g) => g.grade === gradeStr) || { point: 0 };

    if (credit > 0) {
      semesterTotalCredits += credit;
      semesterCreditPoints += credit * gradeObj.point;
      if (gradeObj.point > 0) {
        semesterEarnedCredits += credit;
      }
    }
  });

  if (semesterTotalCredits === 0) return;

  const currentSGPA = semesterCreditPoints / semesterTotalCredits;

  // Previous CGPA incorporation
  const prevCGPA = parseFloat(document.getElementById('prev-cgpa').value) || 0;
  const prevCredits = parseFloat(document.getElementById('prev-credits').value) || 0;

  let totalCumulativeCredits = semesterTotalCredits + prevCredits;
  let totalCumulativePoints = semesterCreditPoints + prevCGPA * prevCredits;
  let finalCGPA = totalCumulativeCredits > 0 ? totalCumulativePoints / totalCumulativeCredits : currentSGPA;

  // Display values
  document.getElementById('res-sgpa').textContent = currentSGPA.toFixed(2);
  document.getElementById('res-cgpa').textContent = finalCGPA.toFixed(2);
  document.getElementById('res-credits').textContent = `${semesterEarnedCredits + prevCredits} cr`;

  // Standing Remarks based on DIU Academic Policies
  const banner = document.getElementById('res-standing');
  if (finalCGPA >= 3.75) {
    banner.style.color = '#00ff87';
    banner.innerHTML = '🌟 <b>Outstanding Standing (High Honors)</b> — Exceptional Academic Performance!';
  } else if (finalCGPA >= 3.50) {
    banner.style.color = '#00f2fe';
    banner.innerHTML = '🚀 <b>Excellent Standing</b> — High Distinction at DIU!';
  } else if (finalCGPA >= 3.00) {
    banner.style.color = '#4facfe';
    banner.innerHTML = '👍 <b>Good Standing</b> — Satisfactory Academic Performance.';
  } else if (finalCGPA >= 2.00) {
    banner.style.color = '#f9fafb';
    banner.innerHTML = '✔️ <b>Average Standing (Pass)</b> — Meets minimum degree requirement.';
  } else {
    banner.style.color = '#ef4444';
    banner.innerHTML = '⚠️ <b>Academic Probation Alert!</b> CGPA is below DIU minimum 2.00 threshold.';
  }
});

// Initialize on page load
initDIUCourses();
