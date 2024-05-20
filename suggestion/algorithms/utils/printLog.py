import logging

def printLog(s):
    FORMAT = "%(filename)s:%(lineno)s:%(funcName)s()- %(asctime)s %(levelname)s %(name)s\t %(message)s"
    logging.basicConfig(level=logging.INFO, format=FORMAT)
    logger = logging.getLogger()

    # logger.addHandler(logging.FileHandler('test.log', 'a'))
    logger.setLevel(logging.DEBUG)
    logger.info(s)
