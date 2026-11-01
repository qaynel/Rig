import json
from http.server import BaseHTTPRequestHandler,HTTPServer
from urllib.parse import urlparse,parse_qs

def response(method,path,data):
 if method=='POST' and path.path=='/restock':
  try: minimum=int(data['minimum']); stock=data['stock']
  except (KeyError,TypeError,ValueError): return 400,{'error':'stock and minimum required'}
  if minimum<0 or not isinstance(stock,dict): return 400,{'error':'invalid stock'}
  return 200,{'items':sorted(k for k,v in stock.items() if int(v)<minimum)}
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
