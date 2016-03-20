<?php
//ini_set("error_log", "logs.log");

function getAnswer($episode, $answerLetter, $manager) {
    logToFile("getAnswer start episode: $episode answerLetter: $answerLetter");
    $query = new MongoDB\Driver\Query( array('Episode' => intval($episode) ) );
    $cursor = $manager ->executeQuery('heroku_6czfjjnr.answer', $query);
    $documentArray = $cursor -> toArray();
    logToFile("Answer is " + $documentArray[0]->$answerLetter);
    return $documentArray[0]->$answerLetter;
}

function getStoryText( $episode, $manager) {
    $query = new MongoDB\Driver\Query( array('Episode' => intval($episode) ), array("Title", "Content" ) );
    $cursor = $manager ->executeQuery('heroku_6czfjjnr.story', $query);
    $documentArray = $cursor -> toArray();
    logToFile( "Story " + $documentArray[0]);
    return json_encode( $documentArray[0] );
}


/////////////
/////MAIN///
///////////
file_put_contents("logs.log", "");
try{
    $manager = new MongoDB\Driver\Manager( "mongodb://wodonline:Wod0nlin3@ds013559.mlab.com:13559/heroku_6czfjjnr" );
    logToFile( "Manager created ");
    if( checkEpisode($_GET["answer"]) ) {
        logToFile("Getting answer ");
        $answerLetter = whiteListAnswerLetter($_GET['answerLetter']);
        if( $answerLetter != false ) {
            echo getAnswer( $_GET["answer"], $answerLetter,$manager);
        }
    } elseif( checkEpisode($_GET["story"]) ) {
        logToFile("Getting story");
        echo getStoryText( $_GET["story"], $manager);
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

function checkEpisode($episode) {
    logToFile("Check episode start $episode");
    if( empty($episode) ) {
        return false;
    } elseif ( 100 < intval($episode) || 0 > intval($episode) ) {
        http_response_code( 400 );
        return false;
    }
    return true;
}

function whiteListAnswerLetter($answerLetter) {
    logToFile("whiteListAnswerLetter start with letter $answerLetter");
    if( preg_match("/^[A-D]/", $answerLetter) ) {
        return substr($answerLetter, 0, 1);
    } else {
        http_response_code( 500 );
        return false;
    }
}
?>