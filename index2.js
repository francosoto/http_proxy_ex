var http = require('http')
,   url  = require('url')

http.createServer(onRequest).listen(3000)

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url)
  let urlparse = url.parse(client_req.url)
  // console.log(urlparse)
  urlparse = urlparse.path.slice(1, urlparse.length)
  console.log('URL', 'http://' + urlparse)

  let urlProxy = url.parse(urlparse)
  
  var options = {
    hostname: urlparse,
    port: 80,
    path: '/',
    method: client_req.method,
    headers: client_req.headers
  }

  var proxy = http.request(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers)

    res.on('data', function (data) {
      body = Buffer.from(data)
      body = body.toString()
      console.log(body)
      client_res.write(body)
    })

    res.pipe(client_res, {
      end: true
    })
  })

  client_req.pipe(proxy, {
    end: true
  })
}