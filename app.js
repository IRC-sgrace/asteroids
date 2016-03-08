// Requires
var express        = require( 'express' ),
    http           = require( 'http' ),
    socket_io      = require( 'socket.io' ),
    path           = require( 'path' ),
    colors         = require( 'colors' ),
    Asteroids      = require( './requires/game/asteroids.class.js' ),
    get_network_ip = require( './requires/tools/get_network_ip.js' );

// Set up
var app    = express(),
    server = http.createServer( app );

// Static
app.use( express.static( path.join( __dirname, 'public' ) ) );

// Routes
app.get( '/', function( request, response )
{
    response.send( 'pwet' );
} );

// Server
server.listen( 3000, function()
{
    console.log( colors.green( '---------------------------' ) );
    console.log( 'server'.green.bold + ' - ' + 'started'.cyan );
    console.log( 'server'.green.bold + ' - ' + ( 'http://' + get_network_ip() + ':3000' ).cyan );

    var game = new Asteroids( { server : server } );
} );
