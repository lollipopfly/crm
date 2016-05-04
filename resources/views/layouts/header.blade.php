<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Crm</title>
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-hQpvDQiCJaD2H465dQfA717v7lu5qHWtDbWNPvaTJ0ID5xnPUlVXnKzq7b8YUkbN" crossorigin="anonymous">
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="{!! asset('build/css/style.css') !!}">
</head>
<body>
<header class="header">
    <div class="header-left">
        <a href="/" class="logo">Logo Type</a>
    </div>

    <div class="user-status">
        <span class="user-status__text__online">online</span>
    </div>

    <div class="header-right">
        <div class="header__block">
            <div class="header__block__item">
                <div class="header__users"></div>
            </div>
            <div class="header__block__item">
                <div class="header__messages"></div>
            </div>
            <div class="header__block__item">
                <div class="header__user">User</div>
            </div>
        </div>
    </div>
</header>

<aside class="aside">
    <div class="aside__user">
        <img src="{!! asset('images/avatar.jpg') !!}" class="aside__user__avatar__img">
        <div class="aside__user__info">
            <h3 class="aside__user__info__name">Victoria Baker</h3>
            <div class="aside__user__info__location">
                <span class="aside__user__info__location__icon"></span>
                <div class="aside__user__info__location__text">Santa Ana, CA</div>
            </div>
        </div>
        <span class="aside__user__settings__icon"></span>
    </div>

    <div class="aside__nav">
        <div class="aside__nav__item">
            <span class="aside__nav__item__icon aside__nav__item__icon__home"></span>
            <h3 class="aside__nav__item__text">Home</h3>
        </div>
        <div class="aside__nav__item">
            <span class="aside__nav__item__icon aside__nav__item__icon__accounts"></span>
            <h3 class="aside__nav__item__text">Accounts</h3>
        </div>
        <div class="aside__nav__item">
            <span class="aside__nav__item__icon aside__nav__item__icon__contacts"></span>
            <h3 class="aside__nav__item__text">Contacts</h3>
        </div>
        <div class="aside__nav__item">
            <span class="aside__nav__item__icon aside__nav__item__icon__tasks"></span>
            <h3 class="aside__nav__item__text">Tasks</h3>
        </div>
    </div>
</aside>

<div class="main">

