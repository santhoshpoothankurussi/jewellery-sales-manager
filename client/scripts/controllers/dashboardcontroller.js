robs.controller('transactiontrend', ['$http','$scope','$rootScope', function ($http,$scope,$rootScope){
    $scope.chartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        series: ['Foo', 'Baz', 'Bar'],
        data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90],
            [42, 17, 28, 73, 50, 12, 68]
        ]
    };
}]);

angular.module("robs", ["chart.js"]).controller("MixedChartCtrl",
    function ($scope) {
        $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

        $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $scope.data = [
            [65, -59, 80, 81, -56, 55, -40],
            [28, 48, -40, 19, 86, 27, 90]
        ];
        $scope.datasetOverride = [
            {
                label: "Bar chart",
                borderWidth: 1,
                type: 'bar'
            },
            {
                label: "Line chart",
                borderWidth: 3,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                type: 'line'
            }
        ];
    });
