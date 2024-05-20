from rank_bm25 import BM25Okapi
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import numpy as np
import json, nltk
from .suggestor import Suggestor

nltk.download('wordnet')
wl = WordNetLemmatizer()


class BM25(Suggestor):
    def __init__(self): # data is a list of strings
        self.data = []
        self.tokenized_corpus = []
        self.bm25 = None

    def loadData(self, data: list) -> None:
        # self.queryStr = self.processData(queryStr)
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
    
    def query(self, queryStr: str) -> list:
        scores = self.bm25.get_scores(queryStr)
        sorted_indices = np.argsort(scores)[::-1]
        results = [self.data[i] for i in sorted_indices]

        with open('results.json', 'w') as f:
            json.dump(results, f, indent=4)
        return results
    
