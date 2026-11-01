import json,os,subprocess,sys

def run(x): return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP']],input=json.dumps(x),text=True))
def test_remainder_is_distributed_in_cents(): assert run({'total':'10.00','people':3})==['3.34','3.33','3.33']
def test_one_person(): assert run({'total':'0','people':1})==['0.00']
