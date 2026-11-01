import json,os,subprocess,sys,tempfile,pathlib

def run(rows):
 d=tempfile.TemporaryDirectory(); p=pathlib.Path(d.name)/'emails.csv'; p.write_text('email\n'+'\n'.join(rows)+'\n'); return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP'],str(p)],text=True))
def test_normalized_duplicates(): assert run(['A@x.test',' b@x.test ','a@X.test'])==['A@x.test']
def test_unique_values(): assert run(['one@x.test','two@x.test'])==[]
