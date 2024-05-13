from nltk.corpus import stopwords
from nltk import download
from nltk import sent_tokenize
from nltk.stem import PorterStemmer
import gensim.downloader as api
from gensim.similarities import WmdSimilarity
import numpy as np
import json

class DataPreprocessor:
    def __init__(self):
        download('stopwords')
        self.stop_words = stopwords.words('english')
        self.porter = PorterStemmer()

    def preprocess_sentence(self, sentence):
        return [self.porter.stem(word) for word in sentence.lower().split() if word not in self.stop_words]

    def preprocess_paragraph(self, paragraph):
        return [self.preprocess_sentence(sentence) for sentence in sent_tokenize(paragraph)]
    

class SimilarityCalculator:
    def __init__(self, model_path='../cleaned_data/splm_cleaned.json'):
        print('Loading model...')
        self.model = api.load('word2vec-google-news-300')
        with open(model_path) as f:
            self.data = json.load(f)
        print('Model loaded.')
        self.descriptions = [(str(d['overview']) + str(d['uses'])).lower() for d in self.data]
        self.processed_descriptions = [DataPreprocessor().preprocess_paragraph(d) for d in self.descriptions]
        self.wmd_instances = [WmdSimilarity(desc, self.model, num_best=4) for desc in self.processed_descriptions]

    def get_similarity(self, query, threshold=0.43):
        print('Calculating similarity...')
        query = DataPreprocessor().preprocess_sentence(query)
        avg_sims = []
        for instance in self.wmd_instances:
            sims = instance.get_similarities(query)
            sims = sims[sims > threshold]
            avg_sims.append(np.mean(sims) if len(sims) > 0 else 0)
        sorted_indices = np.argsort(avg_sims)[::-1]
        results = [{'description': self.data[i], 'similarity': avg_sims[i]} for i in sorted_indices]
        print('Similarity calculated.')
        return results
    
    def query(self, qStr):
        print('Query: ', qStr)
        return self.get_similarity(qStr)
    
if __name__ == "__main__":
    query = 'Treatment of acne itchy skin'
    calculator = SimilarityCalculator('../data/cleaned_data/splm_cleaned1.json')
    results = calculator.get_similarity(query)
    with open('results.json', 'w') as f:
        json.dump(results, f, indent=4)


