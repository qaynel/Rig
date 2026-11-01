import csv,json,sys
def run(path):
 values=[]
 with open(path,newline='') as f:
  for row in csv.DictReader(f):
   try: v=float(row['rating'])
   except (ValueError,KeyError): continue
   if 1<=v<=5: values.append(v)
 return {'average':round(sum(values)/len(values),2) if values else None,'count':len(values)}
if __name__=='__main__': print(json.dumps(run(sys.argv[1])))
