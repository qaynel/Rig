from http.server import BaseHTTPRequestHandler,HTTPServer
from urllib.parse import urlparse,parse_qs
import json,os,pathlib
HTML=pathlib.Path(os.environ.get('TASK_ENV','/app'),'index.html')
def handle(method,path,data=None): return (200,{'title':'Community Garden Day','date':'2026-11-08','venue':'Riverside Park'}) if method=='GET' and path.path=='/api/event' else (404,{'error':'not found'})
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  p=urlparse(self.path); status,body=handle('GET',p,None)
  if p.path=='/' or p.path=='/about':
   title='About' if p.path=='/about' else None; raw=HTML.read_text().encode()
   if title: raw=raw.replace(b'<h1>Welcome</h1>',b'<h1>About</h1>')
   self.send_response(200); self.send_header('Content-Type','text/html; charset=utf-8'); self.end_headers(); self.wfile.write(raw); return
  self.sendjson(status,body)
 def do_POST(self):
  p=urlparse(self.path); data=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))) or b'{}'); status,body=handle('POST',p,data); self.sendjson(status,body)
 def sendjson(self,status,body):
  raw=json.dumps(body).encode(); self.send_response(status); self.send_header('Content-Type','application/json'); self.end_headers(); self.wfile.write(raw)
 def log_message(self,*a): pass
def create_server(): return HTTPServer(('127.0.0.1',0),Handler)
if __name__=='__main__': create_server().serve_forever()
