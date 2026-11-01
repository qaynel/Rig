import json,os,subprocess,sys,tempfile,pathlib

def run(rows):
 d=tempfile.TemporaryDirectory(); p=pathlib.Path(d.name)/'sales.csv'; p.write_text('day,amount\n'+'\n'.join(rows)+'\n'); return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP'],str(p)],text=True))
def test_groups_and_sums(): assert run(['Mon,4.10','Tue,5','Mon,2.90'])=={'Mon':7.0,'Tue':5.0}
def test_empty_file(): assert run([])=={}
