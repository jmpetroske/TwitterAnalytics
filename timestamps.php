<?php
	error_reporting(E_ALL);
	ini_set("display_errors", "1");
	
	if(!isset($_GET["handle"]) || !isset($_GET["tweetMultiplier"])){
		header("HTTP/1.1 422");
		die("required GET parameter missing");
	}

	$MAX_TWEET_MULTIPLIER = 15;
	$tweetMultiplier = $_GET["tweetMultiplier"];
	if ($tweetMultiplier < 1){
		$tweetMultiplier = 1;
	} elseif ($tweetMultiplier > $MAX_TWEET_MULTIPLIER){
		$tweetMultiplier = $MAX_TWEET_MULTIPLIER;
	}
	$handle = $_GET["handle"];		

	require("twitteroauth/autoload.php");
	use Abraham\TwitterOAuth\TwitterOAuth; 
	
	
	/* authinfo.json MUST have twitter api credentals stored in it */
	$authinfo = json_decode(file_get_contents("authinfo.json"));
	$connection = new TwitterOAuth($authinfo->CONSUMER_KEY,
					$authinfo->CONSUMER_SECRET,
					$authinfo->accessToken,
					$authinfo->accessTokenSecret);
	$query = array("screen_name" => $handle, "count" => "200");
	$count = 0;
	$timestamps = array();
	do {
		$results = $connection->get("statuses/user_timeline", $query);
		if (count($results) == 0){
			break;
		}
		$minID = $results[0]->id; 
        foreach($results as $status){
            $timestamps[] = strtotime($status->created_at);
			if ($status->id < $minID){
				$minID = $status->id;
			}
        }
		$count++;
		$query["max_id"] = $minID - 1;	
	} while ($count < $tweetMultiplier); 
	print(json_encode($timestamps));
?>
