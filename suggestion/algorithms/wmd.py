from nltk.corpus import stopwords
from nltk import download
from nltk import sent_tokenize
from nltk.stem import PorterStemmer
import gensim.downloader as api
from gensim.similarities import WmdSimilarity
import numpy as np
import json
from scipy.spatial.distance import cdist
from bs4 import BeautifulSoup
from .suggestor import Suggestor

class DataPreprocessor:
    def __init__(self):
        self.stop_words = stopwords.words('english')
        self.porter = PorterStemmer()

    def preprocess_sentence(self, sentence):
        return [self.porter.stem(word) for word in sentence.lower().split() if word not in self.stop_words]

    def preprocess_paragraph(self, paragraph):
        return [self.preprocess_sentence(sentence) for sentence in sent_tokenize(paragraph)]
    

<<<<<<< HEAD:suggestion/wmd.py
# WMD: https://proceedings.mlr.press/v37/kusnerb15.pdf
class SimilarityCalculator:
    def __init__(self, data):
=======
class SimilarityCalculator(Suggestor):
    def __init__(self):
>>>>>>> fa216a611bf63295f24747f8deae55dc12385b97:suggestion/algorithms/wmd.py
        print('Loading model...')
        self.model = api.load('word2vec-google-news-300')
        download('stopwords')
        self.data = []
        self.descriptions = []
        self.processed_descriptions = []
        self.wmd_instances = []

    def loadData(self, data):
        data = json.loads(data)
        self.data = self.clean_data(data)
        print('Model loaded.')
        self.descriptions = [(str(d['overview']) + str(d['uses'])).lower() for d in self.data]
        self.processed_descriptions = [DataPreprocessor().preprocess_paragraph(d) for d in self.descriptions]
        self.wmd_instances = [WmdSimilarity(desc, self.model, num_best=4) for desc in self.processed_descriptions]
        print('Instances created.')

    def get_word_embeddings(self, tokens):
        return [self.model[word] for word in tokens if word in self.model.key_to_index]

    # paper: https://arxiv.org/pdf/1912.00509
    def RWMD(self, query_tokens, target_tokens):
        query_embeddings = self.get_word_embeddings(query_tokens)
        target_embeddings = self.get_word_embeddings(target_tokens)

        if len(query_embeddings) == 0 or len(target_embeddings) == 0:
            return float('inf')
        
        # Compute the distance matrix between embeddings
        distance_matrix = cdist(query_embeddings, target_embeddings, metric='cosine')
        
        # Compute forward distance: each word in doc1 to closest word in doc2
        forward_distance = np.mean(np.min(distance_matrix, axis=1))
        
        # Compute backward distance: each word in doc2 to closest word in doc1
        backward_distance = np.mean(np.min(distance_matrix, axis=0))
        
        # RWMD is the maximum of the forward and backward distances
        rwmd_distance = max(forward_distance, backward_distance)

        # print(rwmd_distance)

        return rwmd_distance
    
    # dung cho RWMD
    def get_avg_distances(self, query, threshold=4.5):
        avg_distances = []
        for desc in self.processed_descriptions:
            distances = []
            for sentence in desc:
                distances.append(self.RWMD(query, sentence))
            distances = [distance for distance in distances if distance < threshold]
            avg_distances.append(np.mean(distances) if len(distances) > 0 else 0)
        # print(avg_distances)

        return avg_distances
    
    # dung cho WMD
    def get_avg_sims(self, query, threshold=0.43):
        avg_sims = []
        for instance in self.wmd_instances:
            sims = instance.get_similarities(query)
            sims = sims[sims > threshold]
            avg_sims.append(np.mean(sims) if len(sims) > 0 else 0)
        return avg_sims

    def get_similarity(self, query):
        print('Calculating similarity...')
        query = DataPreprocessor().preprocess_sentence(query)
        avg_distances = self.get_avg_distances(query)
        # avg_distances = self.get_avg_sims(query)
        sorted_indices = np.argsort(avg_distances)
        results = [{'description': self.data[i], 'distance': avg_distances[i]} for i in sorted_indices]
        print('Similarity calculated.')
        return results
    
    def query(self, qStr):
        print('Query: ', qStr)
        # res = res.get_similarity(qStr)
        return self.get_similarity(qStr)
    
    def clean_data(self, data):
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

    
if __name__ == "__main__":
    query = 'Treatment of acne itchy skin'
    calculator = SimilarityCalculator('../data/cleaned_data/splm_cleaned1.json')
    results = calculator.get_similarity(query)
    with open('results.json', 'w') as f:
        json.dump(results, f, indent=4)


