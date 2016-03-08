( function()
{
    'use strict';

    // Requires
    let Event_Emitter = require( './event_emitter.class' );

    // Singleton
    let instance = null;

    /**
     * Ticker class
     */
    class Ticker extends Event_Emitter
    {
        /**
         * Constructor
         */
        constructor()
        {
            super();

            // Singleton
            if( instance )
                return instance;
            else
                instance = this;

            // Set up
            this.interval     = null;
            this.running      = false;
            this.time         = {};
            this.time.start   = 0;
            this.time.elapsed = 0;
            this.time.delta   = 0;
            this.time.current = 0;

            // Init
            this.run();
        }

        /**
         * Run
         */
        run()
        {
            this.time.start   = + ( new Date() );
            this.time.current = this.time.start;
            this.time.elapsed = 0;
            this.time.delta   = 0;

            // Interval
            this.interval = setInterval( () =>
            {
                this.tick();
            }, 50 );
        }

        /**
         * Tick
         */
        tick()
        {
            this.time.current = + ( new Date() );
            this.time.delta   = this.time.current - this.time.start - this.time.elapsed;
            this.time.elapsed = this.time.current - this.time.start;

            // Trigger
            this.trigger( 'tick', [ this.time ] );
        }
    }

    // Export
    module.exports = Ticker;

} )();
