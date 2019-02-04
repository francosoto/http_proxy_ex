const http = require('http')
,	https = require('https')
,   url = require('url')
,	httpProxy = require('http-proxy')

// var server = restify.createServer()
// var proxy = httpProxy.createProxyServer({}) 
var proxy = httpProxy.createServer({}) 
var server = http.createServer((req, res) => {
	let urlparse = url.parse(req.url)
	// console.log(urlparse)
	urlparse = urlparse.path.slice(1, urlparse.length)
	console.log('URL', 'http://' + urlparse)
	// let urlproxy = req.url
	proxy.web(req, res, { target: 'http://' + urlparse, selfHandleResponse: true })
})

// server.on('connect', (req, res, data) => {
// 	console.log(req, res, data)
// })

proxy.on('error', function(e, req, res) {
	res.writeHead(500, {
		'Content-Type': 'text/plain'
	})

	res.end('Something went wrong. And we are reporting a custom error message.');
})

proxy.on('proxyReq', function (proxyReq, req, res) {
	// console.log(proxyReq)
	// let urlparse = url.parse(req.url)
	// console.log(urlparse)
	// urlparse = urlparse.path.slice(1, urlparse.length)
	// proxyReq.setHeader('Host', urlparse)
	proxyReq.setHeader('Connection', 'keep-alive')
})

proxy.on('proxyRes', function (proxyRes, req, res) {
	var headers = proxyRes.headers

	proxyRes.on('data', function (data) {
		body = Buffer.from([body, data])
	})

	proxyRes.on('end', function () {
		body = body.toString()
		var patt = new RegExp("script")
		var bodyFiltered = patt.exec(body)
		console.log(bodyFiltered, headers)
		res.writeHead(proxyRes.statusCode, {
			'X-Proxy-Header': 'Someproxy'
		})

		res.end(body)
	})
})

server.listen(8080, function() {
	// console.log(server)
	console.log('This works and are listening at the port %s', server.port)
});