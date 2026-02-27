from flask import Blueprint, jsonify, request

attendance_bp = Blueprint('attendance', __name__)

# Temporary storage (in-memory)
attendance_records = []

@attendance_bp.route('/', methods=['GET'])
def get_attendance():
    date = request.args.get('date')
    class_name = request.args.get('class')
    
    # Filter records based on query parameters
    filtered_records = [r for r in attendance_records if r.get('date') == date and r.get('class') == class_name]
    
    return jsonify({"message": "Attendance records", "data": filtered_records})

@attendance_bp.route('/', methods=['POST'])
def mark_attendance():
    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400
    
    # Save or update record
    date = data.get('date')
    class_name = data.get('class')
    
    # Find and remove old record for same date/class if it exists to update it
    global attendance_records
    attendance_records = [r for r in attendance_records if not (r.get('date') == date and r.get('class') == class_name)]
    
    attendance_records.append(data)
    
    return jsonify({"message": "Attendance marked successfully"}), 201
