import angular from 'angular';
import {getPaginationModel, ITEM_TYPES} from 'ultimate-pagination';

angular.module('ngUltimatePagination', []);

angular.module('ngUltimatePagination')
  .provider('ultimatePaginationTemplates', function() {
    var itemTypeToTemplateUrlMap = null;

    return {
      setItemTypeToTemplateUrlMap: setItemTypeToTemplateUrlMap,
      $get: $get
    };

    //////////

    function setItemTypeToTemplateUrlMap(_itemTypeToTemplateUrlMap_) {
      itemTypeToTemplateUrlMap = _itemTypeToTemplateUrlMap_
    }

    $get.$inject = ['$log']
    function $get($log) {
      return {
        getTemplateUrlByItemType: function(itemType) {
          var templateUrl;
          if (itemTypeToTemplateUrlMap) {
            templateUrl = itemTypeToTemplateUrlMap[itemType];
            if (templateUrl) {
              return templateUrl;
            } else {
              $log.error(`"itemTypeToTemplateUrlMap" does not have a value for item type: ${itemType}`);
            }
          } else {
            $log.error('"itemTypeToTemplateUrlMap" is not registered in "ultimatePaginationTemplatesProvider"');
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

  ctrl.onItemClick = function(item) {
    if (ctrl.currentPage !== item.value) {
      ctrl.currentPage = item.value;
      calculatePaginationModel();
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
    template: `
      <ng-include src="$ctrl.getItemTemplateUrl()"></ng-include>
    `,
    controller: UltimatePaginationItemController,
    bindings: {
      type: '<',
      value: '<',
      isActive: '<',
      onClick: '&'
    }
  });

UltimatePaginationItemController.$inject = ['ultimatePaginationTemplates'];
function UltimatePaginationItemController(ultimatePaginationTemplates) {
  var ctrl = this;

  ctrl.getItemTemplateUrl = function() {
    return ultimatePaginationTemplates.getTemplateUrlByItemType(ctrl.type);
  }
}
