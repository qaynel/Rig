import importlib.util,os,threading,urllib.request,urllib.error,json
s=importlib.util.spec_from_file_location('subject',os.environ['TASK_APP']); subject=importlib.util.module_from_spec(s); s.loader.exec_module(subject)
def call(server,path,body=None):
 url=f'http://127.0.0.1:{server.server_port}{path}'; req=urllib.request.Request(url,data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json'},method='POST' if body is not None else 'GET')
 try:
  with urllib.request.urlopen(req) as r: return r.status,json.loads(r.read())
 except urllib.error.HTTPError as e: return e.code,json.loads(e.read())
def start():
 server=subject.create_server(); thread=threading.Thread(target=server.serve_forever,daemon=True); thread.start(); return server,thread
def stop(pair): pair[0].shutdown(); pair[0].server_close(); pair[1].join()
def test_end_of_month_and_year():
 p=start()
 try:
  assert call(p[0],'/renewal',{'date':'2026-01-31'})==(200,{'date':'2026-02-28'})
  assert call(p[0],'/renewal',{'date':'2026-12-31'})==(200,{'date':'2027-01-31'})
 finally: stop(p)
def test_invalid_date():
 p=start()
 try: assert call(p[0],'/renewal',{'date':'yesterday'})[0]==400
 finally: stop(p)
