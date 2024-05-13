import json 

with open('splm_cleaned.json') as f:
    data = json.load(f)

data1 = []

for i in data:
    if i['uses'] != None \
        and len(i['uses']) > 0 \
            and "insufficient" not in i['uses'].lower() \
                and 'effective' in i['uses'].lower():
        data1.append(i)

with open('splm_cleaned1.json', 'w') as f:
    json.dump(data1, f, indent=4)