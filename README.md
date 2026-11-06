# 🧮 OmniCalc PRO — Scientific, Equations & DIU CGPA Suite

<p align="center">
  <img src="https://img.shields.io/badge/OmniCalc-PRO-00f2fe?style=for-the-badge&logo=calculator&logoColor=black" />
  <img src="https://img.shields.io/badge/DIU%20Grade%20System-4.00%20Scale-00ff87?style=for-the-badge&logo=graduation-cap" />
  <img src="https://img.shields.io/badge/Equations-Quadratic%20%26%20Linear-7928ca?style=for-the-badge" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

An all-in-one mathematical and academic suite engineered with a sleek **Cyberpunk Glassmorphism** interface. Features a full-fledged **Scientific Calculator**, **Step-by-Step Mathematical Equation Solvers**, and an official **Daffodil International University (DIU) CGPA & SGPA Calculator**.

---

### 🌐 Live Web Application

> 🚀 **Experience the Live App in Your Browser:**  
> **[https://muzahidrezwan.github.io/scientific-calculator/](https://muzahidrezwan.github.io/scientific-calculator/)**

---

### 🌟 Core Modules

#### 1. 🔬 Advanced Scientific Calculator
- **Trigonometry & Inverses:** $\sin, \cos, \tan, \sin^{-1}, \cos^{-1}, \tan^{-1}$
- **Dual Angle Modes:** One-click toggle between **Degrees (DEG)** and **Radians (RAD)**.
- **Logarithms & Powers:** $\log_{10}(x), \ln(x), e^x, x^y, 10^x, \sqrt{x}, x^2$
- **Constants & Factorials:** $\pi, e, n!$
- **Memory & History:** `MC`, `MR`, `M+`, `M-` buffers with persistent LocalStorage calculation history drawer.
- **Full Keyboard Navigation:** Full calculation support without using mouse.

#### 2. 📐 Mathematical Equation Solvers
- **Quadratic Equation Solver ($ax^2 + bx + c = 0$):**
  - Discriminant ($\Delta = b^2 - 4ac$) calculation and root nature detection.
  - Real distinct roots, real equal roots, and complex conjugate roots ($u \pm vi$).
  - Parabola vertex $(h, k)$ coordinate calculation.
- **System of 2 Linear Equations ($2 \times 2$ Cramer's Rule):**
  - Solves $a_1x + b_1y = c_1$ and $a_2x + b_2y = c_2$.
  - Automatically identifies unique solutions, coincident infinite lines, and parallel disjoint lines.

#### 3. 🎓 Daffodil International University (DIU) CGPA Calculator
Strictly configured to the official **UGC-approved DIU 4.00 Grading Scale**:

| Marks Range | Letter Grade | Grade Point (GP) | Remarks |
| :--- | :---: | :---: | :--- |
| **80% and above** | **A+** | **4.00** | Outstanding |
| **75% to &lt; 80%** | **A** | **3.75** | Excellent |
| **70% to &lt; 75%** | **A-** | **3.50** | Very Good |
| **65% to &lt; 70%** | **B+** | **3.25** | Good |
| **60% to &lt; 65%** | **B** | **3.00** | Satisfactory |
| **55% to &lt; 60%** | **B-** | **2.75** | Above Average |
| **50% to &lt; 55%** | **C+** | **2.50** | Average |
| **45% to &lt; 50%** | **C** | **2.25** | Below Average |
| **40% to &lt; 45%** | **D** | **2.00** | Pass |
| **Less than 40%** | **F** | **0.00** | Fail |

- **Cumulative CGPA Engine:** Seamlessly combines previous cumulative CGPA and completed credits with current semester courses.
- **Academic Standing Tracker:** Automatic detection of Honors vs. **DIU Academic Probation Alert (< 2.00)**.
- **Dynamic Course Management:** Easily add or remove unlimited courses with custom credit weights.

---

### 📂 Repository Structure

```text
scientific-calculator/
├── index.html                   # Glassmorphic Tabbed Web Application
├── style.css                    # Cyberpunk & Glassmorphic Styling
├── app.js                       # Calculation, Equation Solver & DIU CGPA Logic
├── python_engine/
│   ├── calculator.py            # Python Scientific Engine
│   ├── test_calculator.py       # Unit Tests
│   ├── equation_solver.py       # Python Equation Solver
│   └── diu_cgpa.py              # Python DIU CGPA Calculator
├── .gitignore
├── LICENSE                      # MIT License
└── README.md
```

---

### 💻 Python Core Usage

```bash
cd python_engine
python equation_solver.py
python diu_cgpa.py
```

---
*Crafted with precision by [Muzahid Rezwan](https://github.com/MuzahidRezwan)* 🚀
