from rank_bm25 import BM25Okapi
import json, nltk, os, time
from wmd import SimilarityCalculator
from bm25 import BM25
nltk.download('punkt')

class Data:
    def __init__(self):
        self.data, self.raw_data = self.inputData()
        self.tokenized_corpus = [nltk.word_tokenize(doc) for doc in self.data]
        self.bm25 = BM25Okapi(self.tokenized_corpus)

    def inputData(self):
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
        
        # convert out to string
        return json.dumps(out)


class SubProces:
    pass    

class Communicator:
    def __init__(self) -> None:
        self.pyPipe = '/tmp/pyPipeSimpill'
        self.jsPipe = '/tmp/jsPipeSimpill'
        self.data = SimilarityCalculator('../data/cleaned_data/splm_cleaned1.json')
        # self.data = Data()
        self.childPids = []

        if os.path.exists(self.pyPipe):
            os.remove(self.pyPipe)
        if os.path.exists(self.jsPipe):
            os.remove(self.jsPipe)

        os.mkfifo(self.pyPipe)
        os.mkfifo(self.jsPipe)

    def writePipe(self, msg):
        fd = os.open(self.pyPipe, os.O_RDWR)
        os.write(fd, (msg + "|").encode())
        print('write:', msg)

    def readPipe(self):
        fd = os.open(self.jsPipe, os.O_RDWR)
        x = os.read(fd, 1023).decode().split('|')
        print('read:', x)
        os.close(fd)
        return x
    
    # format: id query
    def processQuery(self, qStr):
        pid = os.fork()

        # return if it is the parent process
        if pid > 0:
            self.childPids.append(pid)
            return
        
        qStrSplit = qStr.split()
        print(qStrSplit)
        id = qStrSplit[0]
        qStr = ' '.join(qStrSplit[1:])

        res = self.data.query(qStr)

        bm25 = BM25(qStr, res)
        res = bm25.queryBM25()

        # print(id, ':', str(res))
        self.writePipe(id + ' ' + str(res))


        print('query processed:', qStr)
        time.sleep(60)
        print('sleep done')

        os._exit(0)

    
    def run(self):
        while True:
            # remove child pids that have finished
            self.childPids = [pid for pid in self.childPids if os.waitpid(pid, os.WNOHANG) == (0, 0)]

            if os.path.exists(self.jsPipe):
                qStrs = self.readPipe()

                # call os.fork to process each query
                print('qStrs:', qStrs)
                for qStr in qStrs:
                    if qStr == 'quit':
                        print('quitting')

                        # use os.waitpid to wait for child processes to finish
                        for pid in self.childPids:
                            os.waitpid(pid, 0)

                        return
                    # print(qStr[0])
                    if len(qStr) > 0 and qStr[0].isalnum():
                        print('Calling processQuery')
                        self.processQuery(qStr)
                    
if __name__ == '__main__':
    comm = Communicator()
    comm.run()