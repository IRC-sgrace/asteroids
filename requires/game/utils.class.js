( function()
{
    'use strict';

    // Singleton
    let instance = null;

    /**
     * Utils class
     */
    class Utils
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
            this.last_id = 0;
        }

        /**
         * Get id
         */
        get_id()
        {
            return ++this.last_id;
        }
    }

    // Export
    module.exports = Utils;

} )();
