import angular from 'angular';
import {getPaginationModel, ITEM_TYPES} from 'ultimate-pagination';

angular.module('ngUltimatePagination', []);

angular.module('ngUltimatePagination')
  .constant('DEFAULT_WRAPPER_TEMPALTE_URL', 'ng-ulatimate-pagination/default-wrapper.html');

angular.module('ngUltimatePagination')
  .run(addDefaultWrapperTemplateToTemplateCache);

addDefaultWrapperTemplateToTemplateCache.$inject = ['$templateCache', 'DEFAULT_WRAPPER_TEMPALTE_URL'];
function addDefaultWrapperTemplateToTemplateCache($templateCache, DEFAULT_WRAPPER_TEMPALTE_URL) {
  $templateCache.put(DEFAULT_WRAPPER_TEMPALTE_URL, '<div ultimate-pagination-transclude></div>');
}

angular.module('ngUltimatePagination')
  .provider('ultimatePaginationThemes', ultimatePaginationThemesProvider);

ultimatePaginationThemesProvider.$inject = [];
function ultimatePaginationThemesProvider() {
  var themes = Object.create(null);
  var defaultTheme = 'default';

  return {
    registerTheme: registerTheme,
    setDefaultTheme: setDefaultTheme,
    $get: ultimatePaginationThemes
  };

  //////////

  function registerTheme(themeName, theme) {
    themes[themeName] = theme;
  }

  function setDefaultTheme(_defaultTheme_) {
    defaultTheme = _defaultTheme_;
  }

  ultimatePaginationThemes.$inject = ['DEFAULT_WRAPPER_TEMPALTE_URL']
  function ultimatePaginationThemes(DEFAULT_WRAPPER_TEMPALTE_URL) {
    return {
      getItemTemplateUrl: getItemTemplateUrl,
      getWrapperTemplateUrl: getWrapperTemplateUrl
    };

    //////////

    function getItemTemplateUrl(themeName, itemType) {
      var resolvedThemeName = themeName || defaultTheme;
      var theme = _getTheme(resolvedThemeName);
      var templateUrl = theme.itemTypeToTemplateUrl && theme.itemTypeToTemplateUrl[itemType];
      if (templateUrl) {
        return templateUrl;
      } else {
        throw new Error(`Theme "${resolvedThemeName}" does not have a template url for item type "${itemType}"`);
      }
    }

    function getWrapperTemplateUrl(themeName) {
      var resolvedThemeName = themeName || defaultTheme;
      var theme = _getTheme(resolvedThemeName);
      return theme.wrapperTemplateUrl || DEFAULT_WRAPPER_TEMPALTE_URL;
    }

    function _getTheme(themeName) {
        var theme = themes[themeName];
        if (theme) {
          return theme;
        } else {
          throw new Error(`Theme "${themeName}" is not registered in "ultimatePaginationThemesProvider"`);
        }
    }
  }
}


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

angular.module('ngUltimatePagination')
  .component('ultimatePaginationWrapper', {
    template: '<ng-include src="$ctrl.getWrapperTemplateUrl()"></ng-include>',
    transclude: true,
    controller: UltimatePaginationWrapperController,
    bindings: {
      theme: '<'
    }
  });

UltimatePaginationWrapperController.$inject = ['$transclude', 'ultimatePaginationThemes'];
function UltimatePaginationWrapperController($transclude, ultimatePaginationThemes) {
  var ctrl = this;

  ctrl.getWrapperTemplateUrl = function() {
    return ultimatePaginationThemes.getWrapperTemplateUrl(ctrl.theme);
  }

  ctrl.transclude = $transclude;
}

angular.module('ngUltimatePagination')
  .directive('ultimatePaginationTransclude', ultimatePaginationTranscludeDirective);

ultimatePaginationTranscludeDirective.$inject = [];
function ultimatePaginationTranscludeDirective() {
  return {
    restrict: 'EA',
    require: '^^ultimatePaginationWrapper',
    link: ultimatePaginationTranscludeLink
  };

  //////////

  function ultimatePaginationTranscludeLink($scope, $element, $attrs, ultimatePaginationWrapperCtrl) {
    ultimatePaginationWrapperCtrl.transclude(ngTranscludeCloneAttachFn, null, '');


    function ngTranscludeCloneAttachFn(clone) {
      if (clone.length) {
        $element.empty();
        $element.append(clone);
      }
    }
  }
}

export default 'ngUltimatePagination';
