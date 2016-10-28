<?php

	$link = mysqli_connect('localhost', 'db_root', 'OEaZRsL3K0br4fRz', 'treasureTrove');

	// check connection
	if($link === false){
		die("ERROR: Could not connect. " . mysqli_connect_error());
	}

	// escape user inputs for security (userID is name in html)
	$categoryName = mysqli_real_escape_string($link, $_POST['categoryName']);
	$keySearch = mysqli_real_escape_string($link, $_POST['searchTerm1']);
	$numTreasure = mysqli_real_escape_string($link, $_POST['numberofTreasures']);
	$gameSize = mysqli_real_escape_string($link, $_POST['gameSize']);
	$timeLimit = mysqli_real_escape_string($link, $_POST['timeLimit']);

	// attempt insert query execution

	$sql = "INSERT INTO customgame (category, keySearch, numTreasure, gameSize, timeLimit) VALUES ('".$categoryName."', '".$keySearch."', '".$numTreasure."', '".$gameSize."', '".$timeLimit."')";
	if(mysqli_query($link, $sql)){
		header( 'Location: game.html' );
		exit;
	} else {
			echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
	}

	//close connection
	mysqli_close($link);
?>
