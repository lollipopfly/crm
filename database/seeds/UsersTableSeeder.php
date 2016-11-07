<?php

// use App\Hash;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class UsersTableSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    DB::table('users')->delete(); // Очищаем записи в таблице
    $faker = Faker::create();
    // add admin
    DB::table('users')->insert([
      'name' => "Dom",
      'last_name' => "Sidoli",
      'initials' => "Sidoli",
      'job_title' => "Administrator",
      'bday' => $faker->dateTimeThisCentury,
      'country' => "United Kingdom",
      'city' => "London",
      'phone' => $faker->phoneNumber,
      'user_group' => "admin",
      'email' => "tima_scorpion@mail.ru",
      'password' => Hash::make('falloutunix1'),
      'created_at' => date("Y-m-d H:i:s"), //timestamps
      'updated_at' => date("Y-m-d H:i:s"), //timestamps
    ]);

    // add others users
    foreach (range(1,5) as $index) {
      DB::table('users')->insert([
        'name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'initials' => $faker->userName,
        'job_title' => "Driver",
        'bday' => $faker->dateTimeThisCentury,
        'country' => "United Kingdom",
        'city' => "London",
        'phone' => $faker->phoneNumber,
        'user_group' => "user",
        'email' => $faker->email,
        'password' => Hash::make('qwerty123'),
        'created_at' => date("Y-m-d H:i:s"), //timestamps
        'updated_at' => date("Y-m-d H:i:s"), //timestamps
      ]);
    }
  }
}
