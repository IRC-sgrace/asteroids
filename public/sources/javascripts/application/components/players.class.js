( function()
{
    'use strict';

    B.Components.Players = B.Core.Abstract.extend( {

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
            this.socket.io.on( 'players_add', function( data )
            {
                // Add player
                that.add( data );
            } );

            // Socket update event
            this.socket.io.on( 'players_remove', function( id )
            {
                // World update
                that.remove( id );
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
            var player = new B.Components.Player( {
                id       : options.id,
                x        : options.x,
                y        : options.y,
                rotation : options.r
            } );

            // Add to container
            this.container.addChild( player.container );

            // Add to players
            this.all[ player.id ] = player;
        },

        /**
         * Remove
         */
        remove : function( player_id )
        {
            // Set up
            var player = this.all[ player_id ];

            // Player not found
            if( typeof player === 'undefined' )
                return;

            // Remove from container
            this.container.removeChild( player.container );

            // Destruct
            player.destruct();

            // Remove from players
            delete this.all[ player.id ];
        },

        /**
         * Update
         */
        update : function( data )
        {
            // Each update player
            for( var _player_data of data )
            {
                // Set up
                var _player = this.all[ _player_data.id ];

                // Player doesn't exist
                if( typeof this.all[ _player_data.id ] !== 'undefined' )
                {
                    // Update player
                    _player.update( _player_data );
                }
                else
                {
                    // Update player
                    this.add( _player_data );
                }
            }
        },

        /**
         * Destruct
         */
        destruct : function()
        {
            // Destruct
            for( var _player_id in this.all )
                this.remove( _player_id );

            // Empty container
            this.container.removeChildren();

            // Off
            this.socket.io.off( 'players_add' );
            this.socket.io.off( 'players_remove' );

            // Go null
            this.utils.null_object( this );
        }
    } );
} )();
