import angular from 'angular';
import {getPaginationModel, ITEM_TYPES} from 'ultimate-pagination';

angular.module('ngUltimatePagination', []);

angular.module('ngUltimatePagination')
  .provider('ultimatePaginationThemes', function() {
    var themes = Object.create(null);
    var defaultTheme = 'default';

    return {
      registerTheme: registerTheme,
      setDefaultTheme: setDefaultTheme,
      $get: $get
    };

    //////////

    function registerTheme(themeName, itemTypeToTemplateUrlMap) {
      themes[themeName] = itemTypeToTemplateUrlMap;
    }

    function setDefaultTheme(_defaultTheme_) {
      defaultTheme = _defaultTheme_;
    }

    $get.$inject = ['$log']
    function $get($log) {
      return {
        getItemTemplateUrl: function(themeName, itemType) {
          var templateUrl;
          var resolvedThemeName = themeName || defaultTheme;
          var itemTypeToTemplateUrlMap = themes[resolvedThemeName];
          if (itemTypeToTemplateUrlMap) {
            templateUrl = itemTypeToTemplateUrlMap[itemType];
            if (templateUrl) {
              return templateUrl;
            } else {
              $log.error(`Theme "${resolvedThemeName}" does not have a template url for item type "${itemType}"`);
            }
          } else {
            $log.error(`Theme "${resolvedThemeName}" is not registered in "ultimatePaginationThemesProvider"`);
          }
        }
      };
    }
  });


angular.module('ngUltimatePagination')
  .component('ultimatePagination', {
    template: `
      <ultimate-pagination-wrapper>
        <ultimate-pagination-item
          ng-repeat="item in $ctrl.paginationModel track by item.key"
          theme="$ctrl.theme"
          type="::item.type"
          value="::item.value"
          is-active="item.isActive"
          on-click="$ctrl.onItemClick(item)"
        ></ultimate-pagination-item>
      </ultimate-pagination-wrapper>
    `,
    controller: UltimatePaginationController,
    replace: true,
    bindings: {
      theme: '<',
      currentPage: '<',
      totalPages: '<',
      onChange: '&'
    }
  });

UltimatePaginationController.$inject = [];
function UltimatePaginationController() {
  var ctrl = this;
  ctrl.paginationModel = [];

  ctrl.$onInit = function() {
    calculatePaginationModel();
  };

  ctrl.$onChanges = function(changesObj) {
    if (changesObj.currentPage || changesObj.totalPages) {
      calculatePaginationModel();
    }
  };

  ctrl.onItemClick = function(item) {
    if (ctrl.currentPage !== item.value) {
      ctrl.onChange({$event: item.value});
    }
  }

  function calculatePaginationModel() {
    ctrl.paginationModel = getPaginationModel({
      currentPage: ctrl.currentPage,
      totalPages: ctrl.totalPages
    });
  }
}

angular.module('ngUltimatePagination')
  .component('ultimatePaginationItem', {
    template: '<ng-include src="$ctrl.getItemTemplateUrl()"></ng-include>',
    controller: UltimatePaginationItemController,
    bindings: {
      theme: '<',
      type: '<',
      value: '<',
      isActive: '<',
      onClick: '&'
    }
  });

UltimatePaginationItemController.$inject = ['ultimatePaginationThemes'];
function UltimatePaginationItemController(ultimatePaginationThemes) {
  var ctrl = this;

  ctrl.getItemTemplateUrl = function() {
    return ultimatePaginationThemes.getItemTemplateUrl(ctrl.theme, ctrl.type);
  }
}

export default 'ngUltimatePagination';
