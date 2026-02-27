from flask import Blueprint, jsonify, request

teachers_bp = Blueprint('teachers', __name__)

# Mock data
teachers_list = [
    {"id": "TEA001", "name": "Dr. Sarah Smith", "subject": "Mathematics", "email": "sarah.s@example.com", "classes": "10A, 11B", "status": "Active"},
    {"id": "TEA002", "name": "Prof. Michael Brown", "subject": "Physics", "email": "michael.b@example.com", "classes": "12C, 12D", "status": "Active"},
    {"id": "TEA003", "name": "Ms. Emily White", "subject": "English", "email": "emily.w@example.com", "classes": "09A, 10B", "status": "On Leave"},
]

@teachers_bp.route('/', methods=['GET'])
def get_teachers():
    return jsonify(teachers_list)

@teachers_bp.route('/', methods=['POST'])
def add_teacher():
    data = request.json
    teachers_list.append(data)
    return jsonify({"message": "Teacher added successfully", "teacher": data}), 201

@teachers_bp.route('/<string:teacher_id>', methods=['PUT'])
def update_teacher(teacher_id):
    data = request.json
    for i, teacher in enumerate(teachers_list):
        if teacher['id'] == teacher_id:
            teachers_list[i].update(data)
            return jsonify({"message": "Teacher updated successfully", "teacher": teachers_list[i]})
    return jsonify({"message": "Teacher not found"}), 404

@teachers_bp.route('/<string:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    global teachers_list
    for i, teacher in enumerate(teachers_list):
        if teacher['id'] == teacher_id:
            deleted_teacher = teachers_list.pop(i)
            return jsonify({"message": "Teacher deleted successfully", "teacher": deleted_teacher})
    return jsonify({"message": "Teacher not found"}), 404
