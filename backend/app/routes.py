from os import name
from flask import render_template, request, jsonify
from flask.helpers import flash, make_response, url_for
from flask_login.utils import login_user, logout_user, current_user
from werkzeug.utils import redirect
from app import app, db
import json
from app.models import TUser, TTopic, TClaim, TReply
from app.base_models import Dict

user = { 'username': 'ruo-lan', 'age': 20, 'addr': 'cheng-du' }

#【页面】首页
@app.route('/')
@app.route('/index')
def main_index():
    return render_template('index.html', title='辩论论坛')

#【页面】注册页面
@app.route('/register')
def register_index():
    return render_template('/register.html', title="注册用户")

#【页面】主题详情
@app.route('/topic')
def topic_index():
    return render_template('/topic.html', title="主题")

#【页面】声明详情
@app.route('/claim')
def claim_index():
    return render_template('/claim.html', title="声明")

#【api】发表评论
@app.route('/api/addReply', methods=['POST'])
def api_add_reply():
    f = request.form.to_dict()
    c = TReply(
        content=f['content'],
        topic_id=f['topicId'],
        claim_id=f['claimId'],
        reply_id=f.get('replyId', None),
        idea=f['idea'],
        is_delete=0,
        creator_id=current_user.id
        )
    # type 1-评论 2-回复
    if c.reply_id:
        c.type = 2
    else:
        c.type = 1
    db.session.add(c)
    db.session.commit()
    return jsonify({ 'code': 200, 'success': True })

#【api】新增声明
@app.route('/api/addClaim', methods=['POST'])
def api_add_claim():
    f = request.form.to_dict()
    c = TClaim(name=f['name'], content=f['content'], topic_id=f['topicId'], is_delete=0, creator_id=current_user.id)
    db.session.add(c)
    db.session.commit()
    return jsonify({ 'code': 200, 'success': True })

#【api】评论详情
@app.route('/api/reply', methods=['GET'])
def api_reply_detail():
    replyId = request.args.get('id')
    success = False
    message = ''
    respData = None
    if replyId:
        tp = db.session.query(TReply).filter_by(id=replyId).first()
        if tp:
            tpjson = tp.to_json()
            sql ="""
            select a.*, b.creator_id as reply_person_id from (
                select a.id, a.content, a.creator_id, a.topic_id, a.claim_id, a.reply_id, a.type, a.idea, a.gmt_modify from t_reply a inner join (
                    select id from (
                        select t1.id,t1.reply_id,
                        if(find_in_set(t1.reply_id, @pids) > 0, @pids := concat(@pids, ',', t1.id), 0) as ischild
                        from (
                                select id, reply_id from t_reply t where t.is_delete = 0 order by reply_id, id
                                ) t1,
                                (select @pids := {replyId}) t2
                    ) t3 where ischild != 0
                ) b on a.id = b.id order by a.gmt_modify desc
            ) a LEFT JOIN t_reply b on a.reply_id = b.id
            """.format(replyId=int(replyId))
            # 查询关联的回复
            replies = db.session.execute(sql).fetchall()
            replylist = []
            for (id, content, creator_id, topic_id, claim_id, reply_id, type, idea, gmt_modify, reply_person_id) in replies:
                replylist.append({
                    'id': id,
                    'content': content,
                    'creator_id': creator_id,
                    'topic_id': topic_id,
                    'claim_id': claim_id,
                    'reply_id': reply_id,
                    'type': type,
                    'idea': idea,
                    'gmt_modify': gmt_modify,
                    'reply_person_id': reply_person_id,
                })
            tpjson['children'] = replylist
            success = True
            respData = tpjson
        else:
            success = True
            message = '暂无数据'
    else:
        message = '缺少查询ID'

    return jsonify({ 'code': 200, 'success': success, 'message': message, 'data': respData })

#【api】声明详情
@app.route('/api/claim', methods=['GET'])
def api_claim_detail():
    claimId = request.args.get('id')
    success = False
    message = ''
    respData = None
    if claimId:
        # 查询声明详情
        tp = db.session.query(TClaim).filter_by(id=claimId).first()
        if tp:
            tpjson = tp.to_json()
            # 查询关联的评论
            replies = db.session.query(TReply).order_by(TReply.gmt_modify.desc()).filter_by(claim_id=claimId, type=1, is_delete=0).all()
            replylist = []
            for reply in replies:
                replylist.append(reply.to_json())
            tpjson['children'] = replylist
            success = True
            respData = tpjson
        else:
            success = True
            message = '暂无数据'
    else:
        message = '缺少查询ID'
        
    return jsonify({ 'code': 200, 'success': success, 'message': message, 'data': respData })

#【api】主题详情
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
            sql = "select a.id, a.name, a.content, a.creator_id, a.topic_id, a.gmt_modify, count(b.id) as replyCount from t_claim a left join t_reply b on a.id = b.claim_id and b.is_delete = 0 where a.is_delete = 0 and a.topic_id = {topicid} group by a.id order by a.gmt_modify desc".format(topicid=int(topid))
            # 查询关联的声明
            claims = db.session.execute(sql).fetchall()
            claimlist = []
            for (id, name, content, creator_id, topic_id, gmt_modify, replyCount) in claims:
                claimlist.append({
                    'id': id,
                    'name': name,
                    'content': content,
                    'creator_id': creator_id,
                    'topic_id': topic_id,
                    'gmt_modify': gmt_modify,
                    'replyCount': replyCount
                })
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
    keyword = request.args.get('q')
    filters = [TTopic.is_delete==0]
    if keyword:
        k = '%' + keyword + '%'
        filters.append(TTopic.name.like(k))
    topics = db.session.query(TTopic).filter(*filters).order_by(TTopic.gmt_modify.desc()).all()
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
        userlist.append(user.to_json())
    return_dict = { 'code': 200, 'success': True, 'data': userlist }
    # return json.dumps(return_dict, ensure_ascii=False)
    return jsonify(return_dict)

