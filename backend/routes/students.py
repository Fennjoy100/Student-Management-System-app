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

@students_bp.route('/<string:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.json
    for i, student in enumerate(students_list):
        if student['id'] == student_id:
            students_list[i].update(data)
            return jsonify({"message": "Student updated successfully", "student": students_list[i]})
    return jsonify({"message": "Student not found"}), 404

@students_bp.route('/<string:student_id>', methods=['DELETE'])
def delete_student(student_id):
    global students_list
    for i, student in enumerate(students_list):
        if student['id'] == student_id:
            deleted_student = students_list.pop(i)
            return jsonify({"message": "Student deleted successfully", "student": deleted_student})
    return jsonify({"message": "Student not found"}), 404
