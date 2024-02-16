/**
 * 
 * @returns voucherDate
 */

class lexOfficeHelper {
    static createVoucherDate(){
        let TimeTool = SPLINT.Tools.DateTime.Helper;
        let date = new Date();
        let hour            = TimeTool.formatSingleNumber(date.getUTCHours());
        let minute          = TimeTool.formatSingleNumber(date.getUTCMinutes());
        let millisecond     = String(TimeTool.formatSingleNumber(date.getUTCMilliseconds(), 2)).padStart(3, '0');
        let second          = TimeTool.formatSingleNumber(date.getUTCSeconds());
        let year            = date.getUTCFullYear();
        let month           = TimeTool.formatSingleNumber(date.getUTCMonth() + 1);
        let day             = TimeTool.formatSingleNumber(date.getUTCDate());
        let timeZoneOffset  = date.getTimezoneOffset();
            timeZoneOffset /= -60;
            timeZoneOffset = TimeTool.formatSingleNumber(timeZoneOffset);
        return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "." + millisecond + "+" + timeZoneOffset + ":00";
    }
}