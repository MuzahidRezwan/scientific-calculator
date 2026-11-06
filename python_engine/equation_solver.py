"""
Equation Solver Python Module
Author: Muzahid Rezwan
Solves Quadratic Equations (ax^2 + bx + c = 0) and 2x2 Simultaneous Linear Systems.
"""

import cmath
import math

class EquationSolver:
    @staticmethod
    def solve_quadratic(a, b, c):
        """Solves ax^2 + bx + c = 0 returning (root1, root2, discriminant)."""
        if a == 0:
            if b == 0:
                raise ValueError("Degenerate equation: 0 = 0 or non-zero constant = 0")
            root = -c / b
            return (root, root, 0)

        discriminant = b**2 - 4*a*c
        
        if discriminant >= 0:
            r1 = (-b + math.sqrt(discriminant)) / (2 * a)
            r2 = (-b - math.sqrt(discriminant)) / (2 * a)
            return (r1, r2, discriminant)
        else:
            # Complex roots
            r1 = (-b + cmath.sqrt(discriminant)) / (2 * a)
            r2 = (-b - cmath.sqrt(discriminant)) / (2 * a)
            return (r1, r2, discriminant)

    @staticmethod
    def solve_linear_system_2x2(a1, b1, c1, a2, b2, c2):
        """
        Solves:
          a1*x + b1*y = c1
          a2*x + b2*y = c2
        Using Cramer's Rule. Returns (x, y).
        """
        D = a1 * b2 - a2 * b1
        Dx = c1 * b2 - c2 * b1
        Dy = a1 * c2 - a2 * c1

        if abs(D) < 1e-12:
            if abs(Dx) < 1e-12 and abs(Dy) < 1e-12:
                raise ValueError("Infinite solutions (Coincident lines)")
            raise ValueError("No solution (Parallel lines)")

        x = Dx / D
        y = Dy / D
        return (x, y)


if __name__ == "__main__":
    print("=" * 55)
    print(" 📐 MATHEMATICAL EQUATION SOLVER")
    print("=" * 55)
    # Example 1: x^2 - 5x + 6 = 0 (Roots: 2, 3)
    r1, r2, d = EquationSolver.solve_quadratic(1, -5, 6)
    print(f"Quadratic x^2 - 5x + 6 = 0 -> Roots: x1={r1}, x2={r2} (Δ={d})")

    # Example 2: 2x + 3y = 13 and x - 2y = -4 -> (x=2, y=3)
    x, y = EquationSolver.solve_linear_system_2x2(2, 3, 13, 1, -2, -4)
    print(f"Linear System 2x+3y=13, x-2y=-4 -> Solution: x={x}, y={y}")
    print("=" * 55)
