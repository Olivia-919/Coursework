from app import app, db
from app.models import TUser, TClaim, TClaimsRel, TReply, TTopic

@app.shell_context_processor
def make_shell_context():
    return { 'db': db, 'User': TUser }
