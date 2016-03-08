( function()
{
    'use strict';

    B.Tools.Socket = B.Core.Event_Emitter.extend( {

        static  : 'socket',
        options :
        {
            auto_connect   : true,
            messages_names : [ 'message' ]
        },

        /**
         * CONSTRUCT
         */
        construct : function( options )
        {
            this._super( options );

            // Set up
            this.connected = false;

            // Init
            if( this.options.auto_connect )
                this.connect();
        },

        /**
         * SEND
         */
        send : function( name, data )
        {
            var that = this;

            // Not connected
            if( !this.connected )
            {
                this.trigger( 'error', [ 'Cannot send. Not connected.' ] );
                return;
            }

            // Default data
            if( typeof data === 'undefined' )
                data = {};

            // Trigger
            this.trigger( 'send', [ name, data ] );

            // Emmit
            this.io.emit( name, data );

            // Trigger
            this.trigger( 'sent', [ name, data ] );
        },

        /**
         * CONNECT
         */
        connect : function()
        {
            var that = this;

            // Set up
            this.io = io.connect(  );

            // Connect event
            this.io.on( 'connect', function()
            {
                // Set up
                that.connected = true;

                // Trigger
                that.trigger( 'connect' );
            } );

            // Each message name
            for( var i = 0; i < this.options.messages_names.length; i++ )
            {
                // Scope
                ( function( message_name )
                {
                    // Receive message event
                    that.io.on( message_name, function( data )
                    {
                        // Trigger
                        that.trigger( message_name, [ data, message_name ] );
                        that.trigger( 'message', [ data, message_name ] );
                    } );
                } )( this.options.messages_names[ i ] );
            }
        }
    } );
} )();
