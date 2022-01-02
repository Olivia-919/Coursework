import os

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you will never guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://{username}:{password}@{url}:{port}/{dbname}?charset=utf8mb4'.format(
        username='root',
        password='yangyu1024',
        url='localhost',
        port=3306,
        dbname='coursework'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    TEMPLATES_AUTO_RELOAD=True