( function()
{
    'use strict';

    // Requires
    let Data          = require( './data.class' ),
        Event_Emitter = require( './event_emitter.class' ),
        Player        = require( './player.class' ),
        Ticker        = require( './ticker.class' );

    // Singleton
    let instance = null;

    /**
     * Players class
     */
    class Players extends Event_Emitter
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
            this.all   = {};
            this.count = 0;

            // Init
            this.init_data();
            this.init_ticker();
        }

        /**
         * Init data
         */
        init_data()
        {
            // Set up
            this.data = new Data();

            // Data connection event
            this.data.on( 'connection', ( socket ) =>
            {
                // Set up
                let options = {};
                options.id      = socket.id;
                options.socket  = socket;
                options.x       = Math.random() * 400;
                options.y       = Math.random() * 400;

                // Add
                this.add( options );
            } );

            // Data deconnection event
            this.data.on( 'disconnection', ( socket ) =>
            {
                // Remove
                this.remove( socket.id );
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
            this.ticker.on( 'tick', ( time ) =>
            {
                // Update
                this.update( time );
            } );
        }

        /**
         * Add
         */
        add( options )
        {
            // Set up
            let player = new Player( options );

            // Socket
            this.data.emit( 'players_add', player.get_data( true ) );

            // Update
            this.count++;

            // Add to players
            this.all[ player.id ] = player;

            // Trigger
            this.trigger( 'add', [ player ] );

            console.log( 'socket'.green.bold + ' - ' + 'players_add'.cyan + ' - ' + player.id.cyan );
        }

        /**
         * Remove
         */
        remove( player_id )
        {
            // Set up
            let player = this.get( player_id );

            // Shot not found
            if( !player )
                return false;

            // Add to players
            delete this.all[ player.id ];

            // Socket
            this.data.emit( 'players_remove', player.id );

            // Update
            this.count--;

            console.log( 'socket'.green.bold + ' - ' + 'players_remove'.cyan + ' - ' + player.id.cyan );
        }

        /**
         * Get
         */
        get( player_id )
        {
            return this.all[ player_id ] || false;
        }

        /**
         * Update
         */
        update( time )
        {
            // Loop through each player
            for( let _player_id in this.all )
            {
                // Set up
                let _player = this.all[ _player_id ];

                // Update
                _player.update( time );
            }

            // Add to data pending
            this.data.add_to_pending( 'players', this.get_data() );
        }

        /**
         * Get data
         */
        get_data( only_updated )
        {
            // Params
            if( typeof only_updated === 'undefined' )
                only_updated = true;

            // Set up
            let data = [];

            // Loop through each player
            for( let _player_id in this.all )
            {
                // Set up
                let _player = this.all[ _player_id ],
                    _data   = _player.get_data( only_updated );

                // If has data to send
                if( _data )
                    data.push( _data );
            }

            // No data to send
            if( data.length || !only_updated )
                return data;

            return false;
        }
    }

    // Export
    module.exports = Players;

} )();
