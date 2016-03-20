<?php
    //$carUris = $_POST["uri"];
    //$service_url = 'http://localhost:8089/';
    $service_url = 'http://vm.ik.bme.hu:12412/';
    $curl = curl_init($service_url);
    
    //not using $_POST since the content is raw
    //http://stackoverflow.com/questions/8893574/php-php-input-vs-post
    $curl_post_data = file_get_contents('php://input');
    //foreach($carUris as $carUri){
    //        $curl_post_data += $car+"\n";
    //}
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); //we need it to echo
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
    $response = curl_exec($curl); 
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE); //if 0, server not found
    curl_close($curl);
    if($httpcode>=200 && $httpcode<300) {
        echo $response;   //default code is 200
    } else {
        http_response_code( ($httpcode) ? $httpcode : 404 );
    }
?>