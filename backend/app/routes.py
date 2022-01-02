from os import name
from flask import render_template, request, jsonify
from flask.helpers import flash, make_response, url_for
from flask_login.utils import login_user, logout_user
from werkzeug.utils import redirect
from app import app, db
import json
from app.models import TUser

user = { 'username': 'ruo-lan', 'age': 20, 'addr': 'cheng-du' }

@app.route('/')
@app.route('/index')
def main_index():
    return render_template('index.html', title='声明详情')

@app.route('/register')
def register_index():
    return render_template('/register.html', title="注册用户")

# 注册
@app.route('/register', methods=['POST'])
def register_post():
    f = request.form.to_dict()

    # db.session.add(u)
    # db.session.commit()
    return_dict = { 'code': 200, 'success': True }
    return jsonify(return_dict)

# 登录
@app.route('/login', methods=['POST'])
def login_post():
    f = request.form.to_dict()
    isRemember = f['remember']
    u_info = TUser.query.filter_by(name=f['name'], password=f['password']).first()
    if u_info:
        login_user(u_info, remember=isRemember)
        return jsonify({ 'code': 200, 'success': True })
    else:
        return jsonify({ 'code': 200, 'success': False, 'message': '用户名或者密码错误' })

# 登出
@app.route('/logout', methods=['POST'])
def logout_post():
    logout_user()
    return jsonify({ 'code': 200, 'success': True })


@app.route('/demo')
@app.route('/demo/index')
def index():
    posts = [
        {
            'author': { 'username': 'person1' },
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': { 'username': 'person2' },
            'body': 'The Avengers movie was so cool!'
        }
    ]
    return render_template('demo/index.html', title='Home', user=user, posts=posts)

@app.route('/demo/about')
def about():
    return render_template('demo/about.html', title="about", user=user, desc="My Name is 巴拉巴拉")

@app.route('/demo/')

@app.route('/demo/add', methods=['POST'])
def add():
    # 添加一个测试用户
    u = TUser(name='yangyu', password='zan_shi_ming_wen', sex=1, status=1, avatar='')
    db.session.add(u)
    db.session.commit()
    return_dict = { 'code': 200, 'success': True, 'data': [{ 'name': 'test' }] }
    return jsonify(return_dict)

@app.route('/demo/select', methods=['GET'])
def select():
    userlist = []
    users = TUser.query.all()
    for user in users:
        # 通过遍历结果集 将每一个实例转为 json
        print(user)
        userlist.append(user.to_json())
    # print(userlist)
    return_dict = { 'code': 200, 'success': True, 'data': userlist }
    # return json.dumps(return_dict, ensure_ascii=False)
    return jsonify(return_dict)

