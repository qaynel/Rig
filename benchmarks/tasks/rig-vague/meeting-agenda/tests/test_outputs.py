import json,os,subprocess,sys

def run(x): return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP']],input=json.dumps(x),text=True))
def test_order_and_ties(): assert run([{'topic':'Wrap up','order':3},{'topic':'Budget','order':1},{'topic':'Aims','order':1}])==['Aims','Budget','Wrap up']
def test_empty_agenda(): assert run([])==[]
