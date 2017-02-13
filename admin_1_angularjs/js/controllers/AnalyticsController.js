/* Setup FB users page controller */

  
angular.module('MetronicApp').controller('AnalyticsController', function ($rootScope, $timeout, $scope, FBUserService, $q, GraphService) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components 

        $('img[src$=".svg"]').each(function() {
            var $img = jQuery(this);
            var imgURL = $img.attr('src');
            var attributes = $img.prop("attributes");
    
            $.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Remove any invalid XML tags
                $svg = $svg.removeAttr('xmlns:a');

                // Loop through IMG attributes and apply on SVG
                $.each(attributes, function() {
                    $svg.attr(this.name, this.value);
                });

                // Replace IMG with SVG
                $img.replaceWith($svg);
            }, 'xml');
        });      

        GraphService.GetUsersByTime("Daily")
            .then(function (data) {
                
                $timeout(function(){
                    // $q.when(AmCharts.StockPanel).then(function(){
                    // AmCharts.ready(function () {
                        chartDataUser = data;
                        $scope.loadingUser = false;
                        $scope.createUserChart();
                    // });
                    // });
                }, 500);
            })
        GraphService.GetSessionsByTime("Daily")
            .then(function (data) {
                
                $timeout(function(){
                    // $q.when(AmCharts.StockPanel).then(function(){
                    // AmCharts.ready(function () {
                        chartDataSession = data;
                        $scope.loadingSession = false;
                        $scope.createSessionChart();
                    // });
                    // });
                }, 500);
            })
    });

    $scope.alerts = [];
    $scope.loadingUser = true;
    $scope.loadingSession = true;
    $scope.registeredUsers = 0;
    $scope.totalSessions = 0;
    $scope.todayUsers = 0;
    $scope.totalShares = 0;



    $scope.loadUser = function(resolution){
        $scope.loadingUser = true;
        GraphService.GetUsersByTime(resolution)
            .then(function (data) {
                
                $timeout(function(){
                    // $q.when(AmCharts.StockPanel).then(function(){
                    // AmCharts.ready(function () {
                        chartDataUser = data;
                        $scope.loadingUser = false;
                        $scope.createUserChart();
                    // });
                    // });
                }, 0);
            })
    }
    $scope.loadSession = function(resolution){
        $scope.loadingSession = true;
        GraphService.GetSessionsByTime(resolution)
            .then(function (data) {
                
                $timeout(function(){
                    // $q.when(AmCharts.StockPanel).then(function(){
                    // AmCharts.ready(function () {
                        chartDataSession = data;
                        $scope.loadingSession = false;
                        $scope.createSessionChart();
                    // });
                    // });
                }, 0);
            })
    }
    $scope.loadTotalFbUsers = function () {
        return FBUserService.GetUsersTotal()
            .then(function (UsersTotals) {
                $scope.registeredUsers = UsersTotals.Users;
                $scope.totalSessions = UsersTotals.TotalSessions;
                $scope.todayUsers = UsersTotals.TodayUsers;
            })
            .catch(function () {
                $scope.alerts.push({
                    type: 'danger',
                    msg: 'Something wrong happened while loadingUser total users.'
                });
            })
    };
    $scope.loadTotalFigures = function () {
        return FBUserService.GetFBTotals()
            .then(function (FBTotals) {
                $scope.totalShares = FBTotals.TotalShares;
            })
            .catch(function () {
                $scope.alerts.push({
                    type: 'danger',
                    msg: 'Something wrong happened while loadingUser total users.'
                });
            })
    };


    $scope.closeAlert = function (index) {
        $scope.AnalticsAlerts.splice(index, 1);
    };
    $scope.loadTotalFigures();
    $scope.loadTotalFbUsers();
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.login = true;

    var chartDataUser = [];
    var chartDataSession = [];

    $scope.generateChartData = function() {
        var firstDate = new Date();
        firstDate.setDate(firstDate.getDate() - 1500);
        firstDate.setHours(0, 0, 0, 0);

        for (var i = 0; i < 1500; i++) {
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + i*3);

            var a1 = Math.round(Math.random() * (40 + i)) + 100 + i;
            var b1 = Math.round(Math.random() * (1000 + i)) + 500 + i * 2;

            var a2 = Math.round(Math.random() * (100 + i)) + 200 + i;
            var b2 = Math.round(Math.random() * (1000 + i)) + 600 + i * 2;

            chartDataUser.push({
                Date: newDate,
                Data: a1,
                volume: b1
            });
            chartDataSession.push({
                Date: newDate,
                Data: a2,
                volume: b2
            });
        }
    }

    $scope.createUserChart = function() {
        var chart = new AmCharts.AmStockChart();

        // DATASETS //////////////////////////////////////////
        // create data sets first
        var dataSet1 = new AmCharts.DataSet();
        dataSet1.title = "users";
        dataSet1.fieldMappings = [{
            fromField: "Data",
            toField: "Data"
        }, {
            fromField: "volume",
            toField: "volume"
        }];
        dataSet1.dataProvider = chartDataUser;
        dataSet1.categoryField = "Date";
        // set data sets to the chart
        chart.dataSets = [dataSet1];

        // PANELS ///////////////////////////////////////////
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = false;
        stockPanel1.title = "Value";
        stockPanel1.percentHeight = 70;

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "Data";
        graph1.comparable = true;
        graph1.compareField = "Data";
        graph1.bullet = "round";
        graph1.bulletBorderColor = "#00ff00";
        graph1.bulletBorderAlpha = 1;
        graph1.balloonText = "[[title]]:<b>[[value]]</b>";
        graph1.compareGraphBalloonText = "[[title]]:<b>[[value]]</b>";
        graph1.compareGraphBullet = "round";
        graph1.compareGraphBulletBorderColor = "#00ff00";
        graph1.compareGraphBulletBorderAlpha = 1;
        stockPanel1.addStockGraph(graph1);

        // create stock legend
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.periodValueTextComparing = "[[percents.value.close]]%";
        stockLegend1.periodValueTextRegular = "[[value.close]]";
        stockPanel1.stockLegend = stockLegend1;


        // second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "Data";
        stockPanel2.percentHeight = 30;
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "Data";
        graph2.type = "column";
        graph2.showBalloon = false;
        graph2.fillAlphas = 1;
        stockPanel2.addStockGraph(graph2);

        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.periodValueTextRegular = "[[value.close]]";
        stockPanel2.stockLegend = stockLegend2;

        // set panels to the chart
        // chart.panels = [stockPanel1, stockPanel2];

        chart.panels = [stockPanel1];

        // OTHER SETTINGS ////////////////////////////////////
        var sbsettings = new AmCharts.ChartScrollbarSettings();
        sbsettings.graph = graph1;
        sbsettings.updateOnReleaseOnly = false;
        chart.chartScrollbarSettings = sbsettings;

        // CURSOR
        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        chart.chartCursorSettings = cursorSettings;


        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new  AmCharts.PeriodSelector();
        periodSelector.position = "left";
        periodSelector.periods = [{
            period: "DD",
            count: 7,
            label: "1 week"
        }, {
            period: "MM",
            selected: true,
            count: 1,
            label: "1 month"
        }, {
            period: "YYYY",
            count: 1,
            label: "1 year"
        }, {
            period: "YTD",
            label: "YTD"
        }, {
            period: "MAX",
            label: "MAX"
        }];
        // chart.periodSelector = periodSelector;


        // DATA SET SELECTOR
        var dataSetSelector = new AmCharts.DataSetSelector();
        dataSetSelector.position = "left";
        // chart.dataSetSelector = dataSetSelector;

        chart.write('chart-user');
    }
    $scope.createSessionChart = function() {
        var chart = new AmCharts.AmStockChart();

        // DATASETS //////////////////////////////////////////
        // create data sets first
        var dataSet1 = new AmCharts.DataSet();
        dataSet1.title = "sessions";
        dataSet1.fieldMappings = [{
            fromField: "Data",
            toField: "Data"
        }, {
            fromField: "volume",
            toField: "volume"
        }];
        dataSet1.dataProvider = chartDataSession;
        dataSet1.categoryField = "Date";
        // set data sets to the chart
        chart.dataSets = [dataSet1];

        // PANELS ///////////////////////////////////////////
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = false;
        stockPanel1.title = "Value";
        stockPanel1.percentHeight = 70;

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "Data";
        graph1.comparable = true;
        graph1.compareField = "Data";
        graph1.bullet = "round";
        graph1.colors = ["#00ff00"];
        graph1.balloonText = "[[title]]:<b>[[value]]</b>";

        graph1.compareGraphBalloonText = "[[title]]:<b>[[value]]</b>";
        graph1.compareGraphBullet = "round";
        graph1.compareGraphBulletBorderColor = "#00ff00";
        graph1.compareGraphBulletBorderAlpha = 1;
        stockPanel1.addStockGraph(graph1);

        // create stock legend
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.periodValueTextComparing = "[[percents.value.close]]%";
        stockLegend1.periodValueTextRegular = "[[value.close]]";
        stockPanel1.stockLegend = stockLegend1;


        // second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "Data";
        stockPanel2.percentHeight = 30;
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "Data";
        graph2.type = "column";
        graph2.showBalloon = false;
        graph2.fillAlphas = 1;
        stockPanel2.addStockGraph(graph2);

        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.periodValueTextRegular = "[[value.close]]";
        stockPanel2.stockLegend = stockLegend2;

        // set panels to the chart
        // chart.panels = [stockPanel1, stockPanel2];
        chart.panels = [stockPanel1];

        // OTHER SETTINGS ////////////////////////////////////
        var sbsettings = new AmCharts.ChartScrollbarSettings();
        sbsettings.graph = graph1;
        sbsettings.updateOnReleaseOnly = false;
        chart.chartScrollbarSettings = sbsettings;

        // CURSOR
        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        chart.chartCursorSettings = cursorSettings;


        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new  AmCharts.PeriodSelector();
        periodSelector.position = "left";
        periodSelector.periods = [{
            period: "DD",
            count: 7,
            label: "1 week"
        }, {
            period: "MM",
            selected: true,
            count: 1,
            label: "1 month"
        }, {
            period: "YYYY",
            count: 1,
            label: "1 year"
        }, {
            period: "YTD",
            label: "YTD"
        }, {
            period: "MAX",
            label: "MAX"
        }];
        // chart.periodSelector = periodSelector;


        // DATA SET SELECTOR
        var dataSetSelector = new AmCharts.DataSetSelector();
        dataSetSelector.position = "left";
        // chart.dataSetSelector = dataSetSelector;

        chart.write('chart-session');
    }
    // new Morris.Line({
    //   // ID of the element in which to draw the chart.
    //   element: 'morris_bar', 
    //   // Chart data records -- each entry in this array corresponds to a point on
    //   // the chart.
    //   data: [
    //     { year: '2008', value: 20 },
    //     { year: '2009', value: 10 },
    //     { year: '2010', value: 5 },
    //     { year: '2011', value: 5 },
    //     { year: '2012', value: 20 }
    //   ],
    //   // The name of the data record attribute that contains x-values.
    //   xkey: 'year',
    //   // A list of names of data record attributes that contain y-values.
    //   ykeys: ['value'],
    //   // Labels for the ykeys -- will be displayed when you hover over the
    //   // chart.
    //   labels: ['Value']
    // });
    // new Morris.Line({
    //   // ID of the element in which to draw the chart.
    //   element: 'morris_bar1', 
    //   // Chart data records -- each entry in this array corresponds to a point on
    //   // the chart.
    //   data: [
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 50 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 50 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 50},
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
    //     { year: '1', value: 20 },
    //     { year: '2', value: 10 },
    //     { year: '3', value: 5 },
    //     { year: '4', value: 5 },
    //     { year: '5', value: 20 },
    //     { year: '6', value: 5 },
    //     { year: '7', value: 20 },
        
    //   ],
    //   // The name of the data record attribute that contains x-values.
    //   xkey: 'year',
    //   // A list of names of data record attributes that contain y-values.
    //   ykeys: ['value'],
    //   // Labels for the ykeys -- will be displayed when you hover over the
    //   // chart.
    //   labels: ['Value']
    // });
});