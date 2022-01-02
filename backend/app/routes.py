from os import name
from flask import render_template, request, jsonify
from flask.helpers import flash, make_response, url_for
from flask_login.utils import login_user, logout_user, current_user
from werkzeug.utils import redirect
from app import app, db
import json
from app.models import TUser, TTopic, TClaim
from app.base_models import Dict

user = { 'username': 'ruo-lan', 'age': 20, 'addr': 'cheng-du' }

# 【页面】首页
@app.route('/')
@app.route('/index')
def main_index():
    return render_template('index.html', title='声明详情')

# 【页面】注册页面
@app.route('/register')
def register_index():
    return render_template('/register.html', title="注册用户")

# 【页面】主题详情
@app.route('/topic')
def topic_index():
    return render_template('/topic.html', title="主题")

# 【api】新增声明
@app.route('/api/addClaim', methods=['POST'])
def api_add_claim():
    f = request.form.to_dict()
    c = TClaim(name=f['name'], content=f['content'], topic_id=f['topicId'], is_delete=0, creator_id=current_user.id)
    db.session.add(c)
    db.session.commit()
    return jsonify({ 'code': 200, 'success': True })

# 【api】主题详情
@app.route('/api/topic', methods=['GET'])
def api_topic_detail():
    topid = request.args.get('id')
    success = False
    message = ''
    respData = None
    if topid:
        # 查询主题详情
        tp = db.session.query(TTopic).filter_by(id=topid).first()
        if tp:
            tpjson = tp.to_json()
            # 查询关联的声明
            claims = db.session.query(TClaim).filter_by(topic_id=topid, is_delete=0).all()
            claimlist = []
            for claim in claims:
                claimlist.append(claim.to_json())
            tpjson['children'] = claimlist
            success = True
            respData = tpjson
        else:
            message = '暂无数据'
    else:
        message = '缺少查询ID'
        
    return jsonify({ 'code': 200, 'success': success, 'message': message, 'data': respData })

# 【api】注册
@app.route('/api/register', methods=['POST'])
def api_register_post():
    f = request.form.to_dict()
    u = TUser(f)
    db.session.add(u)
    db.session.commit()
    return_dict = { 'code': 200, 'success': True }
    return jsonify(return_dict)

# 【api】登录
@app.route('/api/login', methods=['POST'])
def api_login_post():
    f = request.form.to_dict()
    isRemember = f['remember']
    u_info = TUser.query.filter_by(name=f['name'], password=f['password']).first()
    if u_info:
        login_user(u_info, remember=isRemember)
        return jsonify({ 'code': 200, 'success': True })
    else:
        return jsonify({ 'code': 200, 'success': False, 'message': '用户名或者密码错误' })

# 【api】登出
@app.route('/api/logout', methods=['POST'])
def api_logout_post():
    logout_user()
    return jsonify({ 'code': 200, 'success': True })

# 【api】创建主题
@app.route('/api/addTopic', methods=['POST'])
def api_add_topic():
    f = request.form.to_dict()
    topic = TTopic(name=f['name'], desc=f['desc'], is_delete=0, creator_id=current_user.id)
    db.session.add(topic)
    db.session.commit()
    return jsonify({ 'code': 200, 'success': True })
# 【api】查询主题列表
@app.route('/api/queryTopics', methods=['GET'])
def api_query_topics():
    topics = db.session.query(TTopic).order_by(TTopic.gmt_modify.desc()).filter_by(is_delete=0).all()
    topiclist = []
    for topic in topics:
        topiclist.append(topic.to_json())
    return jsonify({ 'code': 200, 'success': True, 'data': topiclist })

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

