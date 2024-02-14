from lxml import etree
import os

html = """
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <title>Mapa de Ruas</title>
    <meta charset="utf-8">
</head>
<body>
<h1>Mapa de Ruas</h1>
<ul>
"""

if not os.path.exists("html"):
    os.mkdir("html")

xml_dir = os.path.join("MapaRuas-materialBase", "texto")

listaDeRuas=[]
for xmlFile in os.listdir(xml_dir):
    xml_path = os.path.join(xml_dir, xmlFile)
        
    # Abrir e validar o ficheiro XML usando o XSD
    xsd_path = os.path.join("MapaRuas-materialBase", "MRB-rua.xsd")
    with open(xsd_path, "r") as xsd_file:
        schema = etree.XMLSchema(etree.parse(xsd_file))
    parser = etree.XMLParser(schema=schema)
    tree = etree.parse(xml_path, parser)   

    # Obter o nome da rua do elemento <nome> dentro de <meta>
    meta = tree.find(".//meta")
    num = meta.find("número").text
    nome_rua = meta.find("nome").text

    listaDeRuas.append(f"Rua{num}-{nome_rua}")
    template = f"""<!DOCTYPE html>
<html lang="pt-PT">
<head>
<title>Rua {num}: {nome_rua}</title>
<meta charset="utf-8">
</head>
<body>
"""
    html_rua = template
    
    html_rua += f"<h1>Rua {num}: {nome_rua}</h1>\n\n"
    
    
    html_rua += "<h2>Imagens</h2>\n"
    
    figuras = tree.findall(".//figura")
    for figura in figuras:
        img_path=figura.find("imagem").get("path")
        legenda = figura.find("legenda").text
        img_path = img_path.replace("../", "../MapaRuas-materialBase/")
        html_rua +='<div style="text-align: center;">\n'
        html_rua += f'  <img src="{img_path}" alt="{legenda}" style="max-width: 50%;">\n'
        html_rua +=f'    <div style="margin-top: 5px;">{legenda}</div>\n'
        html_rua +=f'</div>\n'
        
    
    
    html_rua += "\n<h2>Imagens Atual</h2>\n"
    imagem_path="MapaRuas-materialBase/atual"
    
    arquivo_imagens= os.listdir(imagem_path)
    
    imagens_rua=[imagem for imagem in arquivo_imagens if imagem.startswith(f'{num}-')]
    
    for imagem in imagens_rua:
        img_path= os.path.join(imagem_path,imagem)
        img_path = img_path.replace("MapaRuas-materialBase/", "../MapaRuas-materialBase/")
        html_rua +='<div style="text-align: center;">\n'
        html_rua += f'  <img src="{img_path}" style="max-width: 50%;">\n'
        html_rua +=f'</div>\n' 
    
    
    html_rua += "\n<h2>Parágrafos</h2>\n"
    
    
    for para in tree.findall(".//para"):
        
        if para.getparent().tag == "desc" and para.getparent().getparent().tag == "casa":
            continue  # Ignora o parágrafo
        content = ""
        for element in para.iter():
            if element.tag in {"lugar", "data", "entidade", "para", "número", "enfiteuta", "foro", "desc", "figura", "imagem", "legenda", "meta", "corpo", "nome", "prazo", "confronto", "dono", "descricao"}:
                content += f"{element.text}" if element.text else ""  # Adiciona texto antes do lugar
            elif element.text:  # Adiciona texto do parágrafo
                content += element.text
            if element.tail:  # Adiciona texto após o elemento
                content += element.tail
        # Adiciona o conteúdo do parágrafo ao HTML
        html_rua += f"<p>{content}</p>"

    
    # Adicionar lista de casas
    html_rua += "\n\n<h2>Lista de Casas</h2>\n"
    html_rua += "\n\n<ul>"
    
    for casa in tree.findall(".//lista-casas/casa"):
        numero_element = casa.find("número")
        numero = numero_element.text if numero_element is not None else "N/A"
        
        enfiteuta_element = casa.find("enfiteuta")
        enfiteuta = enfiteuta_element.text if enfiteuta_element is not None else "N/A"
        
        foro_element = casa.find("foro")
        foro = foro_element.text if foro_element is not None else "N/A"
        
        
            
        html_rua += f"\n\n<h3>Casa {numero}</h3>\n\n"
        
        html_rua += f"  <li>Enfiteuta: {enfiteuta}</li>\n   <li>Foro: {foro}</li>\n"
        
        desc_element = casa.find("desc")
        
        if desc_element is not None:
            desc_content = "" 
            for para2 in desc_element.findall(".//para"):
                para2_content = ""
                for element in para2.iter():
                    if element.tag in {"lugar", "data", "entidade", "para", "número", "enfiteuta", "foro", "desc", "figura", "imagem", "legenda", "meta", "corpo", "nome", "prazo", "confronto", "dono", "descricao"}:
                        para2_content += f"{element.text}" if element.text else ""  # Adiciona texto antes do lugar
                    elif element.text:  # Adiciona texto do parágrafo
                        para2_content += element.text
                    if element.tail:  # Adiciona texto após o elemento
                        para2_content += element.tail
                
                desc_content += f"<p>{para2_content}</p>"
            # Adiciona o conteúdo do parágrafo ao HTML
            html_rua += f"  <li>Descrição: {desc_content}</li>\n"
        
        
    html_rua += "\n\n</ul>\n\n"  
    html_rua+= '<h6><a href="../mapa_de_ruas.html">Voltar</a></h6>\n'
    html_rua += "</body>\n"   
    html_rua += "</html>\n"

    # Escrever para um ficheiro HTML
    html_rua_file = os.path.join("html", f"Rua{num}-{nome_rua}.html")
    with open(html_rua_file, "w") as f:
        f.write(html_rua)

listaDeRuas=sorted(listaDeRuas, key=lambda x: int (x.split("-")[0][3:]))

for elem in listaDeRuas:
    # Itemize
    html += f'<li><a href="html/{elem}.html">{elem}</a></li>\n'

html += """
</ul>
</body>
</html>
"""
ficheiroHtml = open("mapa_de_ruas.html", "w", encoding="utf-8")
ficheiroHtml.write(html)
ficheiroHtml.close()