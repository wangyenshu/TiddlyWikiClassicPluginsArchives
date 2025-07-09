//{{{
Calendar.locale = 'zh-Hant';
Calendar[Calendar.locale] = {
	dates: {
		days: ["日", "一","二", "三", "四", "五", "六"],
		yearFmt: "YYYY年",
		monthFmt: "YYYY年0MM月",
		dateFmt: "YYYY年0MM月0DD日",
		longHolidayFmt: "YYYY年0MM月0DD日",
		shortHolidayFmt: "0MM月0DD日",
		startOfWeek: 0, /* 0 (日)、1(一)*/
		weekends: [true, false, false, false, false, false, true], /* 預設: 0 (日) and 6 (六) true*/
		holidays: ['01月01日']},
	messages: {
		optionLegend: "日曆選項：",
		startOfWeek: "一週起始日：",
		weekend: "週末：",
		changed: "異動："},
	naviType: {
		bwdYear: {label:"\u00ab", title:"往前一年"},
		fwdYear: {label:"\u00bb", title:"往後一年"},
		bwdMonth: {label: "\u2039", title:"往前一個月"},
		fwdMonth: {label: "\u203a",title: "往後一個月"}}
};
var calendar = new Calendar(); 
var datepicker = new Calendar();
//}}}