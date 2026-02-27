from flask import Blueprint, jsonify, request

courses_bp = Blueprint('courses', __name__)

# Temporary storage (in-memory)
mock_courses = [
    { "id": 'CRS001', "name": 'Advanced Mathematics', "teacher": 'Dr. Sarah Smith', "students": 32, "schedule": 'Mon, Wed 09:00', "status": 'Active' },
    { "id": 'CRS002', "name": 'Physics 101', "teacher": 'Prof. Michael Brown', "students": 28, "schedule": 'Tue, Thu 11:00', "status": 'Active' },
    { "id": 'CRS003', "name": 'English Literature', "teacher": 'Ms. Emily White', "students": 25, "schedule": 'Fri 10:00', "status": 'Active' },
]

@courses_bp.route('/', methods=['GET'])
def get_courses():
    return jsonify(mock_courses)

@courses_bp.route('/', methods=['POST'])
def add_course():
    data = request.json
    mock_courses.append(data)
    return jsonify({"message": "Course added successfully", "data": data}), 201

@courses_bp.route('/<string:course_id>', methods=['PUT'])
def update_course(course_id):
    data = request.json
    for course in mock_courses:
        if course['id'] == course_id:
            course.update(data)
            return jsonify({"message": "Course updated successfully", "data": course})
    return jsonify({"message": "Course not found"}), 404

@courses_bp.route('/<string:course_id>', methods=['DELETE'])
def delete_course(course_id):
    global mock_courses
    mock_courses = [c for c in mock_courses if c['id'] != course_id]
    return jsonify({"message": "Course deleted successfully"}), 200
