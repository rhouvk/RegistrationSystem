<?php

return [
    'default' => 'main',

    'connections' => [
        'main' => [
            'salt' => env('APP_KEY'),   // Use Laravel app key
            'length' => 10,              // Desired hash length
            'alphabet' => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        ],
    ],
];
