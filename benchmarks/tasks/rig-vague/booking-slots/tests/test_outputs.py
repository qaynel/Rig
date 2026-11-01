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
def test_booking_removes_slot_and_rejects_collision():
 p=start()
 try:
  assert call(p[0],'/book',{'slot':'10:00'})==(201,{'booked':'10:00'})
  assert call(p[0],'/slots')==(200,{'available':['09:00','11:00']})
  assert call(p[0],'/book',{'slot':'10:00'})[0]==409
 finally: stop(p)
def test_unknown_slot():
 p=start()
 try: assert call(p[0],'/book',{'slot':'12:00'})[0]==400
 finally: stop(p)
