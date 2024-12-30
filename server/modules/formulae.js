'use strict';

// constants
function basepurity(){var basepurity=99.5; return basepurity;}
function purepurity(){var purepurity=99.9; return purepurity;}

// methods
exports.roundNumber=function(value,exp){
    if (typeof exp === 'undefined' || +exp === 0) return Math.round(value);

    value = +value;
    exp  = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) return 0;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift backs
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
};

exports.getbasepurity=function() {
    var company=req.body.usercompany;

    db.getConnection(function(err, con){
        //if(err){console.log(err);}
        logger.log('info',sql,1,'/getrate');
        var sql="SELECT boardrate, 995rate as rate995, basepurity, createddatetime FROM metalrate where companyid='"+company +"' order by createddatetime desc limit 1;";
        try{
            con.query(sql,function(err,rows){
                con.release();
                if(!err){
                    if(rows.length>0){
                        logger.log('data','getbasepurity Success !!',req.session.sessionID,'getbasepurity');
                        //console.log(JSON.stringify(rows));
                        res.end(JSON.stringify(rows));
                    }
                    else{
                        logger.log('warn','getbasepurity !!',req.session.sessionID,'getbasepurity');
                        res.end('[{"result":"NODATA","usermessage":"no data available","systemmessage":"no data available"}]');
                    }
                }else{
                    logger.log('error','Invalid Query !!',req.session.sessionID,'getrate');
                    res.end('[{"result":"ERROR","usermessage":"system error. please contact support","systemmessage":"invalid query"}]');
                }
            });
        }
        catch (e){
            throw e;
        }
    });
};

exports.WholesaleCalculation=function(grossweight,stoneweight,purity,wastage,me,mc,stonevalue,boardrate) {
    var netweight= (+grossweight - +stoneweight);
    var calculatedweight=((+netweight + +wastage) * (+purity + +me)) / +basepurity();
    var actualweight=  +calculatedweight + ((+stonevalue + +mc) / +boardrate);
    if (isNaN(actualweight)){actualweight=0}
    var str=""+actualweight+"";
    var dotPosition=str.indexOf('.');
    if(dotPosition!=-1){
        actualweight=this.roundNumber(str,3) ;
    }
    return(actualweight);
};

exports.RetailCalculation=function(grossweight,stoneweight,purity,wastage,va,mc,stonevalue,rate995){
    //console.log('gross: '+grossweight,'stone we '+stoneweight,'purity ' + purity, 'watage '+ wastage, 'va '+ va, 'mc ' + mc, 'sv '+ stonevalue, 'rate '+ rate995);
    var netweight= (+grossweight - +stoneweight);
    var grossvalue=(+netweight + +wastage) * +rate995 ;
    var netvalue=  +grossvalue + (+grossvalue * (+va/100)) + +stonevalue + +mc;
    if (isNaN(netvalue)){netvalue=0}
    var str=netvalue+"";
    var dotPosition=str.indexOf('.');
    if(dotPosition!=-1){
        netvalue=this.roundNumber(str,3) ;
    }
    //console.log(netvalue);
    return(netvalue);
};

exports.ConvertTo995=function(weight,purity){
    // for old gold divide by 100, for 995 use base purity
    var weight995=0;
    if(weight!=undefined && purity != undefined){
        //if (+purity ==+basepurity() | +purity ==+purepurity()){
        //    weight995 = +weight * +purity / +basepurity();
        //}
        //else{
        //    weight995 = +weight * +purity / +100;
        //}

        //if (+purity < +92){
        //    weight995 = +weight * +purity / +100;
        //}
        //else{
        //    weight995 = +weight * +purity / +basepurity();
        //}

        if (+purity >= +99){
            weight995 = +weight * +purity / +basepurity();
        }
        else{
            weight995 = +weight * +purity / +100;
        }

        //console.log('purity '+ purity +' , weight '+ weight995);

        var str=""+weight995+"";
        var dotPosition=str.indexOf('.');
        if(dotPosition!=-1){
            weight995= this.roundNumber(str,3) ;
        }
    }
    return(weight995);
};

exports.ConvertTo995smith=function(weight,purity){
    // for old gold divide by 100, for 995 use base purity
    var weight995=0;
    if(weight!=undefined && purity != undefined){
        if (+purity >= +91.6){
            weight995 = +weight * +purity / +basepurity();
        }
        //else if (+purity >= +99){
        //    weight995 = +weight * +purity / +basepurity();
        //}
        else{
            weight995 = +weight * +purity / +100;
        }

        //console.log('purity '+ purity +' , weight '+ weight995);

        var str=""+weight995+"";
        var dotPosition=str.indexOf('.');
        if(dotPosition!=-1){
            weight995= this.roundNumber(str,3) ;
        }
    }
    return(weight995);
};

exports.ConvertTo995ToCash=function(weight,purity,metalrate){
    var weight995=0;
    var valueINR=0;
    if(weight!=undefined && purity != undefined){
        if (+purity == +basepurity()){
            weight995 = +weight * +purity / +basepurity();
        }
        else{
            weight995 = +weight * +purity / +100;
        }

        valueINR = +weight995 * +metalrate;
        var str=""+valueINR+"";
        var dotPosition=str.indexOf('.');
        if(dotPosition!=-1){
            valueINR= this.roundNumber(str,0) ;
        }
    }
    return(valueINR);
};

exports.ConvertCashTo995=function(amount,metalrate){
    var weight995=0;

    if(amount!=undefined && metalrate != undefined){
        weight995 = +amount / +metalrate;
        var str=""+weight995+"";
        var dotPosition=str.indexOf('.');
        if(dotPosition!=-1){
            weight995= this.roundNumber(str,3) ;
        }
    }
    return(weight995);
};

exports.GSCalculation=function(grossweight,stoneweight,purity,wastage,me){
    var calculatedweight=0;
    var netweight = (+grossweight - +stoneweight);
    //var calculatedweight = (+netweight + +wastage) * (+purity + +me)/ +basepurity();

    if (+me == 0){
        calculatedweight = ((+netweight + +wastage) * (+purity  / +basepurity()));
    }
    else if (+wastage == 0){
        calculatedweight = (+netweight * (+purity + +me)/ +basepurity);
    }
    else {
        calculatedweight = ((+netweight + +wastage) * (+purity + +me) / +basepurity());
    }

    var str = ""+calculatedweight+"";
    var dotPosition=str.indexOf('.');
    if(dotPosition!=-1){
        calculatedweight=this.roundNumber(str,3) ;
    }
    return (calculatedweight);
};

exports.OGCalculationWholesale=function(weight,testvalue,wastevalue){
    var OGWholeSale=(+weight *(+testvalue - +wastevalue)/ 100);
    var str=""+OGWholeSale+"";
    var dotPosition=str.indexOf('.');
    if(dotPosition!=-1){
        OGWholeSale=this.roundNumber(str,3) ;
    }
    return(OGWholeSale);
};

exports.OGCalculationRetail=function(weight,touch,rate995){
    var OGRetail=(+weight * (+touch/100) * +rate995);
    var str= ""+OGRetail+"";
    var dotPosition=str.indexOf('.');
    if(dotPosition!=-1){
        OGRetail=this.roundNumber(str,3) ;
    }
    return (OGRetail);
};