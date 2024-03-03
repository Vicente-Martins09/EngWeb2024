var http= require('http');
var url =  require('url');
var fs = require('fs')
var axios= require('axios');

http.createServer((req,res)=>{
    console.log(req.method + " " + req.url)
    var q = url.parse(req.url,true)
    if(q.pathname == "/"){
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})

        res.write(`
            <ul>
                <li><a href="/filmes">filmes</a></li>
                <li><a href="/generos">generos</a></li>
                <li><a href="/atores">atores</a></li>
            </ul>
        `);
        res.end()
    }else if(q.pathname == "/filmes"){
        axios.get("http://localhost:3000/filmes?_sort=title")
            .then((resp)=>{
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})

                let lista = resp.data
                res.write("<ul>")
                for (i in lista){
                    res.write("<li><a href='/filmes/"+ lista[i].id + "'>" + lista[i].title +"</a></li>")
                }
                res.write("</ul>")
                res.write ("<h6><a href='/especies'>Voltar</a></h6>")
                res.end()
            }).catch( erro =>{
                console.log("Erro: " + erro);
            })
    }else if(q.pathname == "/generos"){
        axios.get("http://localhost:3000/generos?_sort=name")
            .then((resp)=>{
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})

                let lista = resp.data
                res.write("<ul>")
                for (i in lista){
                    res.write("<li><a href='/generos/"+ lista[i].id + "'>" + lista[i].name +"</a></li>")
                }
                res.write("</ul>")
                res.write ("<h6><a href='/'>Voltar</a></h6>")
                res.end()
            }).catch( erro =>{
                console.log("Erro: " + erro);
            })
    }else if(q.pathname == "/atores"){
        axios.get("http://localhost:3000/atores?_sort=name")
            .then((resp)=>{
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})

                let lista = resp.data
                res.write("<ul>")
                for (i in lista){
                    res.write("<li><a href='/atores/"+ lista[i].id + "'>" + lista[i].name +"</a></li>")
                }
                res.write("</ul>")
                res.write ("<h6><a href='/'>Voltar</a></h6>")
                res.end()
            }).catch( erro =>{
                console.log("Erro: " + erro);
            })
    }else if(q.pathname.startsWith("/filmes/")){
        let nome = q.pathname.substring(8)
        //console.log("Caminho da URL:", q.pathname);
        Promise.all([
            axios.get("http://localhost:3000/filmes?id="+nome),
            axios.get("http://localhost:3000/generos"),
            axios.get("http://localhost:3000/atores")
        ])
            .then((resp)=>{
                let filme = resp[0].data[0];
                let generos= resp[1].data
                let atores= resp[2].data
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`<h1>${filme.title}</h1>`);
                res.write(`<p>Ano: ${filme.year}</p>`);
                res.write(`<h2>Géneros:</h2>`);
                res.write("<ul>");
                filme.genres.forEach(genero => {
                    let generoEncontrado= generos.find(g=>g.name===genero)
                    if (generoEncontrado){
                        res.write("<li><a href='/generos/" +  generoEncontrado.id + "'>" + generoEncontrado.name + "</a></li>")
                    }
                });
                res.write("</ul>");
                res.write(`<h2>Atores:</h2>`);
                res.write("<ul>");
                filme.cast.forEach(ator => {
                    let atorEncontrado= atores.find(a=>a.name===ator)
                    if (atorEncontrado){
                        res.write("<li><a href='/generos/" +  atorEncontrado.id + "'>" + atorEncontrado.name + "</a></li>")
                    }
                });
                res.write("</ul>");
                res.write("<h6><a href='/filmes'>Voltar</a></h6>");
                res.end();
            }).catch( erro =>{
                console.log("Erro: " + erro);
            })
    }else if (q.pathname.startsWith("/generos/")) {
        let idGenero = q.pathname.substring(9);
        //console.log("Caminho da URL:", q.pathname);
        Promise.all([
            axios.get("http://localhost:3000/generos?id=" + idGenero),
            axios.get("http://localhost:3000/filmes")
        ])
            .then((resp) => {
                let genero = resp[0].data[0]; // Assume que o ID do gênero é único e só haverá um resultado
                let date = resp[1].data;
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`<h1>Filmes do Gênero ${genero.name}</h1>`);
                res.write("<ul>");
                genero.filmes.forEach(filme => {
                    let filmeEncontrado= date.find(f=>f.title===filme)
                    if (filmeEncontrado){
                        res.write("<li><a href='/filmes/" +  filmeEncontrado.id + "'>" + filmeEncontrado.title + "</a></li>")
                    }
                });
                res.write("</ul>");
                res.write("<h6><a href='/'>Voltar</a></h6>");
                res.end();
            }).catch(erro => {
                console.log("Erro: " + erro);
            })
    }
    else if (q.pathname.startsWith("/atores/")) {
        let idAtor = q.pathname.substring(8); 
        //console.log("Caminho da URL:", q.pathname);
        Promise.all([
            axios.get("http://localhost:3000/atores?id=" + idAtor),
            axios.get("http://localhost:3000/filmes")
        ])
            .then((resp) => {
                let ator = resp[0].data[0];
                let date = resp[1].data;
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`<h1>Filmes com o Ator ${ator.name}</h1>`);
                res.write("<ul>");
                ator.filmes.forEach(filme => {
                    let filmeEncontrado= date.find(f=>f.title===filme)
                    if (filmeEncontrado){
                        res.write("<li><a href='/filmes/" +  filmeEncontrado.id + "'>" + filmeEncontrado.title + "</a></li>")
                    }
                });
                res.write("</ul>");
                res.write("<h6><a href='/'>Voltar</a></h6>");
                res.end();
            }).catch(erro => {
                console.log("Erro: " + erro);
            })
    }
    else if(q.pathname=='/w3.css'){
        fs.readFile('w3.css', (erro,dados)=>{
            res.writeHead(200, {'Content-Type' : 'text/css'})
            res.write(dados)
            res.end()
        })
    }else{
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write("Operação não suportada")
        res.end()
    }

}).listen(7777);

console.log("servidor à escuta");