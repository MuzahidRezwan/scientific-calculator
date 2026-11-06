"""
Unit Tests for ScientificCalculator Engine
"""

import unittest
import math
from calculator import ScientificCalculator

class TestScientificCalculator(unittest.TestCase):

    def setUp(self):
        self.calc = ScientificCalculator(angle_mode="DEG")

    def test_basic_arithmetic(self):
        self.assertEqual(self.calc.add(10, 5), 15)
        self.assertEqual(self.calc.subtract(10, 5), 5)
        self.assertEqual(self.calc.multiply(10, 5), 50)
        self.assertEqual(self.calc.divide(10, 2), 5)
        with self.assertRaises(ZeroDivisionError):
            self.calc.divide(10, 0)

    def test_trigonometry(self):
        self.assertAlmostEqual(self.calc.sin(30), 0.5, places=5)
        self.assertAlmostEqual(self.calc.cos(60), 0.5, places=5)
        self.assertAlmostEqual(self.calc.tan(45), 1.0, places=5)

    def test_powers_and_roots(self):
        self.assertEqual(self.calc.power(2, 3), 8)
        self.assertEqual(self.calc.square_root(49), 7)
        self.assertEqual(self.calc.factorial(5), 120)

    def test_logarithms(self):
        self.assertEqual(self.calc.log10(100), 2)
        self.assertAlmostEqual(self.calc.ln(math.e), 1.0, places=5)

    def test_memory(self):
        self.calc.memory_clear()
        self.calc.memory_add(50)
        self.calc.memory_subtract(20)
        self.assertEqual(self.calc.memory_recall(), 30.0)

if __name__ == "__main__":
    unittest.main()
