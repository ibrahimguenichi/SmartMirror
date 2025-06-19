import requests

def send_embedding(userId: int, embedding: list, url):
    print("Sending to : ", url)
    response = requests.post(url, json={
        "userId": userId,
        "embedding": embedding
    })
    print("request sent to springboot")

    # return response.json()

def send_embedding_without_user(embedding: list, url):
    print("Sending to : ", url)
    response = requests.post(url, json={
        "embedding": embedding
    })
    print("request sent to springboot")

    # return response.json()
