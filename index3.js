var http = require('http'),
  cheerio = require('cheerio'),
  httpProxy = require('http-proxy'),
  url = require('url'),
  zlib = require('zlib')

var proxy = httpProxy.createProxyServer()

app = (req, res) => {
  console.log("proxy: web", req.headers)
  var gzip = zlib.Gzip()
  var _write = res.write  
  var _end = res.end

  gzip.on('data', (buf) => {
    // console.log("gzip: data")
    _write.call(res, buf);
  }) 

  gzip.on('end', () => {
    // console.log("gzip: end")
    _end.call(res);
  })
  
  res.write = (data) => {
    // console.log("wrapper: write")
    gzip.write(data);
  } 
  
  res.end = () => {
    // console.log("wrapper: end")
    gzip.end();
  }

  // let urlparse = url.parse(req.headers.host)
  let urlparse = '207.7.95.223'
  // urlparse = urlparse.path.slice(4, urlparse.length)
  urlparse = urlparse ? urlparse : 'localhost:9000'
  console.log(urlparse)

  proxy.web(req, res, { target: 'http://' + urlparse, selfHandleResponse: true });
}

proxy.on('proxyRes', (proxyRes, req, res) => {
  var headers = proxyRes.headers
  var body = ''

  proxyRes.on('data', (data) => {
    // console.log("proxy: data")
    bodya = Buffer.from(data)
    body = bodya.toString()
    $ = cheerio.load(body)
    $('.c').html('pepito')
  })

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Encoding', 'gzip')
  res.writeHead(res.statusCode, headers)

  proxyRes.on('end', () => {
    // console.log("proxy: end")
    res.write($.html())
    res.end()
  })
})

http.createServer(app).listen(8000);

// Server de prueba medio vago...
http.createServer((req, res) => {
  // Add Content-Encoding header
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write('<html><head></head><body><div class="a">Nodejitsu Http Proxy</div><div class="b">&amp; Frames</div><div class="c">Content-Encoding: gzip</div></body></html>');
  res.end();
}).listen(9000);
