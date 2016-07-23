<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class AuthTest extends TestCase
{

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserAuth()
    {
        $this->visit('/login')
            ->type('tima_scorpion@mail.ru', 'email')
            ->type('falloutunix1', 'password')
            ->press('Login')
            ->seePageIs('/');
    }
}
