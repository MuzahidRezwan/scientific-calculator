"""
Daffodil International University (DIU) CGPA & SGPA Calculator
Author: Muzahid Rezwan
Calculates semester SGPA and cumulative CGPA according to DIU official grading scale.
"""

DIU_GRADE_SCALE = {
    "A+": 4.00,
    "A":  3.75,
    "A-": 3.50,
    "B+": 3.25,
    "B":  3.00,
    "B-": 2.75,
    "C+": 2.50,
    "C":  2.25,
    "D":  2.00,
    "F":  0.00
}

class DIUCGPACalculator:
    def __init__(self, prev_cgpa=0.0, prev_credits=0.0):
        self.prev_cgpa = float(prev_cgpa)
        self.prev_credits = float(prev_credits)
        self.courses = []

    def add_course(self, name, credit, grade):
        grade = grade.upper().strip()
        if grade not in DIU_GRADE_SCALE:
            raise ValueError(f"Invalid DIU grade '{grade}'. Must be one of {list(DIU_GRADE_SCALE.keys())}")
        self.courses.append({
            "name": name,
            "credit": float(credit),
            "grade": grade,
            "point": DIU_GRADE_SCALE[grade]
        })

    def calculate(self):
        semester_credits = sum(c["credit"] for c in self.courses)
        if semester_credits == 0:
            return {"sgpa": 0.0, "cgpa": self.prev_cgpa, "earned_credits": self.prev_credits}

        semester_points = sum(c["credit"] * c["point"] for c in self.courses)
        semester_earned_credits = sum(c["credit"] for c in self.courses if c["point"] > 0)

        sgpa = semester_points / semester_credits

        total_credits = semester_credits + self.prev_credits
        total_points = semester_points + (self.prev_cgpa * self.prev_credits)
        cumulative_cgpa = total_points / total_credits if total_credits > 0 else sgpa

        return {
            "sgpa": round(sgpa, 2),
            "cgpa": round(cumulative_cgpa, 2),
            "semester_credits": semester_credits,
            "total_earned_credits": semester_earned_credits + self.prev_credits,
            "standing": self._get_standing(cumulative_cgpa)
        }

    def _get_standing(self, cgpa):
        if cgpa >= 3.75: return "Outstanding (High Honors)"
        if cgpa >= 3.50: return "Excellent Standing"
        if cgpa >= 3.00: return "Good Standing"
        if cgpa >= 2.00: return "Average Standing"
        return "Academic Probation Alert (< 2.00)"


if __name__ == "__main__":
    calc = DIUCGPACalculator(prev_cgpa=3.80, prev_credits=30)
    calc.add_course("Data Structures", 3.0, "A+")
    calc.add_course("Data Structures Lab", 1.0, "A+")
    calc.add_course("Statistics", 3.0, "A")
    calc.add_course("Discrete Math", 3.0, "A-")
    
    res = calc.calculate()
    print("=" * 55)
    print(" 🎓 DAFFODIL INTERNATIONAL UNIVERSITY (DIU) CGPA REPORT")
    print("=" * 55)
    print(f"Current Semester SGPA : {res['sgpa']}")
    print(f"Cumulative CGPA        : {res['cgpa']}")
    print(f"Total Credits Earned   : {res['total_earned_credits']}")
    print(f"Academic Standing      : {res['standing']}")
    print("=" * 55)
