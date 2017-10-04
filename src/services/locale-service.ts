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
    public DateFormat: string =  'YYYY-MM-DD';

    /**
     * DateTime format
     */
    public DateTimeFormat: string = 'YYYY-MM-DDTHH:mm:ss';
}