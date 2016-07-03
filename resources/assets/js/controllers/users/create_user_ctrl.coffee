app.controller 'createUserCtrl', ["$scope", "lodash", ($scope, lodash) ->
  $scope.passInput = document.querySelector('.password-input')
  $scope.chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+
                  <>ABCDEFGHIJKLMNOP1234567890'

  $scope.randomPass = () ->
    pass = ''
    passLength = lodash.random(6,15)
    x = 0

    while x < passLength
      i = Math.floor(Math.random() * $scope.chars.length)
      pass += $scope.chars.charAt(i)
      x++

    return pass

  $scope.generatePass = ->
    $scope.passInput.setAttribute('value', $scope.randomPass())
]