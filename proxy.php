<?php
try {
    $service_url = 'http://ec2-107-23-128-76.compute-1.amazonaws.com:8089/';

    //not using $_POST since the content is raw
    //http://stackoverflow.com/questions/8893574/php-php-input-vs-post
    file_put_contents("logs.log", "");
    $curl_post_data = file_get_contents('php://input');
    if( empty(trim($curl_post_data)) ) {
        header("HTTP/1.1 418 I'm a teapot");
        return;
    }

    $curl = curl_init($service_url);

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); //we need it to echo
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
    logToFile("Executing request");
    $response = curl_exec($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE); //if 0, server not found
    logToFile("{$httpcode} recieved");
    curl_close($curl);
    if($httpcode>=200 && $httpcode<300) {
        echo $response;   //default code is 200
    } else {
        http_response_code( ($httpcode) ? $httpcode : 404 );
    }
}
catch(Exception $e) {
    logToFile( 'Message: ' .$e->getMessage() );
}
    logToFile("end");

    ///////////////
    //UTILITIES///
    /////////////
    function logToFile( $log ) {
        file_put_contents("logs.log", $log . PHP_EOL, FILE_APPEND);
    }

?>