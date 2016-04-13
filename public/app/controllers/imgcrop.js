'use strict';

(() => {
  angular
    .module('app')
    .controller('ImgCropCtrl', ImgCrop);

  function ImgCrop($scope) {
    const vm = $scope;
    vm.myImage = '';
    vm.myCroppedImage = '';
    vm.cropType = 'circle';

    const handleFileSelect = function (evt) {
      const file = evt.currentTarget.files[0];
      const reader = new FileReader();
      reader.onload = (nEvt) => {
        vm.$apply((nVm) => {
          nVm.myImage = nEvt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
  }
})();
