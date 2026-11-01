import json,os,pathlib
from http.server import BaseHTTPRequestHandler,HTTPServer
from urllib.parse import urlparse,parse_qs
def dbfile(): return pathlib.Path(os.environ.get('DB_PATH','/tmp/rig-app-data.json'))
HTML=pathlib.Path(os.environ.get('TASK_ENV','/app'),'index.html')
def db():
 path=dbfile()
 if not path.exists(): return {'volunteers':[],'clubs':[],'meals':[],'projects':[],'donations':[],'articles':[]}
 return json.loads(path.read_text())
def save(value): dbfile().write_text(json.dumps(value))
def response(method,path,data=None):
 state=db()
 if method=='GET' and path.path=='/api/shopping':
  counts={}
  for meal in db()['meals']:
   for item in meal['items']: counts[item]=counts.get(item,0)+1
  return 200,dict(sorted(counts.items()))
 if method=='POST' and path.path=='/api/meals':
  name=str(data.get('name','')).strip(); items=data.get('items')
  if not name or not isinstance(items,list) or any(not isinstance(x,str) for x in items):return 400,{'error':'meal name and item list required'}
  state=db(); state['meals'].append({'name':name,'items':items}); save(state); return 201,{'name':name}
 return 404,{'error':'not found'}
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  path=urlparse(self.path)
  if path.path=='/':
   raw=HTML.read_bytes(); self.send_response(200); self.send_header('Content-Type','text/html'); self.end_headers(); self.wfile.write(raw); return
  status,body=response('GET',path); self.sendjson(status,body)
 def do_POST(self):
  path=urlparse(self.path); data=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))) or b'{}'); status,body=response('POST',path,data); self.sendjson(status,body)
 def sendjson(self,status,body):
  raw=json.dumps(body).encode(); self.send_response(status); self.send_header('Content-Type','application/json'); self.end_headers(); self.wfile.write(raw)
 def log_message(self,*a): pass
def create_server(): return HTTPServer(('127.0.0.1',0),Handler)
if __name__=='__main__': create_server().serve_forever()
