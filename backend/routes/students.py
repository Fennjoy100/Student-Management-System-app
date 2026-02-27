from flask import Blueprint, jsonify, request

students_bp = Blueprint('students', __name__)

# Mock data
students_list = [
    {"id": "STU001", "name": "James Wilson", "grade": "10A", "email": "james.w@example.com", "phone": "+1 234 567 890", "status": "Active"},
    {"id": "STU002", "name": "Emma Thompson", "grade": "10A", "email": "emma.t@example.com", "phone": "+1 234 567 891", "status": "Active"},
]

@students_bp.route('/', methods=['GET'])
def get_students():
    return jsonify(students_list)

@students_bp.route('/', methods=['POST'])
def add_student():
    data = request.json
    students_list.append(data)
    return jsonify({"message": "Student added successfully", "student": data}), 201
