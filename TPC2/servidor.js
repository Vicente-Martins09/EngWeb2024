var http= require('http');
var url =  require('url');
var axios= require('axios');


http.createServer((req,res) =>{
    var q = url.parse(req.url, true)

    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})

    if(q.pathname === "/" || q.pathname === "/cidades"){
        // Lista cidades
        axios.get("http://localhost:3000/cidades?_sort=nome")
        .then( (resp) =>{
            let lista = resp.data
            res.write("<ul>")
            for(i in lista){
                res.write("<li><a href='/cidades/"+ lista[i].nome
                +"'>"  + lista[i].nome + "</a></li>")
            }
            res.write("</ul>")
            res.end()
        }).catch( erro =>{
            console.log("Erro: " + erro);
        })
    }else if (q.pathname.startsWith("/cidades/")) {
        const cidadeNome = q.pathname.substring(9);
            Promise.all([
                axios.get('http://localhost:3000/cidades?nome='+cidadeNome),
                axios.get('http://localhost:3000/ligacoes')
            ])
            .then((resp)=>{     
                const cidade = resp[0].data[0];
                const ligacoes = resp[1].data
               // const ligacoes = resp.data[1];
                if(cidade){
                    res.write('<h2>'+ cidade.nome +'</h2>');
                    res.write('<p>Id: '+ cidade.id);
                    res.write('<p>População: '+ cidade.população);
                    res.write('<p>Descrição: '+ cidade.descrição +  "</p>");
                    res.write('<p>Distrito: ' + cidade.distrito + '</p>');
                    res.write('<h3>Ligações:</h3><ul>')

                    for (ligacao of ligacoes){
                        if (ligacao.origem === cidade.id || ligacao.destino === cidade.id) {
                            const cidadeLigada = ligacao.origem === cidade.id ? ligacao.destino : ligacao.origem;
                            res.write("<li>" + cidadeLigada +'-' + ligacao.distância + " km</li>");
                        }
                    }
                    
                    res.write('</ul>')
                } else {
                    res.write("Cidade não encontrada.");
                }
            }).catch( erro =>{
                console.log("Erro: " + erro);
            })
    }else{
        res.write("Operação não suportada")
        res.end()
    }

}).listen(9999);

console.log("Servidor à escuta na porta 9999...");

