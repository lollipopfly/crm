<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="utf-8">
    </head>
    <body>
      <h2>Verify Your Email Address</h2>

      <p>Thanks for creating an account.</p>
      <p>Please follow the link below to verify your email address</p>
      <p>
        <a href="{{ URL::to('user/confirm/' . $confirmation_code) }}">{{ URL::to('user/confirm/' . $confirmation_code) }}</a><br/>
      </p>

      <p>
        Your login details
        <br>
        E-mail: <a href="/compose?To={{ $email }}" rel="noopener">{{ $email }}</a>
        <br>
        Password: {{ $password }}
      </p>
    </body>
</html>
