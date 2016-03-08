( function()
{
    'use strict';

    // Requires
    let Event_Emitter = require( './event_emitter.class' ),
        Socket        = require( './socket.class' ),
        Ticker        = require( './ticker.class' );

    // Singleton
    let instance = null;

    /**
     * Data class
     */
    class Data extends Event_Emitter
    {
        /**
         * Constructor
         */
        constructor( options )
        {
            super( options );

            // Singleton
            if( instance )
                return instance;
            else
                instance = this;

            // Set up
            this.socket  = new Socket( options.server );
            this.pending = {};

            // Init
            this.init_connections();
            this.init_ticker();
        }

        /**
         * init connections
         */
        init_connections()
        {
            // Set up
            this.connections = {};

            // Socket connection event
            this.socket.io.on( 'connection', ( socket ) =>
            {
                // Set up
                this.connections[ socket.id ] = socket;

                // Socket disconnect event
                socket.on( 'disconnect', () =>
                {
                    // Trigger
                    this.trigger( 'disconnection', [ socket ] );

                    console.log( 'socket'.green.bold + ' - ' + 'disconnection'.cyan + ' - ' + socket.id.cyan );
                } );

                // Trigger
                this.trigger( 'connection', [ socket ] );

                console.log( 'socket'.green.bold + ' - ' + 'connection'.cyan + ' - ' + socket.id.cyan );
            } );
        }

        /**
         * Init ticker
         */
        init_ticker()
        {
            // Set up
            this.ticker = new Ticker();

            // Ticker tick event
            this.ticker.on( 'tick', () =>
            {
                // Send pending
                this.send_pendings();
            } );
        }

        /**
         * Add to pending
         */
        add_to_pending( key, data )
        {
            // No key or no data
            if( !key || !data )
                return false;

            // Add to pending
            this.pending[ key ] = data;
        }

        /**
         * Send pendings
         */
        send_pendings()
        {
            // Set up
            let keys = Object.keys( this.pending ),
                data = {};

            // No data
            if( !keys.length )
                return false;

            // Each pending
            for( let _key of keys )
            {
                // Add to data
                data[ _key ] = this.pending[ _key ];

                // Delete from pending
                delete this.pending[ _key ];
            }

            // Emit
            this.socket.io.emit( 'global_update', data );
        }

        /**
         * Listen
         */
        listen( key, callback )
        {
            // Socket event
            this.socket.io.on( key, ( data ) =>
            {
                callback.apply( this, [ data ] );
            } );
        }

        /**
         * Emit
         */
        emit( key, data, socket_id )
        {
            // No socket id
            if( typeof socket_id === 'undefined' )
            {
                this.socket.io.emit( key, data );
            }

            // Socket id
            else
            {
                // Set up
                var socket = this.connections[ socket_id ];

                if( socket )
                    socket.emit( key, data );
            }
        }
    }

    // Export
    module.exports = Data;

} )();
