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
            'name' => "Timur",
            'last_name' => "Karshiev",
            'initials' => "timskiy",
            'job_title' => "Administrator",
            'bday' => $faker->dateTimeThisCentury,
            'country' => $faker->country,
            'city' => $faker->city,
            'phone' => $faker->phoneNumber,
            'avatar' => "default.jpg",
            'user_group' => "admin",
            'email' => "tima_scorpion@mail.ru",
            'password' => Hash::make('falloutunix1'),
            'created_at' => date("Y-m-d H:i:s"), //timestamps
            'updated_at' => date("Y-m-d H:i:s"), //timestamps
        ]);

        // add others users
        foreach (range(1,10) as $index) {
            DB::table('users')->insert([
                'name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'initials' => $faker->userName,
                'job_title' => $faker->jobTitle,
                'bday' => $faker->dateTimeThisCentury,
                'country' => $faker->country,
                'city' => $faker->city,
                'phone' => $faker->phoneNumber,
                'avatar' => "default.jpg",
                'user_group' => "user",
                'email' => $faker->email,
                'password' => Hash::make('qwerty123'),
                'created_at' => date("Y-m-d H:i:s"), //timestamps
                'updated_at' => date("Y-m-d H:i:s"), //timestamps
            ]);
        }
    }
}
