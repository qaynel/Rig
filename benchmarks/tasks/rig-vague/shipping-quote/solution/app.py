import json
from http.server import BaseHTTPRequestHandler,HTTPServer
from urllib.parse import urlparse,parse_qs

def response(method,path,data):
 if method=='POST' and path.path=='/quote':
  try: kg=float(data['kg']); km=float(data['km'])
  except (KeyError,TypeError,ValueError): return 400,{'error':'kg and km required'}
  if kg<0 or km<0: return 400,{'error':'values cannot be negative'}
  return 200,{'cost':round(3+kg*1.5+km*.2,2)}
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
