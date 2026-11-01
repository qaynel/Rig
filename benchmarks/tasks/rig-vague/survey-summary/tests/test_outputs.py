import json,os,subprocess,sys,tempfile,pathlib

def run(rows):
 d=tempfile.TemporaryDirectory(); p=pathlib.Path(d.name)/'ratings.csv'; p.write_text('rating\n'+'\n'.join(rows)+'\n'); return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP'],str(p)],text=True))
def test_ignores_invalid_and_out_of_range(): assert run(['5','3','bad','7'])=={'average':4.0,'count':2}
def test_no_valid_ratings(): assert run(['','0'])=={'average':None,'count':0}
