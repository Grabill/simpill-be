from rank_bm25 import BM25Okapi
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import numpy as np
import json, nltk

nltk.download('wordnet')
wl = WordNetLemmatizer()


class BM25:
    def __init__(self, query, data): # data is a list of strings
        self.query = self.processData(query.replace('Effective for', ''))
        self.data = data
        self.tokenized_corpus = self.inputData(data)
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
        lemmatized_data = [wl.lemmatize(word) for word in wordtokenized_data]
        return lemmatized_data
    
    def queryBM25(self):
        scores = self.bm25.get_scores(self.query)
        sorted_indices = np.argsort(scores)[::-1]
        results = [self.data[i] for i in sorted_indices]

        with open('results.json', 'w') as f:
            json.dump(results, f, indent=4)
        return results
    
