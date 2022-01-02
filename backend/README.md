```

# 启动虚拟环境
python3 -m venv venv
source venv/bin/activate

# 
pip install flask flask-sqlalchemy pymysql
# 
pip install flask-migrate

# 表单支持
pip install flask-wtf

# 注册登录
pip install flask-login

# 集成 bootstrap
# 文档 https://github.com/greyli/bootstrap-flask https://bootstrap-flask.readthedocs.io/en/stable/basic.html
pip install bootstrap-flask

# 根据数据库已有的表，自动化生成模型类工具
pip install flask-sqlacodegen
# 执行下面的命令，将模型类输出到指定文件中
flask-sqlacodegen --flask --outfile <输出到哪个文件> <数据库连接URI>

e.g.
flask-sqlacodegen --flask --outfile app/models.py mysql+pymsql://username:password@localhost:3306/dbname

```