import importlib.util,os,threading,urllib.request,urllib.error,json,tempfile
s=importlib.util.spec_from_file_location('subject',os.environ['TASK_APP']); subject=importlib.util.module_from_spec(s); s.loader.exec_module(subject)
def server():
 x=subject.create_server(); t=threading.Thread(target=x.serve_forever,daemon=True); t.start(); return x,t
def call(s,path,body=None):
 url=f'http://127.0.0.1:{s.server_port}{path}'; req=urllib.request.Request(url,data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json'},method='POST' if body is not None else 'GET')
 try:
  with urllib.request.urlopen(req) as r:return r.status,json.loads(r.read())
 except urllib.error.HTTPError as e:return e.code,json.loads(e.read())
def stop(x): x[0].shutdown();x[0].server_close();x[1].join()
def test_persistent_flow_survives_restart():
 tmp=tempfile.TemporaryDirectory(); os.environ['DB_PATH']=tmp.name+'/db.json'; pair=server()
 try:
  assert call(pair[0],'/api/shopping')[0]==200
  assert call(pair[0],'/api/meals',{'name': 'Soup', 'items': ['carrot', 'onion']})[0]==201
  assert call(pair[0],'/api/meals',{'name': 'Stew', 'items': ['carrot']})[0]==201
 finally: stop(pair)
 pair=server()
 try: assert call(pair[0],'/api/shopping')==(200,{'carrot': 2, 'onion': 1})
 finally: stop(pair); tmp.cleanup()
def test_form_page_has_semantic_labels():
 assert '<main>' in open(os.environ['TASK_ENV']+'/index.html').read() and '<label for="search">' in open(os.environ['TASK_ENV']+'/index.html').read()
