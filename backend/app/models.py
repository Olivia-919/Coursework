# coding: utf-8
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_login import UserMixin
from app import login

db = SQLAlchemy()



class TClaim(db.Model):
    __tablename__ = 't_claim'

    id = db.Column(db.BigInteger, primary_key=True, info='主键 自增')
    name = db.Column(db.String(50), info='声明标题')
    content = db.Column(db.String(300), info='声明内容')
    creator_id = db.Column(db.BigInteger, info='创建者ID')
    topic_id = db.Column(db.BigInteger, info='所属主题ID')
    is_delete = db.Column(db.Integer, server_default=db.FetchedValue(), info='是否删除 1-是 0-否')
    gmt_create = db.Column(db.DateTime, default=datetime.datetime.now, info='创建时间')
    gmt_modify = db.Column(db.DateTime, default=datetime.datetime.now, info='更新时间')

    def to_json(self):
        '''将实例对象转换为json'''
        item = self.__dict__
        if '_sa_instance_state' in item:
            del item['_sa_instance_state']
        return item



class TClaimsRel(db.Model):
    __tablename__ = 't_claims_rel'

    id = db.Column(db.BigInteger, primary_key=True, info='主键 自增')
    claim_id = db.Column(db.BigInteger, nullable=False, info='声明ID')
    rel_claim_id = db.Column(db.BigInteger, nullable=False, info='被关联的声明ID')
    creator_id = db.Column(db.BigInteger, info='创建人ID')
    gmt_create = db.Column(db.DateTime, default=datetime.datetime.now, info='创建时间')



class TReply(db.Model):
    __tablename__ = 't_reply'

    id = db.Column(db.BigInteger, primary_key=True, info='主键 自增')
    content = db.Column(db.String(300), info='评论/回复内容')
    creator_id = db.Column(db.BigInteger, info='评论/回复人ID')
    topic_id = db.Column(db.BigInteger, info='关联主题ID')
    claim_id = db.Column(db.BigInteger, info='关联声明ID')
    reply_id = db.Column(db.BigInteger, info='关联评论ID')
    type = db.Column(db.Integer, info='1-评论 2-回复')
    idea = db.Column(db.Integer, info='1-澄清 2-支持 3-反对')
    is_delete = db.Column(db.Integer, server_default=db.FetchedValue(), info='是否删除 1-是 0-否')
    gmt_create = db.Column(db.DateTime, default=datetime.datetime.now, info='创建时间')
    gmt_modify = db.Column(db.DateTime, default=datetime.datetime.now, info='更新时间')

    def to_json(self):
        '''将实例对象转换为json'''
        item = self.__dict__
        if '_sa_instance_state' in item:
            del item['_sa_instance_state']
        return item

class TTopic(db.Model):
    __tablename__ = 't_topic'

    id = db.Column(db.BigInteger, primary_key=True, info='主键 自增')
    name = db.Column(db.String(100), info='主题标题')
    desc = db.Column(db.String(300), info='主题描述')
    creator_id = db.Column(db.BigInteger, info='创建者ID')
    is_delete = db.Column(db.Integer, server_default=db.FetchedValue(), info='是否删除 1-是 0-否')
    gmt_create = db.Column(db.DateTime, default=datetime.datetime.now, info='创建时间')
    gmt_modify = db.Column(db.DateTime, default=datetime.datetime.now, info='更新时间')

    def to_json(self):
        '''将实例对象转换为json'''
        item = self.__dict__
        if '_sa_instance_state' in item:
            del item['_sa_instance_state']
        return item



class TUser(UserMixin, db.Model):

    # is_authenticated: 一个用来表示用户是否通过登录认证的属性，用True和False表示。
    # is_active: 如果用户账户是活跃的，那么这个属性是True，否则就是False（译者注：活跃用户的定义是该用户的登录状态是否通过用户名密码登录，通过“记住我”功能保持登录状态的用户是非活跃的）。
    # is_anonymous: 常规用户的该属性是False，对特定的匿名用户是True。
    # get_id(): 返回用户的唯一id的方法，返回值类型是字符串(Python 2下返回unicode字符串).

    __tablename__ = 't_user'

    id = db.Column(db.BigInteger, primary_key=True, info='主键 自增')
    name = db.Column(db.String(20), info='用户账号')
    display_name = db.Column(db.String(20), info='用户昵称')
    password = db.Column(db.String(50), info='用户密码')
    sex = db.Column(db.Integer, info='性别 1-男 0-女')
    gmt_create = db.Column(db.DateTime, default=datetime.datetime.now, info='注册时间')
    gmt_modify = db.Column(db.DateTime, default=datetime.datetime.now, info='更新时间')
    avatar = db.Column(db.String(1000), info='头像地址')
    status = db.Column(db.Integer, info='用户状态 1-正常 2-锁定 3-注销')

    def __init__(self, obj):
        for k in obj:
            setattr(self, k, obj[k])

    def to_json(self):
        '''将实例对象转换为json'''
        item = self.__dict__
        if '_sa_instance_state' in item:
            del item['_sa_instance_state']
        return item

@login.user_loader
def load_user(id):
    return TUser.query.get(int(id))