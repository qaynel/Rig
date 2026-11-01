import json,os,subprocess,sys

def run(x): return json.loads(subprocess.check_output([sys.executable,os.environ['TASK_APP']],input=json.dumps(x),text=True))
def test_safe_extensions_duplicates_and_empty_names(): assert run(['My Photo.JPG','my photo.jpg','你好.txt','...'])==['my-photo.jpg','my-photo-2.jpg','file.txt','file']
def test_names_without_extensions(): assert run(['A&B','A B'])==['a-b','a-b-2']
