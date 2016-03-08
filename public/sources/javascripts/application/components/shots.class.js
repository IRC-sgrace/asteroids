( function()
{
    'use strict';

    B.Components.Shots = B.Core.Abstract.extend( {

        /**
         * Construct
         */
        construct : function()
        {
            this._super();

            // Set up
            this.utils     = new B.Tools.Utils();
            this.container = new PIXI.Container();
            this.all       = {};

            // Init
            this.init_socket_events();
        },

        /**
         * Init socket events
         */
        init_socket_events : function()
        {
            var that = this;

            // Set up
            this.socket = new B.Tools.Socket();

            // Socket update event
            this.socket.io.on( 'shots_add', function( data )
            {
                // Add player
                that.add( data );
            } );

            // Socket update event
            this.socket.io.on( 'shots_remove', function( data )
            {
                // World update
                that.remove( data.id );
            } );
        },

        /**
         * Add
         */
        add : function( options )
        {
            // Already added
            if( typeof this.all[ options.id ] !== 'undefined' )
                return false;

            // Set up
            var shot = new B.Components.Shot( {
                id : options.id,
                x  : options.x,
                y  : options.y
            } );

            // Add to container
            this.container.addChild( shot.container );

            // Add to shots
            this.all[ shot.id ] = shot;
        },

        /**
         * Remove
         */
        remove : function( shot_id )
        {
            // Set up
            var shot = this.all[ shot_id ];

            // Shot not found
            if( typeof shot === 'undefined' )
                return;

            // Remove from container
            this.container.removeChild( shot.container );

            // Remove from shots
            delete this.all[ shot.id ];
        },

        /**
         * Update
         */
        update : function( data )
        {
            // Each update player
            for( var _shot_data of data )
            {
                // Set up
                var _shot = this.all[ _shot_data.id ];

                // Shot doesn't exist
                if( typeof this.all[ _shot_data.id ] !== 'undefined' )
                {
                    // Update shot
                    _shot.update( _shot_data );
                }
                else
                {
                    // Update shot
                    this.add( _shot_data );
                }
            }
        },

        /**
         * Destruct
         */
        destruct : function()
        {
            // Destruct
            for( var _shot_id in this.all )
                this.remove( _shot_id );

            // Empty container
            this.container.removeChildren();

            // Off
            this.socket.io.off( 'shots_add' );
            this.socket.io.off( 'shots_remove' );

            // Go null
            this.utils.null_object( this );
        }
    } );
} )();
