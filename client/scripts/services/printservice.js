
'use strict';
robs.factory('printservice',function($http,$location,$rootScope,logger) {
    return {
        // methods - printing
        salesbill: function(data,doCallback){
            $http.post('/bill/sales',data)
                .success(function (response) {
                    doCallback(response);
                });
        },
        printbill:function(data,options){
            var pageWidth=900, pageHeight=295,fontSize=18;
            var content=[];
            var str;

            var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
            pdfMake.createPdf(docDefinition).open();


            //var docDefinition = {
            //    pageSize: 'A5',
            //    pageOrientation: 'portrait',
            //    pageMargins:[0,0,0,0],
            //    defaultStyle: {font: 'Roboto-Regular.ttf'},
            //
            //    header: 'estimate',
            //    footer: {                // customer org name and date (2 columns)
            //        columns: [
            //            'prem deep jewellery',
            //            { text: 'date: 14-july-2016', alignment: 'right' }
            //        ],
            //        pageBreak: 'after'
            //    },
            //
            //    content: [
            //        // body
            //        { text: 'sales', style: 'subheader' },
            //        {
            //            style: 'tableExample',
            //            table: {
            //                headerRows: 1,
            //                widths: [ '*', 'auto', 100, '*' ],
            //                // keepWithHeaderRows: 1,
            //                // dontBreakRows: true,
            //                body: [
            //                    [{text:'#', style:'tableHeader'}, {text:'item', style:'tableHeader'}, {text:'rate',style:'tableHeader'}, {text:'qty',style:'tableHeader'}, {text: 'weight', style: 'tableHeader' }],
            //                    ['1','chain','2830','12','16.825'],
            //                    ['2','rings','2830','12','216.825'],
            //                    ['3','earware','2830','12','16.825'],
            //                    ['4','bracelet','2830','12','16.825']
            //                ]
            //            }
            //        },'\n',
            //
            //        { text: 'purchase', style: 'subheader' },
            //        {
            //            bold: true,
            //            ul: [
            //                'date:14/7, weight: 2 gm, purity: 88.3',
            //                'date:14/7, weight: 3 gm, purity: 92.3'
            //            ]
            //        },'\n',
            //
            //        { text: 'cash', style: 'subheader' },
            //        {
            //            bold: true,
            //            ul: [
            //                'date:14/7, amount: 20283 rs.',
            //                'date:14/7, amount: 20283 rs.'
            //            ]
            //        },'\n',
            //
            //        { text: 'sales return', style: 'subheader' },
            //        {
            //            bold: true,
            //            ul: [
            //                'date:14/7, weight: 2.502 gm.',
            //                'date:14/7, weight: 2.502 gm.'
            //            ]
            //        },'\n',
            //
            //        { text: 'summary', style: 'subheader' },
            //        { text: 'outstanding as on 14 july 2016: 62.361 grams', style: 'subheader' },
            //
            //    ],
            //    styles: {
            //        billheader: {
            //            fontSize: 15,
            //            bold: true,
            //            alignment: 'justify'
            //        },
            //        body: {
            //            fontSize: 10,
            //            bold: true,
            //            alignment: 'left'
            //        },
            //        footer: {
            //            fontSize: 15,
            //            bold: true,
            //            alignment: 'right'
            //        },
            //        header: {
            //            fontSize: 18,
            //            bold: true,
            //            margin: [0, 0, 0, 10]
            //        },
            //        subheader: {
            //            fontSize: 16,
            //            bold: true,
            //            margin: [0, 10, 0, 5]
            //        },
            //        tableExample: {
            //            margin: [0, 5, 0, 15]
            //        },
            //        tableHeader: {
            //            bold: true,
            //            fontSize: 13,
            //            color: 'black'
            //        }
            //    }
            //}

            //content.push(' ');
            //
            //// create bill header
            //str.push(
            //    {width:(pageWidth/(pageWidth/40)),text:""},
            //    {width:(pageWidth/(pageWidth/30)),text:"estimate",alignment:'left'}
            //);
            //content.push({fontSize:fontSize,columns:str});
            //content.push(' ');
            //
            ////sales table
            //
            //// create table header
            //str.splice(0,str.length);   // remove all items in array
            //if(options.customertype==1){        // wholesale customer
            //    str.push(
            //        {width:(pageWidth/(pageWidth/5)),text:"#",alignment:'center'},
            //        {width:(pageWidth/(pageWidth/30)),text:"item",alignment:'left'},
            //        {width:(pageWidth/(pageWidth/20)),text:"rate",alignment:'right'},
            //        {width:(pageWidth/(pageWidth/15)),text:"qty",alignment:'right'},
            //        {width:(pageWidth/(pageWidth/30)),text:"weight",alignment:'right'}
            //    );
            //}
            //else if(options.customertype==2){   // retail customer
            //    str.push(
            //        {width:(pageWidth/(pageWidth/5)),text:"#",alignment:'center'},
            //        {width:(pageWidth/(pageWidth/25)),text:"item",alignment:'left'},
            //        {width:(pageWidth/(pageWidth/15)),text:"rate",alignment:'right'},
            //        {width:(pageWidth/(pageWidth/15)),text:"qty",alignment:'right'},
            //        {width:(pageWidth/(pageWidth/20)),text:"weight",alignment:'right'},
            //        {width:(pageWidth/(pageWidth/20)),text:"amount",alignment:'right'}
            //    );
            //}
            //content.push({fontSize:fontSize,columns:str});
            //content.push(' ');
            //content.push('-');
            //content.push(' ');
            //
            //// gross, stone, st.value, me, va, mc   must be pushed as second line in bill
            //
            //// create table body
            //var sumnetweight= 0,sumnetqty= 0;
            //str.splice(0,str.length);   // remove all items in array
            //if(options.customertype==1) {        // wholesale customer
            //}
            //else if(options.customertype==2) {   // retail customer
            //};

            content.push(' ');

            //// create bill header
            //str.push(
            //    { text: 'estimate', style: 'header' },
            //    '\n\n',
            //    {text: 'Vanitha Jewellery\n'+'G.B.Road, Palakkad. 678003'}
            //);
            //content.push(str);
            //content.push('\n');
            //
            ////sales table
            //
            //// create table header
            //str.splice(0,str.length);   // remove all items in array
            //if(options.customertype==1){        // wholesale customer
            //    str.push(
            //        { text: 'sales', style: 'bigger' },
            //        {
            //            columns: [
            //                {text: '#'},
            //                {text: 'item'},
            //                {text: 'rate'},
            //                {text: 'qty'},
            //                {text: 'weight'}
            //            ]
            //        }
            //    );
            //}
            //else if(options.customertype==2){   // retail customer
            //    str.push(
            //        { text: 'sales', style: 'bigger' },
            //        {
            //            columns: [
            //                {text: '#'},
            //                {text: 'item'},
            //                {text: 'rate'},
            //                {text: 'qty'},
            //                {text: 'amount'}
            //            ]
            //        }
            //    );
            //}
            //content.push(str);
            //content.push('\n');
            //content.push('-');
            //content.push(' ');
            //
            //// gross, stone, st.value, me, va, mc   must be pushed as second line in bill
            //
            //// create table body
            //var sumnetweight= 0,sumnetqty= 0;
            //str.splice(0,str.length);   // remove all items in array
            //if(options.customertype==1) {        // wholesale customer
            //}
            //else if(options.customertype==2) {   // retail customer
            //};
            //
            //// playground requires you to assign document definition to a variable called dd
            //
            ////var docDefinition = {
            ////    content: [
            ////        'This paragraph fills full width, as there are no columns. Next paragraph however consists of three columns',
            ////        {
            ////            columns: [
            ////                {
            ////                    // auto-sized columns have their widths based on their content
            ////                    width: 'auto',
            ////                    text: 'First column'
            ////                },
            ////                {
            ////                    // star-sized columns fill the remaining space
            ////                    // if there's more than one star-column, available width is divided equally
            ////                    width: '*',
            ////                    text: 'Second column'
            ////                },
            ////                {
            ////                    // fixed width
            ////                    width: 100,
            ////                    text: 'Third column'
            ////                },
            ////                {
            ////                    // % width
            ////                    width: '20%',
            ////                    text: 'Fourth column'
            ////                }
            ////            ],
            ////            // optional space between columns
            ////            columnGap: 10
            ////        },
            ////        'This paragraph goes below all columns and has full width'
            ////    ]
            ////};
            //
            //pdfMake.createPdf(docDefinition).open();
            ////var pdf=pdfMake.createPdf(docDefinition);
            ////pdf.print();
        },
        generatepdf: function () {
            var lastGen = new Date();
            var dd = {
                content: [
                    { text: 'estimate', style: 'header' },
                    '\n\n',
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                text: 'Vanitha Jewellery\n'+'G.B.Road, Palakkad. 678003'
                            },
                            {
                                text: ''
                            }
                        ]
                    },
                    '\n',
                    { text: 'sales', style: 'bigger' },
                    {
                        columns: [
                            {
                                text: ''
                            },
                            {
                                text: ''
                            },
                            {
                                text: ''
                            }
                        ]
                    },
                    '\nYou can also specify accurate widths for some (or all columns). Let\'s make the first column and the last one narrow and let the layout engine divide remaining space equally between other star-columns:\n\n',
                    {
                        columns: [
                            {
                                width: 90,
                                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                            },
                            {
                                width: '*',
                                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                            },
                            {
                                width: '*',
                                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                            },
                            {
                                width: 90,
                                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
                            }
                        ]
                    },
                    '\nWe also support auto columns. They set their widths based on the content:\n\n',
                    {
                        columns: [
                            {
                                width: 'auto',
                                text: 'auto column'
                            },
                            {
                                width: '*',
                                text: 'This is a star-sized column. It should get the remaining space divided by the number of all star-sized columns.'
                            },
                            {
                                width: 50,
                                text: 'this one has specific width set to 50'
                            },
                            {
                                width: 'auto',
                                text: 'another auto column'
                            },
                            {
                                width: '*',
                                text: 'This is a star-sized column. It should get the remaining space divided by the number of all star-sized columns.'
                            },
                        ]
                    },
                    '\nIf all auto columns fit within available width, the table does not occupy whole space:\n\n',
                    {
                        columns: [
                            {
                                width: 'auto',
                                text: 'val1'
                            },
                            {
                                width: 'auto',
                                text: 'val2'
                            },
                            {
                                width: 'auto',
                                text: 'value3'
                            },
                            {
                                width: 'auto',
                                text: 'value 4'
                            },
                        ]
                    },
                    '\nAnother cool feature of pdfmake is the ability to have nested elements. Each column is actually quite similar to the whole document, so we can have inner paragraphs and further divisions, like in the following example:\n\n',
                    {
                        columns: [
                            {
                                width: 100,
                                fontSize: 9,
                                text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Conveniunt quieti extremum severitatem disseretur virtute locum virtus declarant. Greges telos detrimenti persius possint eripuit appellat democrito suscipere existimant. Facere usus levitatibus confirmavit, provincia rutilius libris accommodare valetudinis ignota fugienda arbitramur falsarum commodius. Voluptas summis arbitrarer cognitio temperantiamque, fuit posidonium pro assueverit animos inferiorem, affecti honestum ferreum cum tot nemo ius partes dissensio opinor, tuum intellegunt numeris ignorant, odia diligenter licet, sublatum repellere, maior ficta severa quantum mortem. Aut evertitur impediri vivamus.'
                            },
                            [
                                'As you can see in the document definition - this column is not defined with an object, but an array, which means it\'s treated as an array of paragraphs rendered one below another.',
                                'Just like on the top-level of the document. Let\'s try to divide the remaing space into 3 star-sized columns:\n\n',
                                {
                                    columns: [
                                        { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                                        { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                                        { text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.' },
                                    ]
                                }
                            ]
                        ]
                    },
                    '\n\nOh, don\'t forget, we can use everything from styling examples (named styles, custom overrides) here as well.\n\n',
                    'For instance - our next paragraph will use the \'bigger\' style (with fontSize set to 15 and italics - true). We\'ll split it into three columns and make sure they inherit the style:\n\n',
                    {
                        style: 'bigger',
                        columns: [
                            'First column (BTW - it\'s defined as a single string value. pdfmake will turn it into appropriate structure automatically and make sure it inherits the styles',
                            {
                                fontSize: 20,
                                text: 'In this column, we\'ve overriden fontSize to 20. It means the content should have italics=true (inherited from the style) and be a little bit bigger'
                            },
                            {
                                style: 'header',
                                text: 'Last column does not override any styling properties, but applies a new style (header) to itself. Eventually - texts here have italics=true (from bigger) and derive fontSize from the style. OK, but which one? Both styles define it. As we already know from our styling examples, multiple styles can be applied to the element and their order is important. Because \'header\' style has been set after \'bigger\' its fontSize takes precedence over the fontSize from \'bigger\'. This is how it works. You will find more examples in the unit tests.'
                            }
                        ]
                    },
                    '\n\nWow, you\'ve read the whole document! Congratulations :D'
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true
                    },
                    bigger: {
                        fontSize: 15,
                        italics: true
                    }
                },
                defaultStyle: {
                    columnGap: 20
                }

            };

            $http.post('/pdf', dd).
            success(function(data, status, headers, config) {
                document.getElementById('pdfV').src = data;
            }).
            error(function(data, status, headers, config) {
                console.log('ERROR', data);
            });
    }
    }
});