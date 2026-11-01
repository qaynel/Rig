import json,os,subprocess,sys,tempfile,pathlib

def run(rows):
 d=tempfile.TemporaryDirectory(); p=pathlib.Path(d.name)/'dates.csv'; p.write_text('date\n'+'\n'.join(rows)+'\n'); return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP'],str(p)],text=True))
def test_month_boundaries(): assert run(['2026-01-31','2026-02-01','2026-01-04'])=={'2026-01':2,'2026-02':1}
def test_empty(): assert run([])=={}
