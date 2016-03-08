var os = require( 'os' );

module.exports = function()
{
    // Set up
    var interfaces = os.networkInterfaces(),
        ips        = [];

    // Each interface
    for( var _interface_name in interfaces )
    {
        // Set up
        var _interface = interfaces[ _interface_name ];

        _interface.forEach( function( iface )
        {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            if( 'IPv4' !== iface.family || iface.internal !== false )
                return;

            // Save in IPs
            ips.push( iface.address );
        } );
    }

    return ips.length > 1 ? ips : ips[ 0 ];
};
