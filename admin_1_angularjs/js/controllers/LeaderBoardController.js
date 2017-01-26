/* Setup FB users page controller */

  
angular.module('MetronicApp').controller('LeaderBoardController', function ($rootScope, $scope, LeaderBoardService, $q, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components        
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.login = true;
    $scope.pointsPerDay = 0;
    $scope.pointsPerUser = 0;
    $scope.genImg = function(rank){
        return "assets/img/leaderboard/leaderboard_"+rank+"_badge_ic.png";
    }
    // function leaderProvider(lastday = 7){
    //     this.monthlyProvider = [];
    //     this.monthlyAlerts = [];
    //     this.monthlyLoading = true;
    //     this.monthlyTotalLeaders = 0;
    //     this.monthlyLoadPageInfo = function () {
    //         if (!this.monthlyPageInfo) {
    //             return LeaderBoardService.GetLeaderSummary(lastday)
    //                 .then(function (info) {
    //                     this.monthlyPageInfo = info;
    //                     this.monthlyTotalLeaders = info.Total;
    //                     return info;
    //                 })
    //         } else {
    //             return $q.resolve($scope.monthlyPageInfo);
    //         }
    //     };

    //     this.monthlyGetPage = function () {
    //         return parseInt(this.monthlyProvider.length / 50) + 1;
    //     };

    //     this.monthlyIsLastPage = function () {
    //         return this.monthlyPageInfo && this.monthlyGetPage() > this.monthlyPageInfo.Pages;
    //     };

    //     this.monthlyLoadMore = function () {
    //         return this.monthlyLoadPageInfo()
    //             .then(function (monthlyPageInfo) {
    //                 if (!this.monthlyIsLastPage()) {
    //                     this.monthlyLoading = true;
    //                     return LeaderBoardService.GetLeaderPageData(monthlyPageInfo.RequestID, this.monthlyGetPage())
    //                         .then(function (users) {
    //                             if(this.monthlyGetPage()==1){
    //                                 users[4].Rank = 0;
    //                             }

    //                             $scope.monthlyP = users;
    //                             $scope.monthlyProvider.monthlyProvider.splice.apply(this.monthlyProvider, [this.monthlyProvider.length, 0].concat(users));
    //                         })
    //                 }
    //             })
    //             .then(function () {
    //                 this.monthlyLoading = false;
    //                 $timeout($scope.loadSVG, 100);
    //             })
    //             .catch(function () {
    //                 this.monthlyAlerts.push({
    //                     type: 'danger',
    //                     msg: 'Something wrong happened while loadingmonthly more users, try again later'
    //                 });
    //                 this.monthlyLoading = false;
    //             })
    //     };


    //     this.closeAlert = function (index) {
    //         $scope.monthlyAlerts.splice(index, 1);
    //     };

    //     this.monthlyLoadMore();
    // }


    $scope.weeklyProvider = [];
    $scope.weeklyAlerts = [];
    $scope.weeklyLoading = true;
    $scope.weeklyTotalLeaders = 0;
    $scope.weeklyLoadPageInfo = function () {
        if (!$scope.weeklyPageInfo) {
            return LeaderBoardService.GetLeaderSummary(7)
                .then(function (info) {
                    $scope.weeklyPageInfo = info;
                    $scope.weeklyTotalLeaders = info.Total;
                    return info;
                })
        } else {
            return $q.resolve($scope.weeklyPageInfo);
        }
    };

    $scope.weeklyGetPage = function () {
        return parseInt($scope.weeklyProvider.length / 50) + 1;
    };

    $scope.weeklyIsLastPage = function () {
        return $scope.weeklyPageInfo && $scope.weeklyGetPage() > $scope.weeklyPageInfo.Pages;
    };

    $scope.weeklyLoadMore  = function () {
        return $scope.weeklyLoadPageInfo()
            .then(function (weeklyPageInfo) {
                if (!$scope.weeklyIsLastPage()) {
                    $scope.weeklyLoading = true;
                    return LeaderBoardService.GetLeaderPageData(weeklyPageInfo.RequestID, $scope.weeklyGetPage())
                        .then(function (users) {

                            $scope.weeklyProvider.splice.apply($scope.weeklyProvider, [$scope.weeklyProvider.length, 0].concat(users));
                        })
                }
            })
            .then(function () {
                $scope.weeklyLoading = false;
                $timeout($scope.loadSVG, 100);
            })
            .catch(function () {
                $scope.weeklyAlerts.push({
                    type: 'danger',
                    msg: 'Something wrong happened while loadingWeekly more users, try again later'
                });
                $scope.weeklyLoading = false;
            })
    };


    $scope.closeAlert = function (index) {
        $scope.weeklyAlerts.splice(index, 1);
    };

    $scope.weeklyLoadMore();


    $scope.monthlyProvider = [];
    $scope.monthlyAlerts = [];
    $scope.monthlyLoading = true;
    $scope.monthlyTotalLeaders = 0;
    $scope.monthlyLoadPageInfo = function () {
        if (!$scope.monthlyPageInfo) {
            return LeaderBoardService.GetLeaderSummary(30)
                .then(function (info) {
                    $scope.monthlyPageInfo = info;
                    $scope.monthlyTotalLeaders = info.Total;
                    return info;
                })
        } else {
            return $q.resolve($scope.monthlyPageInfo);
        }
    };

    $scope.monthlyGetPage = function () {
        return parseInt($scope.monthlyProvider.length / 50) + 1;
    };

    $scope.monthlyIsLastPage = function () {
        return $scope.monthlyPageInfo && $scope.monthlyGetPage() > $scope.monthlyPageInfo.Pages;
    };

    $scope.monthlyLoadMore    = function () {
        return $scope.monthlyLoadPageInfo()
            .then(function (monthlyPageInfo) {
                if (!$scope.monthlyIsLastPage()) {
                    $scope.monthlyLoading = true;
                    return LeaderBoardService.GetLeaderPageData(monthlyPageInfo.RequestID, $scope.monthlyGetPage())
                        .then(function (users) {
                            $scope.monthlyProvider.splice.apply($scope.monthlyProvider, [$scope.monthlyProvider.length, 0].concat(users));
                        })
                }
            })
            .then(function () {
                $scope.monthlyLoading = false;
                $timeout($scope.loadSVG, 100);
            })
            .catch(function () {
                $scope.monthlyAlerts.push({
                    type: 'danger',
                    msg: 'Something wrong happened while loadingmonthly more users, try again later'
                });
                $scope.monthlyLoading = false;
            })
    };


    $scope.closeAlert = function (index) {
        $scope.monthlyAlerts.splice(index, 1);
    };


    $scope.loadTotalFigures = function () {
        return LeaderBoardService.GetPointsTotal()
                .then(function (PointsTotals) {
                    $scope.pointsPerDay = PointsTotals.PointsPerDay;
                    $scope.pointsPerUser = PointsTotals.PointsPerUser;
                })
                .catch(function () {
                    $scope.alerts.push({
                        type: 'danger',
                        msg: 'Something wrong happened while loading total users.'
                    });
                })
    };

    $scope.monthlyLoadMore();
    $scope.loadTotalFigures();
    $scope.loadSVG = function(){
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
    } 
});