( function()
{
    'use strict';

    // Singleton
    let instance = null;

    /**
     * Map class
     */
    class Map
    {
        /**
         * Constructor
         */
        constructor( options )
        {
            // Singleton
            if( instance )
                return instance;
            else
                instance = this;

            // Set up
            this.collision_absorption = 0.5;
            this.limits               = {};
            this.limits.x             = 400;
            this.limits.y             = 400;
            this.center               = {};
            this.center.x             = ~~( this.limits.x * 0.5 );
            this.center.y             = ~~( this.limits.y * 0.5 );
        }
    }

    // Export
    module.exports = Map;

} )();
