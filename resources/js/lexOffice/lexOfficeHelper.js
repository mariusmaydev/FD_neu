/**
 * 
 * @returns voucherDate
 */

function createVoucherDate(){
  let date = new Date();
  let hour            = S_Time.formatSingleNumber(date.getUTCHours());
  let minute          = S_Time.formatSingleNumber(date.getUTCMinutes());
  let millisecond     = S_Time.formatSingleNumber(date.getUTCMilliseconds(), 2);
  let second          = S_Time.formatSingleNumber(date.getUTCSeconds());
  let year            = date.getUTCFullYear();
  let month           = S_Time.formatSingleNumber(date.getUTCMonth() + 1);
  let day             = S_Time.formatSingleNumber(date.getUTCDate());
  let timeZoneOffset  = date.getTimezoneOffset();
      timeZoneOffset /= -60;
      timeZoneOffset = S_Time.formatSingleNumber(timeZoneOffset);
  return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "." + millisecond + "+" + timeZoneOffset + ":00";
}