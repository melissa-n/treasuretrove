<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="style/style.css">

<meta charset="UTF-8">
<title>Treasure Trove</title>
<script type="text/javascript" src="scripts/jquery-1_8_3.js"></script>
<link href="https://fonts.googleapis.com/css?family=Della+Respira|Pirata+One" rel="stylesheet">
</head>
<style>
	table{
		margin: auto;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    font-family: 'Pompiere', cursive;
    font-size: 30pt;
    font-weight: bold;

	}
</style>
<body>
	<h1><center>Leader Board</center></h1>

<?php

	$link = mysqli_connect('localhost', 'db_root', 'OEaZRsL3K0br4fRz', 'treasureTrove');

	// check connection
	if($link === false){
		die("ERROR: Could not connect. " . mysqli_connect_error());
	}
	$sql = "SELECT * FROM user";
	$result = mysqli_query($link, $sql);

	echo "<table>";
	echo "<tr><th>Player Name</th><th>Score</th></tr>";

	while($row = mysqli_fetch_array($result)) {
	    $player = $row['username'];
	    $score = $row['score'];
	    echo "<tr><td style='width: 200px;'>".$player."</td><td>".$score."</td></tr>";
	}

	echo "</table>";
mysqli_close($link);
?>

<form>
		<input id= "newgame" type="button" value="New Game" onclick="window.location.href='index.html'"/>
</form>
<form>
		<input id= "leaderboard" type="button" value="Back to Game" onclick="history.go(-1);return true;"/>
</form>
</body>
</html>
