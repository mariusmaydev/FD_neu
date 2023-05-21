<?php
    session_start();
    require_once __DIR__ . '../../../vendor/autoload.php';
    require_once __DIR__ . '/CORE.php';

    $provider = new \League\OAuth2\Client\Provider\Google(
        [
            'clientId' => '926468304364-5gta4d1gu177lpqbn4lok5ngph0ja494.apps.googleusercontent.com',
            'clientSecret' => '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',
            'redirectUri' => 'http://localhost/fd/resources/HTML/public/login/loginSuccess.php',
        ]
    )
?>