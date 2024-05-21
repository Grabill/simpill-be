from rank_bm25 import BM25Okapi
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import numpy as np
import json, nltk
from bs4 import BeautifulSoup

nltk.download('wordnet')
wl = WordNetLemmatizer()


class BM25:
    def __init__(self, query, data): # data is a list of strings
        self.query = self.processData(query.replace('effective use ', '').lower())
        # self.data = self.cleanData(json.loads(data))
        self.data = data
        self.tokenized_corpus = self.inputData(self.data)
        self.bm25 = BM25Okapi(self.tokenized_corpus)
    
    def inputData(self, data):
        new_data = []
        for i in data:
            i = i['description']
            if i['uses'] != None and len(i['uses']) > 0:
                new_data.append(self.processData(str(i['overview']) + str(i['uses'])))
        return new_data

    def processData(self, data):
        wordtokenized_data = word_tokenize(data)
        lemmatized_data = [wl.lemmatize(word).lower() for word in wordtokenized_data]
        return lemmatized_data
    
    def queryBM25(self):
        scores = self.bm25.get_scores(self.query)
        sorted_indices = np.argsort(scores)[::-1]
        results = [self.data[i] for i in sorted_indices]

        # with open('results.json', 'w') as f:
        #     print('Writing results to file...')
        #     json.dump(results, f, indent=4)
        return results
    
    def cleanData(self, data):
        cleaned_data = []
        for entry in data:
            try:
                if not entry.get('uses') or len(entry['uses']) == 0:
                    continue

                cleaned_entry = {}

                # Clean 'name' field
                cleaned_entry['name'] = entry['name']

                # Clean 'overview' field
                overview_text = entry['overview'] if entry.get('overview') else ''
                cleaned_entry['overview'] = BeautifulSoup(overview_text, 'html.parser').get_text()

                # Extract and clean 'uses' field
                uses_text = ''
                for use in entry['uses']:
                    if all(key in use for key in ['title', 'uses']):
                        title = use['title']
                        if any(word.lower() in title.lower() for word in ['ineffective', 'not recommended', 'insufficient']):
                            # print('Skipping...')
                            continue

                        li_tags = BeautifulSoup(use['uses'], 'html.parser').find_all('li')
                        symptoms = [li.get_text(strip=True) for li in li_tags]
                        uses_text += ' '.join([f"{title} {symptom}" for symptom in symptoms])

                if uses_text:
                    cleaned_entry['uses'] = uses_text
                    cleaned_data.append(cleaned_entry)

            except Exception as e:
                print('Error: ', e)
                raise e

        return cleaned_data


    
