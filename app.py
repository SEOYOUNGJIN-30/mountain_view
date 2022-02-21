from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/mountainInfo')
def mountain_info():
    return render_template('mountainInfo.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)


