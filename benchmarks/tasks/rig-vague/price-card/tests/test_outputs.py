import importlib.util,os,threading,urllib.request,urllib.error,json,pathlib
s=importlib.util.spec_from_file_location('subject',os.environ['TASK_APP']); subject=importlib.util.module_from_spec(s); s.loader.exec_module(subject)
def start():
 server=subject.create_server(); t=threading.Thread(target=server.serve_forever,daemon=True); t.start(); return server,t
def page(path='/'):
 p=start()
 try:
  with urllib.request.urlopen(f'http://127.0.0.1:{p[0].server_port}{path}') as r: return r.read().decode()
 finally: p[0].shutdown(); p[0].server_close(); p[1].join()
def request(path,body=None):
 p=start()
 try:
  url=f'http://127.0.0.1:{p[0].server_port}{path}'; req=urllib.request.Request(url,data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json'},method='POST' if body is not None else 'GET')
  try:
   with urllib.request.urlopen(req) as r: return r.status,json.loads(r.read())
  except urllib.error.HTTPError as e: return e.code,json.loads(e.read())
 finally: p[0].shutdown(); p[0].server_close(); p[1].join()
def get(path): return request(path)[1]
def post(path,body): return request(path,body)
def test_price_ui_exposes_old_new_and_savings():
 h=page(); assert '<del>$80.00</del>' in h and '<strong>$60.00</strong>' in h and 'save $20.00' in h
def test_price_api_handles_quantity(): assert get('/api/price?quantity=3')=={'total':180.0,'saved':60.0}