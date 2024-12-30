
var d=new Date();
var monthname=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
var TODAY = monthname[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
var month=new Array("01","02","03","04","05","06","07","08","09","10","11","12");
var customDate=new Array("01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31")
//var CurrentDate= month[d.getMonth()] + "-" + customDate[d.getDate()-1] + "-" + d.getFullYear();

//var CurrentDate="2014-01-11" ;

var CurrentDate= d.getFullYear()+"-"+ month[d.getMonth()]+"-"+ customDate[d.getDate()-1] ;

var CurrentDateTime=d.getFullYear() +"-"+month[d.getMonth()]+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()


function DateValidation(DateString)
{
    var day,Month,DateNow=new Date(DateString);
    if(DateNow.getDate().toString().length==1)
    {
        day="0"+DateNow.getDate();
    }
    else
    {
        day=DateNow.getDate();
    }
    if((DateNow.getMonth()+1).toString().length==1)
    {
        Month="0"+(DateNow.getMonth()+1);
    }
    else
    {
        Month=(DateNow.getMonth()+1);
    }
    return DateNow.getFullYear()+"-"+month[+Month-1]+"-"+customDate[+day-1];
}

