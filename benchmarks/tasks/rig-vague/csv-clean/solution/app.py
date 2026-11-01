import csv,sys

def clean(rows): return [[cell.strip() for cell in row] for row in rows if any(cell.strip() for cell in row)]
def run(path):
 with open(path,newline='') as f: rows=list(csv.reader(f))
 return clean(rows)
if __name__=='__main__': import json; print(json.dumps(run(sys.argv[1])))
