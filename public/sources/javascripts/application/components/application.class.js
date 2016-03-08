( function()
{
    'use strict';

    B.Components.Application = B.Core.Abstract.extend( {

        /**
         * Construct
         */
        construct : function()
        {
            this._super();

            // Set up
            this.stage  = new B.Tools.Stage();

            // Init
            this.init_socket();
        },

        /**
         * Init socket
         */
        init_socket : function()
        {
            var that = this;

            // Set up
            this.socket = new B.Tools.Socket();

            // Socket connect event
            this.socket.on( 'connect', function()
            {

            } );

            // Socket start event
            this.socket.io.on( 'start', function( data )
            {
                // Destruct if exist
                if( that.world )
                    that.world.destruct();

                // Construct
                that.world = new B.Components.World( data );
            } );

            // Socket update event
            this.socket.io.on( 'global_update', function( data )
            {
                // World update
                that.world.update( data );
            } );
        }
    } );
} )();
