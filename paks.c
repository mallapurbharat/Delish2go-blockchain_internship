hrs = float(input())
extHr=0
amt=0
if(hrs>40):
    extHr=hrs-40
    hrs=40

amt=(hrs*10.5)+(extHr*10.5*1.5)
print(amt)