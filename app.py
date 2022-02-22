from flask import Flask, render_template, request, jsonify
import requests, xmltodict
from pymongo import MongoClient
import certifi
import os #디렉토리 절대 경로
from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from models import db
from models import User

ca = certifi.where()

client = MongoClient('mongodb+srv://rudwns0913:qwer0913@cluster0.tgacl.mongodb.net/Cluster0?retryWrites=true&w=majority', tlsCAFile=ca, connect = False)

data = client.dbsparta

app = Flask(__name__)
# 산정보 api입니다.
@app.route("/mountainInfo", methods=["GET"])
def get_mountainInfo():
    url = 'http://apis.data.go.kr/1400000/service/cultureInfoService/mntInfoOpenAPI'
    params = {'serviceKey': 'C1EvS3mDIvVFBeCI85YBjCPyaBYo54kb2xyrzOTz/WpWmx1kEc/7m6L5U9pWb7rJ2vb6VhWL5oQFWytEkHen4Q==', 'searchWrd': '북한산'}
    response = requests.get(url, params=params)
    obj = xmltodict.parse(response.text)
    mountains = obj['response']['body']['items']['item']
    for mountain in mountains:
        doc = {"location": mountain["mntiadd"], "detail": mountain["mntidetails"],
           "name": mountain["mntiname"], "height": mountain["mntihigh"]}
        data.mountain.insert_one(doc)
    return obj['response']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/home')
def home():
    return render_template('index.html')

#회원가입 정보입니다.
@app.route('/register', methods=['GET', 'POST'])  # GET(정보보기), POST(정보수정) 메서드 허용
def register():
    if request.method == 'GET':
        return render_template("register.html")
    else:
        userid = request.form.get('userid')
        email = request.form.get('email')
        password = request.form.get('password')
        password_2 = request.form.get('password')

        if not (userid and email and password and password_2):
            return "입력되지 않은 정보가 있습니다"
        elif password != password_2:
            return "비밀번호가 일치하지 않습니다"
        else:
            usertable = User()  # user_table 클래스
            usertable.userid = userid
            usertable.email = email
            usertable.password = password

            db.session.add(usertable)
            db.session.commit()
            return "회원가입 성공"
        return redirect('/')

@app.route('/mountainInfo')
def mountain_info():
    return render_template('mountainInfo.html')


if __name__ == "__main__":
    #회원가입에 필요한 데이터베이스 생성입니다.
    #데이터베이스---------
    basedir = os.path.abspath(os.path.dirname(__file__)) #현재 파일이 있는 디렉토리 절대 경로
    dbfile = os.path.join(basedir, 'db.sqlite') #데이터베이스 파일을 만든다

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + dbfile
    app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True #사용자에게 정보 전달완료하면 teadown. 그 때마다 커밋=DB반영
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #추가 메모리를 사용하므로 꺼둔다

#    db = SQLAlchemy() #SQLAlchemy를 사용해 데이터베이스 저장
    db.init_app(app) #app설정값 초기화
    db.app = app #Models.py에서 db를 가져와서 db.app에 app을 명시적으로 넣는다
    db.create_all() #DB생성

    app.run(host="127.0.0.1", port=5000, debug=True)