from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Import routes
from routes.students import students_bp
from routes.teachers import teachers_bp
from routes.attendance import attendance_bp
from routes.grades import grades_bp
from routes.courses import courses_bp

# Register Blueprints
app.register_blueprint(students_bp, url_prefix='/api/students')
app.register_blueprint(teachers_bp, url_prefix='/api/teachers')
app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
app.register_blueprint(grades_bp, url_prefix='/api/grades')
app.register_blueprint(courses_bp, url_prefix='/api/courses')

@app.route('/api')
@app.route('/api/')
def api_home():
    return jsonify({"message": "API is online", "status": "success"})

@app.route('/')
def home():
    return jsonify({"message": "Student Management System API is running", "status": "success"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
