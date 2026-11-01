import json
from http.server import BaseHTTPRequestHandler,HTTPServer
from urllib.parse import urlparse,parse_qs

def response(method,path,data):
 if method=='POST' and path.path=='/triage':
  messages=data.get('messages',[])
  if not isinstance(messages,list) or any(not isinstance(m,str) for m in messages): return 400,{'error':'messages must be text'}
  urgent=('down','cannot log in','security')
  rows=[{'message':m,'priority':'urgent' if any(w in m.casefold() for w in urgent) else 'normal'} for m in messages]
  return 200,{'messages':sorted(rows,key=lambda x:(x['priority']!='urgent',x['message'].casefold()))}
 return 404,{'error':'not found'}
class Handler(BaseHTTPRequestHandler):
 def do_GET(self): self.respond('GET',None)
 def do_POST(self):
  n=int(self.headers.get('Content-Length','0')); self.respond('POST',json.loads(self.rfile.read(n) or b'{}'))
 def respond(self,method,data):
  status,body=response(method,urlparse(self.path),data); raw=json.dumps(body).encode(); self.send_response(status); self.send_header('Content-Type','application/json'); self.send_header('Content-Length',str(len(raw))); self.end_headers(); self.wfile.write(raw)
 def log_message(self,*a): pass
def create_server(): return HTTPServer(('127.0.0.1',0),Handler)
if __name__=='__main__': create_server().serve_forever()
