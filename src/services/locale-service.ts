/**
 * @module Services
 *
 */ /** */

/**
 * A service that can provide localization settings
 */
export class LocaleService {
    /**
     * Timezone information. Should contain an IANA timezone string
     */
    public timezone: string = "Europe/Budapest";

    /**
     * Date format
     */
    public dateFormat: string =  "YYYY-MM-DD";

    /**
     * DateTime format
     */
    public dateTimeFormat: string = "YYYY-MM-DDTHH:mm:ss";
}
