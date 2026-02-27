from flask import Blueprint, jsonify, request

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/', methods=['GET'])
def get_attendance():
    return jsonify({"message": "Attendance records", "data": []})

@attendance_bp.route('/', methods=['POST'])
def mark_attendance():
    data = request.json
    return jsonify({"message": "Attendance marked", "data": data}), 201
