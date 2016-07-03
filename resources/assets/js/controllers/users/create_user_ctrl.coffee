app.controller 'createUserCtrl', ["$scope", "lodash", ($scope, lodash) ->
  $scope.passInput = document.querySelector('.password-input')
  $scope.chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+
                  <>ABCDEFGHIJKLMNOP1234567890'

  $scope.generatePass = () ->
    $scope.pass = ''
    passLength = lodash.random(6,15)
    x = 0

    while x < passLength
      i = Math.floor(Math.random() * $scope.chars.length)
      $scope.pass += $scope.chars.charAt(i)
      x++

    return $scope.pass
]