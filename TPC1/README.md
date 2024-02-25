# EngWeb2024
**Nome:** Vicente Martins

**Número:** A100713

**Email:** a100713@alunos.uminho.pt

## Objetivos

Vamos fazer uma pagina html com um indice com as ruas presentes no zip que o stor deu, sendo que cada rua possui um link para outra pagina html onde tem informacoes sobre a mesma. As informacoes sao obtidas atraves da leitura dos ficheiros .xml de cada rua.

## Resolução

Nesta resolução, desenvolvemos um script em Python para gerar páginas HTML a partir de dados contidos em arquivos XML. Aqui está um resumo das etapas realizadas:

1. **Preparação do Ambiente:**
   - Importamos os módulos necessários, incluindo etree do lxml para processamento XML e os para operações de sistema.

2. **Criação da Estrutura HTML:**
   - Inicializamos o HTML com as tags necessárias, como `<!DOCTYPE html>`, `<html>`, `<head>` e `<body>`, e adicionamos um título e metadados.

3. **Leitura dos Arquivos XML:**
   - Iteramos sobre os arquivos XML no diretório fornecido.
   - Abrimos e validamos cada arquivo XML usando um esquema XSD correspondente.

4. **Extração de Dados:**
   - Extraímos informações importantes de cada arquivo XML, como o número e nome da rua, imagens, parágrafos e informações sobre casas.

5. **Geração de HTML Dinâmico:**
   - Com base nos dados extraídos, criamos conteúdo HTML dinâmico para cada rua, incluindo imagens, parágrafos e informações sobre casas.

6. **Escrita de Arquivos HTML:**
   - Escrevemos o conteúdo HTML gerado em arquivos individuais dentro do diretório "html".

7. **Criação do Índice de Ruas:**
   - Geramos uma lista de ruas com links para suas respectivas páginas HTML.

8. **Conclusão:**
   - Encerramos o HTML com as tags de fechamento apropriadas.

Essa abordagem nos permitiu criar uma página HTML com um índice de ruas, fornecendo informações detalhadas sobre cada rua, conforme especificado nos arquivos XML fornecidos.
