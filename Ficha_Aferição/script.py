import json
import requests

def post_data(url, data):
    response = requests.post(url, json=data)
    if (response.status_code==200):
        print("Sucesso!")
    else:
        print("Erro ao carregar os dados:", response.text)
        
        
arquivos = ["dataset-extra1.json", "dataset-extra2.json", "dataset-extra3.json"]

for arquivo in arquivos:
    with open(arquivo, "r") as f:
        dataset = json.load(f)
        pessoas = dataset['pessoas']
        
        api_url = "http://localhost:3000/pessoas"
        
        for pessoa in pessoas:
            post_data(api_url, pessoa)