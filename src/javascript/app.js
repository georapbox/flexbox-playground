(function () {
  'use strict';

  var app = angular.module('flexboxDemoApp', ['ngMaterial']);

  // Declare the AppCtrl controller
  app.config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider
      .theme('default').dark()
      .primaryPalette('orange')
      .accentPalette('orange', {
        default: '700'
      });
  }]);

  app.controller('AppCtrl', ['$scope', '$timeout', '$mdDialog', function ($scope, $timeout, $mdDialog) {
    $scope.parent = {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch'
    };

    $scope.children_width = 20; // %

    $scope.children  = [];

    var addChild = function (order, flexGrow, flexShrink, flexBasis, alignSelf) {
      $scope.children.push({
        order: order || 0,
        flexGrow: flexGrow || 0,
        flexShrink: flexShrink || 1,
        flexBasis: flexBasis || 'auto',
        alignSelf: alignSelf || 'auto'
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
          '<md-dialog-content>' +
            '<md-tabs md-dynamic-height>' +
              '<md-tab label="CSS">' +
                '<md-content>' +
                  '<pre style="margin:0;"><code style="padding:15px;" class="css">' + generateCSS($scope.parent, $scope.children) + '</code></pre>' +
                '</md-content>' +
              '</md-tab>' +
              '<md-tab label="SCSS (Compass mixins)">' +
                '<md-content>' +
                  '<pre style="margin:0;"><code style="padding:15px;" class="scss">' + generateSCSS($scope.parent, $scope.children) + '</code></pre>' +
                '</md-content>' +
              '</md-tab>' +
              '<md-tab label="HTML">' +
                '<md-content>' +
                  '<pre style="margin:0;"><code style="padding:15px;" class="html">' + generateHTML($scope.children) + '</code></pre>' +
                '</md-content>' +
              '</md-tab>' +
            '</md-tabs>' +
          '</md-dialog-content>' +
        '</md-dialog>',
        onShowing: function () {
          $timeout(function () {
            [].forEach.call(document.querySelectorAll('code'), function (c) {
              hljs.highlightBlock(c);
            });
          }, 0);
        }
      });
    };

    function generateHTML(children) {
      var html = '&lt;div class="flex-container"&gt;\n';

      children.forEach(function (child, index) {
        html += '    &lt;div class="flex-item"&gt;Item ' + (++index) + '&lt;/div&gt;\n';
      });

      html += '&lt;/div&gt;';

      return html;
    }

    function generateCSS(parent, children) {
      var parentCSS,
        childrenCSS;

      parentCSS = '/* Parent */\n' +
        '.flex-container {\n' +
        '    ' + 'display: flex;\n' +
        '    ' + 'align-content: ' + parent.alignContent + ';\n' +
        '    ' + 'align-items: ' + parent.alignItems + ';\n' +
        '    ' + 'flex-direction: ' + parent.flexDirection + ';\n' +
        '    ' + 'flex-wrap: ' + parent.flexWrap + ';\n' +
        '    ' + 'justify-content: ' + parent.justifyContent + ';\n' +
        '}\n\n';

      childrenCSS = '/* Children */\n';

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

    function generateSCSS(parent, children) {
      var parentSCSS, childrenSCSS;

      parentSCSS = '/* Parent */\n' +
        '.flex-container {\n' +
        '    ' + '@include display(flex);\n' +
        '    ' + '@include align-content(' + parent.alignContent + ');\n' +
        '    ' + '@include align-items(' + parent.alignItems + ');\n' +
        '    ' + '@include flex-direction(' + parent.flexDirection + ');\n' +
        '    ' + '@include flex-wrap(' + parent.flexWrap + ');\n' +
        '    ' + '@include justify-content(' + parent.justifyContent + ');\n' +
        '}\n\n';

      childrenSCSS = '/* Children */\n';
      childrenSCSS += '.flex-item {\n';

      children.forEach(function (child, index) {
        childrenSCSS += '' +
          '    &:nth-child(' + (++index) + ') {\n' +
          '        ' + '@include order(' + child.order + ');\n' +
          '        ' + '@include flex-grow(' + child.flexGrow + ');\n' +
          '        ' + '@include flex-shrink(' + child.flexShrink + ');\n' +
          '        ' + '@include flex-basis(' + child.flexBasis + ');\n' +
          '        ' + '@include align-self(' + child.alignSelf + ');\n' +
          '    }\n';
      });

      childrenSCSS += '}';

      return parentSCSS + childrenSCSS;
    }
  }]);
}());
