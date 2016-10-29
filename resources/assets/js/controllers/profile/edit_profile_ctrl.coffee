EditProfileCtrl = ($http, $state, Upload) ->
  vm = this

  $http.get('/api/profile/edit')
    .then (response) ->
      vm.user = response.data
      vm.user.remove_avatar = null
      if vm.user.avatar == 'default_avatar.jpg'
        vm.user.avatar = '/images/' + vm.user.avatar
      else
        vm.user.avatar = '/uploads/avatars/' + vm.user.avatar
      vm.avatar = vm.user.avatar # for delete_avatar directive
    , (error) ->
      vm.error = error.data

  vm.update = () ->
    avatar = vm.user.avatar
    if vm.user.avatar == '/images/default_avatar.jpg'
      vm.user.avatar = 'default_avatar.jpg'
      avatar = 'default_avatar.jpg'
    vm.data =
      avatar: avatar
      remove_avatar: vm.user.remove_avatar
      name: vm.user.name
      last_name: vm.user.last_name
      initials: vm.user.initials
      bday: vm.user.bday
      email: vm.user.email
      phone: vm.user.phone
      job_title: vm.user.job_title
      country: vm.user.country
      city: vm.user.city

    Upload.upload(
      url: '/api/profile/' + vm.user.id
      method: 'Post'
      data: vm.data
    ).then ((resp) ->
      $state.go 'profile', { flashSuccess: 'Profile updated!' }
    ), ((error) ->
      vm.error = error.data
      console.log(vm.error);
      return
    )

  return

'use strict'
angular
  .module('app')
  .controller('EditProfileCtrl', EditProfileCtrl)