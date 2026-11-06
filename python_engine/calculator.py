"""
Scientific Calculator Python Core Engine
Author: Muzahid Rezwan
Provides robust mathematical, trigonometric, logarithmic and statistical functions.
"""

import math

class ScientificCalculator:
    """Scientific Math calculation engine with error boundary handling."""
    
    def __init__(self, angle_mode="DEG"):
        self.angle_mode = angle_mode.upper()  # 'DEG' or 'RAD'
        self.memory = 0.0

    def set_angle_mode(self, mode):
        if mode.upper() in ["DEG", "RAD"]:
            self.angle_mode = mode.upper()
        else:
            raise ValueError("Angle mode must be 'DEG' or 'RAD'")

    def _to_radians(self, angle):
        return math.radians(angle) if self.angle_mode == "DEG" else angle

    def _from_radians(self, rad):
        return math.degrees(rad) if self.angle_mode == "DEG" else rad

    # Arithmetic
    def add(self, a, b): return a + b
    def subtract(self, a, b): return a - b
    def multiply(self, a, b): return a * b
    def divide(self, a, b):
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        return a / b

    # Trigonometry
    def sin(self, x): return math.sin(self._to_radians(x))
    def cos(self, x): return math.cos(self._to_radians(x))
    def tan(self, x):
        rad = self._to_radians(x)
        if math.isclose(math.cos(rad), 0.0, abs_tol=1e-15):
            raise ValueError("Math domain error: tan undefined at (2k+1)*pi/2")
        return math.tan(rad)

    def asin(self, x):
        if not -1 <= x <= 1:
            raise ValueError("Domain error: asin domain is [-1, 1]")
        return self._from_radians(math.asin(x))

    def acos(self, x):
        if not -1 <= x <= 1:
            raise ValueError("Domain error: acos domain is [-1, 1]")
        return self._from_radians(math.acos(x))

    def atan(self, x):
        return self._from_radians(math.atan(x))

    # Powers & Roots
    def power(self, base, exp): return math.pow(base, exp)
    def square_root(self, x):
        if x < 0:
            raise ValueError("Cannot calculate square root of a negative number")
        return math.sqrt(x)

    def factorial(self, n):
        if n < 0 or not isinstance(n, int):
            raise ValueError("Factorial only defined for non-negative integers")
        return math.factorial(n)

    # Logarithms
    def log10(self, x):
        if x <= 0:
            raise ValueError("Domain error: log argument must be > 0")
        return math.log10(x)

    def ln(self, x):
        if x <= 0:
            raise ValueError("Domain error: ln argument must be > 0")
        return math.log(x)

    # Memory Store
    def memory_add(self, val): self.memory += val
    def memory_subtract(self, val): self.memory -= val
    def memory_clear(self): self.memory = 0.0
    def memory_recall(self): return self.memory


if __name__ == "__main__":
    calc = ScientificCalculator(angle_mode="DEG")
    print("=" * 50)
    print(" 🧮 SCIENTIFIC CALCULATOR PYTHON ENGINE")
    print("=" * 50)
    print(f"sin(30°)         : {calc.sin(30):.4f}")
    print(f"cos(60°)         : {calc.cos(60):.4f}")
    print(f"log10(1000)      : {calc.log10(1000)}")
    print(f"5! (Factorial)   : {calc.factorial(5)}")
    print(f"sqrt(144)        : {calc.square_root(144)}")
    print(f"2^10 (Power)     : {calc.power(2, 10)}")
    print("=" * 50)
