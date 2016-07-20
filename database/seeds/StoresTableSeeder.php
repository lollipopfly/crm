<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class StoresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('stores')->delete(); // Очищаем записи в таблице
        $faker = Faker::create();
        foreach (range(1,10) as $index) {
            DB::table('stores')->insert([
                'name' => $faker->company,
                'address' => $faker->address,
                'phone' => $faker->phoneNumber,
                'email' => $faker->email,
                'owner_name' => $faker->name,
                'created_at' => date("Y-m-d H:i:s"), //timestamps
                'updated_at' => date("Y-m-d H:i:s"), //timestamps
            ]);
        }
    }
}
