# backend/main.py
import os, json
from flask import Flask, jsonify, request
from flask_cors import CORS
from gemini import run_prompt

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Health check ---
@app.get("/api/hello")
def hello():
    return jsonify({"msg": "hello from flask!"})


# --- Generate practice quiz ---
@app.post("/api/generate-quiz") 
def generate_quiz():
    try:
        with open("test.json", "r") as f:
            student_data = json.load(f)
    except Exception as e:
        return jsonify({"error": f"Could not read test.json: {str(e)}"}), 500

    prompt = f"""
You are a teacher assistant analyzing student patterns in grading and learning path.
Here are the student's results:

{json.dumps(student_data, indent=2)}

Based on this, create 10 practice test questions tailored to this student's weak areas.
Make them age-appropriate, clear, and provide an answer key. Your output should only contain 10 questions 
and no other text. 
""".strip()

    try:
        result = run_prompt(prompt)
        return jsonify({"quiz": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Chatbot (syllabus Q&A) ---
@app.post("/api/chat")
def chat():
    data = request.get_json(force=True)
    user_question = data.get("question", "")

    syllabus = """
Math 101: Introduction to College Mathematics

Semester: Fall 2025
Instructor: Mrs. Shields
Email: shields@university.edu

Office Hours: Tuesdays & Thursdays, 2–4 PM (Room 210)

Course Description

This course introduces fundamental concepts in mathematics, focusing on problem-solving, logical reasoning, and applications. Topics include algebra, functions, geometry, probability, and introductory statistics. The goal is to strengthen mathematical literacy and prepare students for further coursework.

Learning Objectives

By the end of this course, students will be able to:

Apply algebraic techniques to solve equations and inequalities.

Interpret and graph linear, quadratic, and exponential functions.

Analyze geometric figures and apply formulas for area, perimeter, and volume.

Understand basic concepts of probability and statistics.

Develop problem-solving strategies and communicate solutions clearly.

Required Materials

Textbook: Mathematics in Action, 3rd Edition

Scientific Calculator

Notebook & Graph Paper

Weekly Schedule (Sample)

Week 1–2: Algebra Review (equations, inequalities, systems of equations)
Week 3–4: Functions and Graphing (linear, quadratic, exponential)
Week 5: Geometry Basics (angles, polygons, circles)
Week 6–7: Measurement & Applications (area, perimeter, volume)
Week 8: Midterm Exam
Week 9–10: Probability (basic rules, counting principles)
Week 11–12: Statistics (mean, median, mode, standard deviation)
Week 13–14: Problem-Solving Projects
Week 15: Review & Final Exam

Grading Policy

Homework: 20%

Quizzes: 15%

Midterm Exam: 25%

Final Exam: 30%

Participation: 10%

Classroom Policies

Attendance is expected; more than 3 unexcused absences may affect your grade.

Late homework is accepted up to 2 days late with a 10% penalty.

Collaboration is encouraged, but all submitted work must be your own.
"""

    prompt = f"""
You are a helpful course assistant. Use the following syllabus to answer the student's question keep it simple and sweet, 2 to 3 sentences max:

{syllabus}

Student's question: {user_question}
"""

    try:
        result = run_prompt(prompt)
        return jsonify({"answer": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Analytics route ---
@app.post("/api/analytics")
def generate_analytics():
    try:
        with open("test.json", "r") as f:
            student_data = json.load(f)
    except Exception as e:
        return jsonify({"error": f"Could not read test.json: {str(e)}"}), 500

    prompt = f"""
You are a teacher assistant analyzing a student's results.

Here are the student's test results:
{json.dumps(student_data, indent=2)}

Provide insights on:
- Which subjects or topics they are struggling in.
- Which subjects they excel in.
- Suggest a brief learning plan or next steps.

Return the answer in plain text (no JSON).
""".strip()

    try:
        result = run_prompt(prompt)
        return jsonify({"analytics": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
