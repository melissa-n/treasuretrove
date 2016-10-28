<?php
	//http://www.tutorialrepublic.com/php-tutorial/php-mysql-insert-query.php
	$link = mysqli_connect('localhost', 'db_root', 'OEaZRsL3K0br4fRz', 'treasureTrove');
	
	// check connection
	if($link === false){
		die("ERROR: Could not connect. " . mysqli_connect_error());
	}
	
	// escape user inputs for security (userID is name in html)
	$user_name = mysqli_real_escape_string($link, $_POST['input1']);
	
	// attempt insert query execution
	
	$sql = "INSERT INTO user (username) VALUES ('".$user_name."')";
	if(mysqli_query($link, $sql)){
		header( 'Location: game.html' );
		exit;
	} 
		else{
			echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
	}
	
	//close connection
	mysqli_close($link);
?>

