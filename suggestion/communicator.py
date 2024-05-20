from rank_bm25 import BM25Okapi
import json, nltk, os, time
from algorithms.wmd import SimilarityCalculator
from algorithms.bm25 import BM25
from algorithms.suggestor import Suggestor
nltk.download('punkt')

class Communicator():
    def __init__(self, suggestor: Suggestor=SimilarityCalculator, advancedModel: Suggestor=BM25):
        self.pyPipe = '/tmp/pyPipeSimpill'
        self.jsPipe = '/tmp/jsPipeSimpill'
        self.childPids = []

        if os.path.exists(self.pyPipe):
            os.remove(self.pyPipe)
        if os.path.exists(self.jsPipe):
            os.remove(self.jsPipe)

        os.mkfifo(self.pyPipe)
        os.mkfifo(self.jsPipe)

        self.data = suggestor()
        self.advancedModel = advancedModel()
        self.MAX_READING_PIPE = 65536 # 64KB

    def writePipe(self, msg):
        fd = os.open(self.pyPipe, os.O_RDWR)
        os.write(fd, (msg + "|").encode())
        print('write:', msg[:10], '...')

    def readPipe(self):
        fd = os.open(self.jsPipe, os.O_RDWR)
        x = os.read(fd, self.MAX_READING_PIPE).decode().split('|')
        # print('read:', x)
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

        start = time.time()
        res = self.data.query(qStr)
        end = time.time()
        print('WMD: ', end - start)

        # bm25 = BM25(qStr, res)
        # res = bm25.queryBM25()
        self.advancedModel.loadData(res)
        res = self.advancedModel.query(qStr)
        # get list of name from res[:5]
        # print(res)
        # top5 = res[:5]
        top5 = [i['description']['name'] for i in res[:10]]

        # print(id, ':', str(res))
        self.writePipe(id + ' ' + json.dumps(top5))


        print('query processed:', qStr)
        time.sleep(60)
        print('sleep done')

        os._exit(0)

    def loadDataFromServer(self):
        # blocking until data is loaded
        # hacky code, probably can be improved
        data = ''
        while True:
            if os.path.exists(self.jsPipe):
                temp = self.readPipe()
                data += temp[0]
                if len(temp) > 1:
                    break
        print('Received data')
        self.data.loadData(data)

    def run(self):
        self.loadDataFromServer()
        # print(self.data.data[0])
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