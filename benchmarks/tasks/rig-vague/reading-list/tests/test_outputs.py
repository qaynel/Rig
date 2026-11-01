import json,os,subprocess,sys

def run(x): return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP']],input=json.dumps(x),text=True))
def test_dedupes_case_insensitive_and_keeps_first_spelling(): assert run([' Dune ','dUNE','The Dispossessed',''])==['Dune','The Dispossessed']
def test_empty(): assert run([])==[]
