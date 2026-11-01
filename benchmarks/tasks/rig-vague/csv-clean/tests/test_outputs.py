import csv,json,os,subprocess,sys,tempfile,pathlib

def run(text):
 d=tempfile.TemporaryDirectory(); p=pathlib.Path(d.name)/'in.csv'; p.write_text(text); return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP'],str(p)],text=True))
def test_trims_and_drops_blank_rows(): assert run(' name , city \nAda, London \n ,  \n')==[['name','city'],['Ada','London']]
def test_keeps_numeric_zero(): assert run('value\n0\n')==[['value'],['0']]
