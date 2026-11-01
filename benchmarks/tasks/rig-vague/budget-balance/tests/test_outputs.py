import json,os,subprocess,sys,tempfile,pathlib

def run(rows):
 d=tempfile.TemporaryDirectory(); p=pathlib.Path(d.name)/'budget.csv'; p.write_text('income,expense\n'+'\n'.join(rows)+'\n'); return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP'],str(p)],text=True))
def test_multiple_rows_and_cents(): assert run(['1000,250.10','0,124.90'])=='625.00'
def test_negative_balance_is_preserved(): assert run(['5,8'])=='-3.00'
