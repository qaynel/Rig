import json
from http.server import BaseHTTPRequestHandler,HTTPServer
from urllib.parse import urlparse,parse_qs

BOOKED=set()
def response(method,path,data):
 if method=='GET' and path.path=='/slots': return 200,{'available':[s for s in ('09:00','10:00','11:00') if s not in BOOKED]}
 if method=='POST' and path.path=='/book':
  slot=str(data.get('slot',''))
  if slot not in ('09:00','10:00','11:00'): return 400,{'error':'unknown slot'}
  if slot in BOOKED: return 409,{'error':'slot already booked'}
  BOOKED.add(slot); return 201,{'booked':slot}
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
