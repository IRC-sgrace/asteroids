( function()
{
    'use strict';

    B.Components.Main_Player = B.Core.Abstract.extend( {

        /**
         * Construct
         */
        construct : function()
        {
            this._super();

            // Set up
            this.utils       = new B.Tools.Utils();
            this.keyboard    = new B.Tools.Keyboard();
            this.socket      = new B.Tools.Socket();
            this.container   = new PIXI.Container();
            this.inputs_down = {
                'up'    : false,
                'right' : false,
                'down'  : false,
                'left'  : false,
                'space' : false,
            };
            this.inputs_down_names = Object.keys( this.inputs_down );

            // Init inputs
            this.init_inputs();
        },

        /**
         * Init inputs
         */
        init_inputs : function()
        {
            var that = this;

            // Keyboard down event
            this.keyboard.on( 'down', function( code, name )
            {
                // Key not found
                if( that.inputs_down_names.indexOf( name ) === -1 )
                    return;

                // Already pressed
                if( that.inputs_down[ name ] )
                    return;

                // Set up
                var data = { action : 'start', name : name };
                that.inputs_down[ name ] = true;

                // Socket
                that.socket.send( 'input', data );
            } );

            // Keyboard down event
            this.keyboard.on( 'up', function( code, name )
            {
                // Key not found
                if( that.inputs_down_names.indexOf( name ) === -1 )
                    return;

                // Not yet pressed
                if( !that.inputs_down[ name ] )
                    return;

                // Set up
                var data = { action : 'end', name : name };
                that.inputs_down[ name ] = false;

                // Socket
                that.socket.send( 'input', data );
            } );
        },

        /**
         * Destruct
         */
        destruct : function()
        {
            // Off
            this.keyboard.off( 'down' );
            this.keyboard.off( 'up' );

            // Go null
            this.utils.null_object( this );
        }
    } );
} )();
