import json,os,subprocess,sys

def run(x): return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP']],input=json.dumps(x),text=True))
def test_tax_and_rounding(): assert run({'items':['10.10','2.25'],'tax_rate':'0.0825'})=='13.37'
def test_empty_and_zero_tax(): assert run({'items':[]})=='0.00' and run({'items':['1.005']})=='1.01'
