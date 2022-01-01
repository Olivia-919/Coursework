from os import name
from flask import render_template, request
from flask.json import jsonify
from app import app, db
import json
from app.models import TUser

user = { 'username': 'ruo-lan', 'age': 20, 'addr': 'cheng-du' }

@app.route('/')
@app.route('/index')
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

@app.route('/about')
def about():
    return render_template('demo/about.html', title="about", user=user, desc="My Name is 巴拉巴拉")

@app.route('/add', methods=['POST'])
def add():
    # 添加一个测试用户
    u = TUser(name='yangyu', password='zan_shi_ming_wen', sex=1, status=1, avatar='')
    db.session.add(u)
    db.session.commit()
    return_dict = { 'code': 200, 'success': True }
    return json.dumps(return_dict, ensure_ascii=False)

@app.route('/select', methods=['GET'])
def select():
    users = TUser.query.all()
    return_dict = { 'code': 200, 'success': True }
    return json.dumps(return_dict, ensure_ascii=False)

