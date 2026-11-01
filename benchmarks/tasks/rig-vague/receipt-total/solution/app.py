import json,sys
from decimal import Decimal,ROUND_HALF_UP

def total(receipt):
 subtotal=sum((Decimal(str(x)) for x in receipt['items']),Decimal(0)); tax=subtotal*Decimal(str(receipt.get('tax_rate',0)))
 return str((subtotal+tax).quantize(Decimal('0.01'),rounding=ROUND_HALF_UP))
if __name__=='__main__': print(json.dumps(total(json.load(sys.stdin))))
