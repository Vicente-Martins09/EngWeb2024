import json

def carregamento():
    with open ("filmes.json",'r') as f:
        dados = [json.loads(line) for line in f]
    return dados


def transformar_Dados(dados):
    filmes=[]
    generos=[]
    atores=[]
    
    for item in dados:
        filme={
            "id":item["_id"]["$oid"],
            "title": item["title"],
            "year": item["year"],
            "cast": item.get("cast",[]),
            "genres": item.get("genres",[])
        }
        filmes.append(filme)
        
        for genero in item.get("genres",[]):
            genero_existente = next((g for g in generos if g["name"]==genero),None)
            if not genero_existente:
                genero_existente= {"id": "g" + str(len(generos) + 1), "name": genero, "filmes": []}
                generos.append(genero_existente)
            genero_existente["filmes"].append(item["title"])
        
        for ator in item.get("cast", []):
            ator_existente = next((a for a in atores if a["name"]==ator),None)
            if not ator_existente:
                ator_existente = {"id": len(atores) + 1, "name": ator, "filmes": []}
                atores.append(ator_existente)
            ator_existente["filmes"].append(item["title"])
              
    return {"filmes": filmes,"generos": generos, "atores":atores}
    

dados= carregamento()

dados_transformados = transformar_Dados(dados)

with open('filmes_transformados.json', 'w') as arquivo:
    json.dump(dados_transformados, arquivo, indent=2)
    
