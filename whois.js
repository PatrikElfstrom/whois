var connect = require('connect');
var http = require('http');
 
var app = connect();

app.use(function(req, res){
    var domain = '',
        url = req.url,
        match = url.match(/\?domain=(.*)$/);

    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

    if( Array.isArray(match) && typeof (domain = match[1]) === "string" && domain.length > 0) {
        domain = decodeURIComponent(domain);

        whois( domain, function( result ) {
            res.write( result );
        }, function() {
            res.end();
        });

    } else {
        res.end('Usage: ?domain=example.com');
    }

});

function whois( domain, cb_data, cb_close  ) {
    const spawn = require('child_process').spawn;
    const whois = spawn('whois', [domain]);

    whois.stdout.on('data', ( data ) => {
        cb_data( data );
    });

    whois.on('close', (code) => {
        cb_close( code );
    });
}

http.createServer(app).listen(8010);