# 🧮 OmniCalc — Advanced Scientific Calculator

<p align="center">
  <img src="https://img.shields.io/badge/OmniCalc-PRO-00f2fe?style=for-the-badge&logo=calculator&logoColor=black" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/UI-Glassmorphism%20%26%20Cyberpunk-7928ca?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-00ff87?style=for-the-badge" />
</p>

An ultra-modern, high-precision **Scientific Calculator** engineered with a sleek glassmorphic cyberpunk interface and an underlying Python computational mathematics engine. 

---

### ✨ Features & Capabilities

- 🌌 **Aesthetic Glassmorphism UI:** Deep-space dark theme, ambient radial glows, and responsive tactile keypad.
- 📐 **Dual Angle Modes:** One-click toggle between **Degrees (DEG)** and **Radians (RAD)** for all trigonometric functions.
- 🔬 **Comprehensive Scientific Functions:**
  - **Trigonometric & Inverses:** $\sin, \cos, \tan, \sin^{-1}, \cos^{-1}, \tan^{-1}$
  - **Logarithms & Exponents:** $\log_{10}(x), \ln(x), e^x, x^y, 10^x$
  - **Powers & Radicals:** $x^2, \sqrt{x}, \sqrt[3]{x}, x^{-1}$
  - **Factorial & Constants:** $n!, \pi, e$
- 💾 **Memory Functions:** Full support for `MC`, `MR`, `M+`, and `M-` with persistent UI status indicator.
- 📜 **Calculation History Drawer:** LocalStorage-backed history log with instant recall on click.
- ⌨️ **Full Keyboard Support:** Instant calculation without touching the mouse (`0-9`, `+ - * /`, `Enter`, `Backspace`, `Esc`).
- 🐍 **Standalone Python Core:** Includes an object-oriented Python computation module with full unit-test coverage.

---

### 🚀 Live Demo

> 🌐 **Experience the Live Web App:**  
> **[https://MuzahidRezwan.github.io/scientific-calculator/](https://MuzahidRezwan.github.io/scientific-calculator/)**

---

### 📂 Repository Architecture

```text
scientific-calculator/
├── index.html               # Main Glassmorphic Web App Layout
├── style.css                # Cyberpunk Glassmorphic CSS Styling
├── app.js                   # JavaScript High-Precision Calculation Engine
├── python_engine/
│   ├── calculator.py        # Object-Oriented Python Scientific Engine & CLI
│   └── test_calculator.py   # Comprehensive Unit Tests
├── .gitignore               # Ignored build & system artifacts
└── README.md                # Project Documentation & Guide
```

---

### 💻 Quick Start & Usage

#### 1. Running the Web Application
Simply clone the repository and open `index.html` in any modern web browser:
```bash
git clone https://github.com/MuzahidRezwan/scientific-calculator.git
cd scientific-calculator
# Double-click index.html or launch a local server:
# python -m http.server 8000
```

#### 2. Running the Python Engine & Tests
```bash
cd python_engine
python calculator.py
python test_calculator.py
```

---

### ⌨️ Keyboard Shortcuts Reference

| Key | Action | Key | Action |
| :---: | :--- | :---: | :--- |
| `0` - `9` | Input Digits | `+`, `-`, `*`, `/` | Arithmetic Operators |
| `Enter` / `=` | Evaluate Expression | `Backspace` | Delete Last Character |
| `Escape` | Clear All (`AC`) | `.` | Decimal Point |

---

### 📜 License
This project is licensed under the [MIT License](LICENSE).

---
*Developed with ❤️ by [Muzahid Rezwan](https://github.com/MuzahidRezwan)* 🚀
