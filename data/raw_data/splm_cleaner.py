import json
from bs4 import BeautifulSoup, Tag, NavigableString

with open('splm.json', 'r') as f:
    data = json.load(f)

def test(tag):
    for i in data:
        if i["name"].lower() == "magnesium":
            return i[tag]

class Cleaner:
    def __init__(self):
        pass


    # Define a function to extract text while preserving <b> and <br> tags
    @staticmethod
    def extract_with_preserved_tags(soup, tags_to_preserve):
        if soup == None:
            return None

        # Initialize an empty list to store parts of the final string
        parts = []
        flag = ''

        # Iterate through the elements in the parsed HTML
        for element in soup.recursiveChildGenerator():
            # If the element is a tag and it's in the tags_to_preserve list, add the opening tag
            if isinstance(element, Tag):
                if element.name in tags_to_preserve:
                    parts.append(f'<{element.name}>')
            # If the element is a NavigableString (text), add its text content
            elif isinstance(element, NavigableString):
                parts.append(str(element))

                if flag != '' and flag != '</br>':
                    parts.append(flag)
                    flag = ''

            # Handle closing tags
            if isinstance(element, Tag):
                if element.name in tags_to_preserve:
                    # parts.append(f'</{element.name}>')
                    flag = f'</{element.name}>'

        # Join the parts into a single string
        return ''.join(parts)

    def get_overview(self, raw_data):
        if raw_data == None:
            return None

        soup = BeautifulSoup(raw_data, 'html.parser')

        # Replace <br> tags with a unique placeholder
        # for br in soup.find_all('br'):
        #     br.replace_with('[[BR]]')

        text = self.extract_with_preserved_tags(soup, ['br'])

        return text
    
    def get_uses(self, raw_data):
        if raw_data == None:
            return None

        soup = BeautifulSoup(raw_data, 'html.parser')
        uses_ul = []
        uses_list = []
        uses_h3 = []
        orders = []

        for i in soup.find_all('h3'):
            # remove first and last character
            uses_h3.append(i.text[1:-1])

        for i in soup.find_all('ul'):
            uses_ul.append(i)

        for e in soup.recursiveChildGenerator():
            if e.name == 'h3':
                orders.append(0)
            elif e.name == 'ul':
                orders.append(1)

        # Replace <li> tags in uses_ul with a unique placeholder
        for ul in uses_ul:
            uses_list.append([li.get_text() for li in ul.find_all('li')])
            
        # print(uses_list)
            
        # add ul and li tags to uses_list
        uses_ul = [f'<ul>{"".join([f"<li>{li}</li>" for li in uses])}</ul>' for uses in uses_list]
        # print(uses_ul[0])

        res = []
        # for i in range(len(uses_h3)):
        #     res.append({
        #         "title": uses_h3[i],
        #         "uses": uses_ul[i]
        #     })

        id_h3 = 0
        id_ul = 0
        for i in range(len(orders)):
            if orders[i] == 0:
                res.append({
                    "title": uses_h3[id_h3],
                })
                id_h3 += 1
            elif orders[i] == 1:
                res[-1]["uses"] = uses_ul[id_ul]
                id_ul += 1

        return res
    
    def get_side_effects(self, raw_data):
        if raw_data == None:
            return None

        soup = BeautifulSoup(raw_data, 'html.parser')
        
        # keep <b> </b> and <br> tags
        tags_to_preserve = ['b', 'br']
        side_effects = self.extract_with_preserved_tags(soup, tags_to_preserve)

        return side_effects
        
    def get_precautions(self, raw_data):
        return self.get_side_effects(raw_data)
    
    def get_interactions(self, raw_data):
        if raw_data == None:
            return None

        soup = BeautifulSoup(raw_data, 'html.parser')
        details = []

        for i in soup.find_all('ul'):
            details.append({})
            details[-1]['title'] = i.find('h3').get_text()
            details[-1]['annotation'] = i.find('p').get_text()[1:-1]
            details[-1]['list'] = []

            for j in i.find_all('li'):
                details[-1]['list'].append({})
                details[-1]['list'][-1]['subtitle'] = j.find('h3').get_text()
                details[-1]['list'][-1]['content'] = self.extract_with_preserved_tags(j.find('p'), ['br'])

        return details
    
    def get_dosing(self, raw_data):
        if raw_data == None:
            return None

        res = '>'.join(raw_data.split('>')[1:-2] + [''])

        return res
        

    
# a = test("uses")
# b = Cleaner().get_uses(a)
# print(b)

def run():
    cleaned_data = []
    cleaner = Cleaner()

    for i in data:
        print(i["name"])
        cleaned_data.append({
            "name": i["name"],
            "overview": cleaner.get_overview(i["overview"]),
            "uses": cleaner.get_uses(i["uses"]),
            "side_effects": cleaner.get_side_effects(i["side_effects"]),
            "precautions": cleaner.get_precautions(i["precautions"]),
            "interactions": cleaner.get_interactions(i["interactions"]),
            "dosing": cleaner.get_dosing(i["dosing"])
        })

    with open('splm_cleaned.json', 'w') as f:
        json.dump(cleaned_data, f)

run()
