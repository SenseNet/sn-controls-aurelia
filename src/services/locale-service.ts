/**
 * @module Services
 * 
 */ /** */

/**
 * A service that can provide localization settings
 */
export class LocaleService{
    /**
     * Timezone information. Should contain an IANA timezone string
     */
    public Timezone: string = 'Europe/Budapest';

    /**
     * Date format
     */
    public DateFormat: string =  'yyyy-mm dd';

    /**
     * Date format
     */
    public TimeFormat: string = 'HH:mm:ss';
}