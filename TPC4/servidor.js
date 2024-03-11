var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var compositoresServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if(req.url == '/'){
                    res.writeHead(200,{"Content-Type": "text/html"})
                    res.write(templates.paginaPrincipal(d))
                    res.end()
                }
                
                else if (req.url == '/compositores'){
                    axios.get("http://localhost:3000/compositores")
                        .then(resp=>{
                            var compositores = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.compositoresListPage(compositores,d))
                            res.end()
                        })
                        .catch(erro=>{
                            res.writeHead(501, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter a lista de compositores</p>')
                            res.write('<p>'+ erro +'</p>')
                            res.end()
                        })
                }

                else if (req.url == '/periodos'){
                    axios.get("http://localhost:3000/periodos")
                        .then(resp=>{
                            var periodos = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.periodosListPage(periodos,d))
                            res.end()
                        })
                        .catch(erro=>{
                            res.writeHead(501, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter a lista de periodos</p>')
                            res.write('<p>'+ erro +'</p>')
                            res.end()
                        })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/compositores\/C[0-9]+$/i.test(req.url)){
                    axios.get("http://localhost:3000"+req.url).then(response =>{
                        res.writeHead(200,{"Content-Type": "text/html"})
                        res.write(templates.compositorPage(response.data,d))
                        res.end()

                    }).catch(erro=>{
                        res.writeHead(501, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write('<p>/compositores/:id</p>')
                        res.write('<p>'+ erro +'</p>')
                        res.end()
                    })

                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/periodos\/P[0-9]+$/i.test(req.url)){
                    axios.get("http://localhost:3000"+req.url).then(response =>{
                        res.writeHead(200,{"Content-Type": "text/html"})
                        res.write(templates.periodoPage(response.data,d))
                        res.end()

                    }).catch(erro=>{
                        res.writeHead(501, {'Content-Type' : 'text/html; charset=utf-8'})
                        res.write('<p>/periodos/:id</p>')
                        res.write('<p>'+ erro +'</p>')
                        res.end()
                    })

                }
                else if(req.url== "/compositores/registo"){
                    res.writeHead(200,{"Content-Type": "text/html"})
                    res.write(templates.compositorFormPage(d))
                    res.end()
                }
                // GET /periodos/registo --------------------------------------------------------------------
                else if(req.url== "/periodos/registo"){
                    res.writeHead(200,{"Content-Type": "text/html"})
                    res.write(templates.periodoFormPage(d))
                    res.end()
                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/C\d+/.test(req.url)){
                    var partes= req.url.split('/')
                    var idCompositor= partes[partes.length-1]
                    axios.get("http://localhost:3000/compositores/"+ idCompositor)
                        .then(response =>{
                            res.writeHead(200,{"Content-Type": "text/html"})
                            res.write(templates.compositorFormEditPage(response.data,d))
                            res.end()
                        })
                        .catch(erro=>{
                            res.writeHead(505, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter o registo do compositor</p>')
                            res.write('<p>'+ erro +'</p>')
                            res.end()
                        })
                }

                // GET /periodos/edit/:id --------------------------------------------------------------------
                else if(/\/periodos\/edit\/P\d+/.test(req.url)){
                    var partes= req.url.split('/')
                    var idCompositor= partes[partes.length-1]
                    axios.get("http://localhost:3000/periodos/"+ idCompositor)
                        .then(response =>{
                            res.writeHead(200,{"Content-Type": "text/html"})
                            res.write(templates.periodoFormEditPage(response.data,d))
                            res.end()
                        })
                        .catch(erro=>{
                            res.writeHead(505, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter o registo do periodo</p>')
                            res.write('<p>'+ erro +'</p>')
                            res.end()
                        })
                }
                // GET /alunos/delete/:id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/C[0-9]+$/i.test(req.url)){
                    var partes= req.url.split('/')
                    var idCompositor= partes[partes.length-1]
                    axios.delete("http://localhost:3000/compositores/"+idCompositor).then(response =>{
                        res.writeHead(200,{"Content-Type": "text/html"})
                        res.end(templates.compositorPage(response.data,d))
                    })
                    .catch(erro => {
                        res.writeHead(521,{"Content-Type": "text/html"})
                        res.write(templates.errorPage(erro,d))
                        res.end()
                    })
                    
                }

                else if(/\/periodos\/delete\/(.+)$/i.test(req.url)){
                    var partes= req.url.split('/')
                    var idPeriodo= partes[partes.length-1]
                    axios.delete("http://localhost:3000/periodos/"+idPeriodo).then(response =>{
                        res.writeHead(200,{"Content-Type": "text/html"})
                        res.end(templates.periodoPage(response.data,d))
                    })
                    .catch(erro => {
                        res.writeHead(521,{"Content-Type": "text/html"})
                        res.write(templates.errorPage(erro,d))
                        res.end()
                    })
                    
                }
                // GET ? -> Lancar um erro
                else{
                    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.write('<p>Método não suportdo:' + req.url + '</p>')
                    res.write('<p><a href="/">Return</a></p>')
                    res.end()
                }
                break
            case "POST":
                // POST /alunos/registo --------------------------------------------------------------------
                if (req.url== '/compositores/registo'){
                    collectRequestBodyData(req, result=>{
                        if(result){
                            axios.post("http://localhost:3000/compositores",result)
                                .then(resp=>{
                                    console.log(resp.data)
                                    res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.end("<p>Registo inserido"+ JSON.stringify(resp.data) + '</p>')
                                })
                                .catch(erro=>{
                                    res.writeHead(503, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.write('<p>Não foi possivel obter o compositor</p>')
                                    res.write('<p>'+ erro +'</p>')
                                    res.end()
                                })
                            
                        }else{
                            res.writeHead(502, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter os dados do body</p>')
                            res.end()
                        }
                    })
                }

                if (req.url== '/periodos/registo'){
                    collectRequestBodyData(req, result=>{
                        if(result){
                            axios.post("http://localhost:3000/periodos",result)
                                .then(resp=>{
                                    console.log(resp.data)
                                    res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.end("<p>Registo inserido"+ JSON.stringify(resp.data) + '</p>')
                                })
                                .catch(erro=>{
                                    res.writeHead(503, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.write('<p>Não foi possivel obter o periodo</p>')
                                    res.write('<p>'+ erro +'</p>')
                                    res.end()
                                })
                            
                        }else{
                            res.writeHead(502, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter os dados do body</p>')
                            res.end()
                        }
                    })
                }
                // POST /alunos/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/C[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result=>{
                        if(result){
                            axios.post("http://localhost:3000/compositores/",result.id,result)
                                .then(resp=>{
                                    console.log(resp.data)
                                    res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.end("<p>Compositor inserido"+ JSON.stringify(resp.data) + '</p>')
                                })
                                .catch(erro=>{
                                    res.writeHead(503, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.write('<p>Não foi possivel atualizar o compositor</p>')
                                    res.write('<p>'+ erro +'</p>')
                                    res.end()
                                })
                            
                        }else{
                            res.writeHead(506, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter os dados do body</p>')
                            res.end()
                        }
                    })
                }

                else if(/\/periodos\/edit\/P[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result=>{
                        if(result){
                            axios.post("http://localhost:3000/periodos/",result.id,result)
                                .then(resp=>{
                                    console.log(resp.data)
                                    res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.end("<p>Periodo inserido"+ JSON.stringify(resp.data) + '</p>')
                                })
                                .catch(erro=>{
                                    res.writeHead(503, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.write('<p>Não foi possivel atualizar o periodo</p>')
                                    res.write('<p>'+ erro +'</p>')
                                    res.end()
                                })
                            
                        }else{
                            res.writeHead(506, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possivel obter os dados do body</p>')
                            res.end()
                        }
                    })
                }
                // POST ? -> Lancar um erro
                else{
                    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.write('<p>Método não suportdo:' + req.url + '</p>')
                    res.write('<p><a href="/">Return</a></p>')
                    res.end()
                }
                break
            default: 
                // Outros metodos nao sao suportados
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                res.write('<p>Método não suportdo:' + req.method + '</p>')
                res.end()
                break
        }
    }
})

compositoresServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})



