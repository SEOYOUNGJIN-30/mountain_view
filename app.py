from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import certifi

#SSL: CERTIFICATE_VERIFY_FAILED 에러 때문에 넣음
ca = certifi.where()
client = MongoClient('mongodb+srv://lnuvy:1234@cluster-lnuvy.cnhmb.mongodb.net/', tlsCAFile=ca)
db = client.dbsparta

app = Flask(__name__)


@app.route('/test')
def test():
    return render_template('testLogin.html')

# ---------- 페이지 라우팅 ---------- #
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
def mountainInfo():
    return render_template('mountainInfo.html')


# ---------- Ajax 요청 ---------- #
# 아이디 중복체크
@app.route('/register/checkDup', methods=["POST"])
def checkDup():
    id_receive = request.form['id_give']
    userList = list(db.users.find({}, {'_id': False}))
    for user in userList:
        if user['id'] == id_receive:
            print("일치")
            return jsonify({'msg': '이미 존재하는 아이디 입니다!!'})
    print("없음")
    return jsonify({'msg': '사용 가능한 아이디 입니다.'})

# 회원가입
@app.route('/register/insertDB', methods=["POST"])
def registerUser():
    id_receive = request.form['id_give']
    password_receive = request.form['password_give']
    age_receive = request.form['age_give']
    nickname_receive = request.form['nickname_give']

    doc = {
        "id": id_receive,
        "password": password_receive,
        "age": int(age_receive),
        "nickname": nickname_receive
    }
    db.users.insert_one(doc)
    return jsonify({'msg': '회원가입 완료'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)