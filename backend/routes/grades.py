from flask import Blueprint, jsonify, request

grades_bp = Blueprint('grades', __name__)

# Temporary storage (in-memory) 
# format: { "date_grade_term": [students_with_scores] }
grades_db = {}

@grades_bp.route('/', methods=['GET'])
def get_grades():
    date = request.args.get('date')
    grade = request.args.get('grade')
    term = request.args.get('term')
    
    key = f"{date}_{grade}_{term}"
    return jsonify(grades_db.get(key, []))

@grades_bp.route('/', methods=['POST'])
def save_grades():
    data = request.json
    date = data.get('date')
    grade = data.get('grade')
    term = data.get('term')
    records = data.get('students')
    
    key = f"{date}_{grade}_{term}"
    grades_db[key] = records
    
    return jsonify({"message": "Grades saved successfully for " + date, "status": "success"}), 201
