( function()
{
    'use strict';

    // Requires
    let socket_io = require( 'socket.io' );

    // Singleton
    let instance = null;

    /**
     * Socket class
     */
    class Socket
    {
        /**
         * Constructor
         */
        constructor( server )
        {
            // Singleton
            if( instance )
                return instance;
            else
                instance = this;

            // Setup
            this.io = socket_io.listen( server );
        }
    }

    // Export
    module.exports = Socket;

} )();
