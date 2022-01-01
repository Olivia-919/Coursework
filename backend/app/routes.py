from flask import render_template
from app import app

@app.route('/')
@app.route('/index')
def index():
    user = { 'username': 'ruo-lan', 'age': 20, 'addr': 'cheng-du' }
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