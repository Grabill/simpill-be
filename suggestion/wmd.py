from nltk.corpus import stopwords
from nltk import download
from nltk import sent_tokenize
from nltk.stem import PorterStemmer
import gensim.downloader as api
from gensim.similarities import WmdSimilarity
import numpy as np
import json
from bs4 import BeautifulSoup

class DataPreprocessor:
    def __init__(self):
        self.stop_words = stopwords.words('english')
        self.porter = PorterStemmer()

    def preprocess_sentence(self, sentence):
        return [self.porter.stem(word) for word in sentence.lower().split() if word not in self.stop_words]

    def preprocess_paragraph(self, paragraph):
        return [self.preprocess_sentence(sentence) for sentence in sent_tokenize(paragraph)]
    

class SimilarityCalculator:
    def __init__(self, data):
        print('Loading model...')
        self.model = api.load('word2vec-google-news-300')
        download('stopwords')
        data = json.loads(data)
        self.data = self.clean_data(data)
        print('Model loaded.')
        self.descriptions = [(str(d['overview']) + str(d['uses'])).lower() for d in self.data]
        self.processed_descriptions = [DataPreprocessor().preprocess_paragraph(d) for d in self.descriptions]
        self.wmd_instances = [WmdSimilarity(desc, self.model, num_best=4) for desc in self.processed_descriptions]
        print('Instances created.')
    
    def get_avg_sims(self, query, threshold, num_processes=2):
        avg_sims = []
        for instance in self.wmd_instances:
            sims = instance.get_similarities(query)
            sims = sims[sims > threshold]
            avg_sims.append(np.mean(sims) if len(sims) > 0 else 0)
        return avg_sims

    def get_similarity(self, query, threshold=0.43):
        print('Calculating similarity...')
        query = DataPreprocessor().preprocess_sentence(query)
        avg_sims = self.get_avg_sims(query, threshold)
        sorted_indices = np.argsort(avg_sims)[::-1]
        results = [{'description': self.data[i], 'similarity': avg_sims[i]} for i in sorted_indices]
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


