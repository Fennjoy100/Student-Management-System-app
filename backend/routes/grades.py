from flask import Blueprint, jsonify, request

grades_bp = Blueprint('grades', __name__)

@grades_bp.route('/', methods=['GET'])
def get_grades():
    return jsonify({"message": "Grade records", "data": []})
