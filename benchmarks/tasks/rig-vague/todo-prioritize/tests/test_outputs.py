import json,os,subprocess,sys,tempfile

def cli(data): return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP']],input=json.dumps(data),text=True))
def test_orders_urgency_deadline_and_name():
 rows=[{'name':'Later','priority':1,'days_due':1},{'name':'Beta','priority':2,'days_due':3},{'name':'Alpha','priority':2,'days_due':3},{'name':'Soon','priority':2,'days_due':1}]
 assert [x['name'] for x in cli(rows)]==['Soon','Alpha','Beta','Later']
def test_empty_list(): assert cli([])==[]
