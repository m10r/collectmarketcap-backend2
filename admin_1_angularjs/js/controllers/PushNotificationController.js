/* Setup FB users page controller */

  
angular.module('MetronicApp').controller('PushNotificationController', function ($rootScope, $scope, $q, $timeout, FBUserService) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components        
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.settings.layout.login = true;


    $scope.totalFbUsers = 0;

    $scope.averageUsersPerDay = 0;
    $scope.totalShares = 0;

    $scope.loadPageInfo = function () {
        if (!$scope.pageInfo) {
            return FBUserService.GetFBPagedSummary()
                .then(function (info) {
                    $scope.pageInfo = info;
                    $scope.totalFbUsers = info.Total;
                    return info;
                })
        } else {
            return $q.resolve($scope.pageInfo);
        }
    };

    $scope.loadTotalFigures = function () {
        return FBUserService.GetFBTotals()
                .then(function (FBTotals) {
                    $scope.averageUsersPerDay = FBTotals.NewFBUsers_DailyAverage;
                    $scope.totalShares = FBTotals.TotalShares;
                })
                .catch(function () {
                    $scope.alerts.push({
                        type: 'danger',
                        msg: 'Something wrong happened while loading total users.'
                    });
                })
    };
    $scope.loadPageInfo();
    $scope.loadTotalFigures();
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
});