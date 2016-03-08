( function()
{
    'use strict';

    // Requires
    let Data          = require( './data.class' ),
        Event_Emitter = require( './event_emitter.class' ),
        Shot          = require( './shot.class' ),
        Ticker        = require( './ticker.class' );

    // Singleton
    let instance = null;

    /**
     * Shots class
     */
    class Shots extends Event_Emitter
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
            this.all    = {};
            this.count  = 0;

            // Init
            this.init_data();
            this.init_ticker();
        }

        /**
         * Init data
         */
        init_data()
        {
            let that = this;

            // Set up
            this.data = new Data();
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
            let shot = new Shot( options );

            // Shot elapsed event
            shot.on( 'elapsed', () =>
            {
                this.remove( shot.id );
            } );

            // Socket
            this.data.emit( 'shots_add', shot.get_data( true ) );

            // Update
            this.count++;

            // Add to shots
            this.all[ shot.id ] = shot;

            // Trigger
            this.trigger( 'add', [ shot ] );

            console.log( 'socket'.green.bold + ' - ' + 'shots_add'.cyan + ' - ' + shot.id.toString().cyan );
        }

        /**
         * Remove
         */
        remove( shot_id )
        {
            // Set up
            let shot = this.get( shot_id );

            // Shot not found
            if( !shot )
                return false;

            // Add to shots
            delete this.all[ shot.id ];

            // Socket
            this.data.emit( 'shots_remove', { id : shot.id } );

            // Update
            this.count--;

            console.log( 'socket'.green.bold + ' - ' + 'shots_remove'.cyan + ' - ' + shot.id.toString().cyan );
        }

        /**
         * Get
         */
        get( shot_id )
        {
            return this.all[ shot_id ] || false;
        }

        /**
         * Update
         */
        update( time )
        {
            // Loop through each shot
            for( let _shot_id in this.all )
            {
                // Set up
                let _shot = this.all[ _shot_id ];

                // Update
                _shot.update( time );
            }

            // Add to data pending
            this.data.add_to_pending( 'shots', this.get_data() );
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

            // Loop through each shot
            for( let _shot_id in this.all )
            {
                // Set up
                let _shot = this.all[ _shot_id ],
                    _data = _shot.get_data( only_updated );

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
    module.exports = Shots;

} )();
