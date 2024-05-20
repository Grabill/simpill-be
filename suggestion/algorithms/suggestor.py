from abc import ABC, abstractmethod

class Suggestor(ABC):
    @abstractmethod
    def query(self, query: str) -> list:
        pass

    @abstractmethod
    def loadData(self, data: list) -> None:
        pass