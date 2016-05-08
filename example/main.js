(function() {
  'use static';

  angular
    .module('ngUltimatePaginationExample', ['ngUltimatePagination'])
    .config(config)
    .run(run)
    .controller('MainController', MainController);

  config.$inject = ['ultimatePaginationThemesProvider'];
  function config(ultimatePaginationThemesProvider) {
    ultimatePaginationThemesProvider.registerTheme('basic', {
      PAGE: 'page.html',
      ELLIPSIS: 'ellipsis.html',
      FIRST_PAGE_LINK: 'first-page-link.html',
      PREVIOS_PAGE_LINK: 'previos-page-link.html',
      NEXT_PAGE_LINK: 'next-page-link.html',
      LAST_PAGE_LINK: 'last-page-link.html'
    });

    ultimatePaginationThemesProvider.setDefaultTheme('basic');
  }

  run.$inject = ['$templateCache'];
  function run($templateCache) {
    $templateCache.put('page.html', '<button ng-style="$ctrl.isActive ? {fontWeight: \'bold\'}: null" ng-click="$ctrl.onClick()">{{::$ctrl.value}}</button>');
    $templateCache.put('ellipsis.html', '<button ng-click="$ctrl.onClick()">...</button>');
    $templateCache.put('first-page-link.html', '<button ng-click="$ctrl.onClick()">First</button>');
    $templateCache.put('previos-page-link.html', '<button ng-click="$ctrl.onClick()">Prev</button>');
    $templateCache.put('next-page-link.html', '<button ng-click="$ctrl.onClick()">Next</button>');
    $templateCache.put('last-page-link.html', '<button ng-click="$ctrl.onClick()">Last</button>');
  }

  MainController.$inject = [];
  function MainController() {
    var vm = this;

    vm.currentPage = 1;
    vm.totalPages = 10;
    vm.onPageChange = onPageChange;

    //////////

    function onPageChange(newPage) {
      vm.currentPage = newPage;
    }
  }
}());
