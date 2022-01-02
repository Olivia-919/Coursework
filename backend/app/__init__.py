from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager

app = Flask(__name__)
app.jinja_env.auto_reload = True
app.config.from_object(Config)
db = SQLAlchemy(app)
csrf = CSRFProtect(app)
login = LoginManager(app)

bootstrap = Bootstrap(app)

from app import routes, models