(function () {

    /* General Formating */
    Handlebars.registerHelper("formatMoney", function (value) { if (!value) return ''; return parseFloat(value).toFixed(2); });
    Handlebars.registerHelper('insertLineBreaks', function (text) { text = Handlebars.Utils.escapeExpression(text); text = text.replace(/(\r\n|\n|\r)/gm, '<br//>').replace(' ', '&nbsp;'); return new Handlebars.SafeString(text); });
    Handlebars.registerHelper('textArea', function (text) { text = Handlebars.Utils.escapeExpression(text); text = text.replace(/(\r\n|\n|\r)/gm, '&#10;'); return new Handlebars.SafeString(text); });
    Handlebars.registerHelper("blankZero", function (value) { if (value == '0') return ''; return value; });

    /* Operators */
    Handlebars.registerHelper("if_eq", function (a, b, opts) { if (a == b) return opts.fn(this); else return opts.inverse(this); })
    Handlebars.registerHelper('checkFlag', function (flag, val) { return (parseInt(flag) & parseInt(val)) != 0 ? 'checked' : ''; });
    Handlebars.registerHelper('checkIf', function (val) { return val ? 'checked' : ''; });
    Handlebars.registerHelper('disableIf', function (val) { return val ? 'disabled' : ''; });
    Handlebars.registerHelper('select', function (value, options) { var $el = $('<div/>').html(options.fn(this)); $el.find('[value=' + value + ']').attr({ 'selected': 'selected' }); return $el.html(); });
    
    /* Data Binding */
    Handlebars.dataOptions = { id: 0, cache: [] };
    Handlebars.registerHelper("bindData", function (data) { var dataKey = Handlebars.dataOptions.id++; Handlebars.dataOptions.cache[dataKey] = data; return new Handlebars.SafeString('data-handlebar-id="' + dataKey + '"'); });
    Handlebars.getBoundData = function (handlebarId) { if (typeof (handlebarId) !== "string") { handlebarId = handlebarId.attr("data-handlebar-id"); }; return Handlebars.dataOptions.cache[handlebarId]; };
    Handlebars.setBoundData = function (handlebarId, data) { if (typeof (handlebarId) !== "string") { handlebarId = handlebarId.attr("data-handlebar-id"); }; Handlebars.dataOptions.cache[handlebarId] = data; };
    
    /* Date Formats */
    Handlebars.registerHelper("formatDate", function (value) { if (!value) return ''; return new Date(value).format("DD MMMM YYYY"); });
    Handlebars.registerHelper("formatDateTime", function (value) { if (!value) return ''; return new Date(value).format("DD MMMM YYYY HH:mm"); });
    Handlebars.registerHelper("formatTime", function (value) { if (!value) return ''; return new Date(value).format("HH:mm"); });
    Handlebars.registerHelper("formatDateShort", function (value) { if (!value) return ''; return new Date(value).format("DDD D MMM"); });
    Handlebars.registerHelper("formatDateSpecial", function (value) { if (!value) return ''; var byDate = new Date(value); return new Handlebars.SafeString(byDate.format("DD MMMM YYYY") + ' ' + Handlebars.getGeneralDifference(byDate)); });
    Handlebars.registerHelper("formatDateTimeSpecial", function (value) { if (!value) return ''; var byDate = new Date(value); return new Handlebars.SafeString(byDate.format("DD MMMM YYYY HH:mm") + ' ' + Handlebars.getGeneralDifference(byDate)); });

    Handlebars.getGeneralDifference = function (byDate) {

        var diff = (((new Date()).getTime() - byDate.getTime()) / 1000),
            day_diff = Math.round(diff / 86400),
            out = '';

        if (day_diff >= 0) {

            out = day_diff == 0 && (
			        diff < 60 && "just now" ||
			        diff < 120 && "1 minute ago" ||
			        diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
			        diff < 7200 && "1 hour ago" ||
			        diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
		        day_diff == 1 && "Yesterday" ||
		        day_diff < 7 && day_diff + " days ago" ||
		        day_diff < 31 && Math.round(day_diff / 7) + " week" + (Math.round(day_diff / 7) > 1 ? "s" : "") + " ago" ||
                day_diff >= 30 && Math.round(day_diff / 31) + " month" + (Math.round(day_diff / 31) > 1 ? "s" : "") + " ago";
        } else {
            out = day_diff == 0 && "Today" ||
                day_diff == -1 && "Tomorrow" ||
                day_diff > -7 && Math.abs(day_diff) + " days to go" ||
                day_diff > -31 && Math.abs(Math.round(day_diff / 7)) + " week" + (Math.round(day_diff / 7) < 1 ? "s" : "") + " to go" ||
                day_diff <= -30 && Math.abs(Math.round(day_diff / 31)) + " month" + (Math.round(day_diff / 31) > 1 ? "s" : "") + " to go";
        }

        return '<span class="dateGeneralDifference">(' + out + ')</span>'

    }
    

    /* Date Formater */
    var D = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    M = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
    Date.prototype.format = function (format) {
        var me = this;

        if (me == "Invalid Date" || isNaN(me)) return "";
        return format.replace(/a|A|Z|S(SS)?|ss?|mm?|HH?|hh?|D{1,4}|M{1,4}|YY(YY)?|'([^']|'')*'/g, function (str) {
            var c1 = str.charAt(0),
                ret = str.charAt(0) == "'"
                ? (c1 = 0) || str.slice(1, -1).replace(/''/g, "'")
                : str == "a"
                  ? (me.getHours() < 12 ? "am" : "pm")
                  : str == "A"
                    ? (me.getHours() < 12 ? "AM" : "PM")
                    : str == "Z"
                      ? (("+" + -me.getTimezoneOffset() / 60).replace(/^\D?(\D)/, "$1").replace(/^(.)(.)$/, "$10$2") + "00")
                      : c1 == "S"
                        ? me.getMilliseconds()
                        : c1 == "s"
                          ? me.getSeconds()
                          : c1 == "H"
                            ? me.getHours()
                            : c1 == "h"
                              ? (me.getHours() % 12) || 12
                              : (c1 == "D" && str.length > 2)
                                ? D[me.getDay()].slice(0, str.length > 3 ? 9 : 3)
                                : c1 == "D"
                                  ? me.getDate()
                                  : (c1 == "M" && str.length > 2)
                                    ? M[me.getMonth()].slice(0, str.length > 3 ? 9 : 3)
                                    : c1 == "m"
                                      ? me.getMinutes()
                                      : c1 == "M"
                                        ? me.getMonth() + 1
                                        : ("" + me.getFullYear()).slice(-str.length);
            return c1 && str.length < 4 && ("" + ret).length < str.length
              ? ("00" + ret).slice(-str.length)
              : ret;
        });
    };
    Date.prototype.sameDateAs = function (pDate) {
        return ((this.getFullYear() == pDate.getFullYear()) && (this.getMonth() == pDate.getMonth()) && (this.getDate() == pDate.getDate()));
    };


})();
