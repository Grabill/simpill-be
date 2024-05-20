from .suggestor import Suggestor
from rank_bm25 import BM25Okapi
import json, nltk

class BM25(Suggestor):
    def __init__(self):
        self.data, self.raw_data = self.inputData()
        self.tokenized_corpus = [nltk.word_tokenize(doc) for doc in self.data]
        self.bm25 = BM25Okapi(self.tokenized_corpus)

    def loadData(self, data=None):
        with open('splm_cleaned.json') as f:
            raw_data = json.load(f)
        data = []
        for i in raw_data:
            if i['uses'] != None and len(i['uses']) > 0:
                data.append(str(i['overview']) + str(i['uses']))
        return [data, raw_data]

    def inputSymp(self):
        with open('symp_cleaned.json') as f:
            raw_data = json.load(f)

        data = []
        for i in raw_data:
            if i['current'].endswith('-1.html'):
                data.append(i)
        return data

    def query(self, qStr):
        res = self.bm25.get_top_n(nltk.word_tokenize(qStr), self.data, n=5)
        out = []

        for i in res:
            for j in self.raw_data:
                if i in str(j['overview']) + str(j['uses']):
                    out.append(j)
                    break
        
        return out
