// Declare the flexboxDemoApp module and its dependency 'ngMaterial'
var app = angular.module('flexboxDemoApp', ['ngMaterial']);
// Declare the AppCtrl controller
app.
config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.
    theme('default').dark().
    accentPalette('orange', {
        default: '700',

    });
}]).
controller('AppCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
    $scope.parent = {
        flexDirection:  'row',
        flexWrap:       'nowrap',
        justifyContent: 'flex-start',
        alignItems:     'stretch',
        alignContent:   'stretch'
    };

    $scope.children_width = 50; // %

    $scope.children  = [];

    var addChild = function (order, flexGrow, flexShrink, flexBasis, alignSelf) {
        $scope.children.push({
            order:      order      || 0,
            flexGrow:   flexGrow   || 0,
            flexShrink: flexShrink || 1,
            flexBasis:  flexBasis  || 'auto',
            alignSelf:  alignSelf  || 'auto'
        });
    };

    var removeChild = function (index) {
        $scope.children.splice(index, 1);
    };

    $scope.addChild = addChild;
    $scope.removeChild = removeChild;

    for (var i = 0; i < 3; i++) {
        addChild();
    }

    $scope.showDialog = function ($event) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            clickOutsideToClose: true,
            template: '' +
            '<md-dialog flex="50" aria-label="List dialog">' +
            '    <md-dialog-content>' +
            '        <pre style="margin:0;"><code style="padding:15px;" class="css">' + generateCSS($scope.parent, $scope.children) + '</code></pre>' +
            '    </md-dialog-content>' +
            '</md-dialog>',
            onShowing: function () {
                $timeout(function () {
                    var code = document.querySelectorAll('code');
                    [].forEach.call(code, function (c) {
                        hljs.highlightBlock(c);
                    });
                }, 0);
            }
        });
    };

    $scope.closeDialog = function () {
        $mdDialog.cancel();
    };

    function generateCSS(parent, children) {
        var parentCSS,
            childrenCSS;

        parentCSS = '/* Parent CSS */\n' +
            '.flex-container {\n' +
            '    ' + 'display: flex;\n' +
            '    ' + 'align-content: ' + parent.alignContent + ';\n' +
            '    ' + 'align-items: ' + parent.alignItems + ';\n' +
            '    ' + 'flex-direction: ' + parent.flexDirection + ';\n' +
            '    ' + 'flex-wrap: ' + parent.flexWrap + ';\n' +
            '    ' + 'justify-content: ' + parent.justifyContent + ';\n' +
            '}\n\n';

        childrenCSS = '/* Children CSS */\n';

        children.forEach(function (child, index) {
            childrenCSS += '' +
                '.flex-item:nth-child(' + (++index) + ') {\n' +
                '    ' + 'order: ' + child.order + ';\n' +
                '    ' + 'flex-grow: ' + child.flexGrow + ';\n' +
                '    ' + 'flex-shrink: ' + child.flexShrink + ';\n' +
                '    ' + 'flex-basis: ' + child.flexBasis + ';\n' +
                '    ' + 'align-self: ' + child.alignSelf + ';\n' +
                '}\n\n';
        });

        return parentCSS + childrenCSS;
    }
}]);
