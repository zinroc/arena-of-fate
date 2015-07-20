<?php
	echo "start";
    $conn = pg_connect("postgres://dbkats:sample@localhost:5432/maroon");
    echo $conn;
    echo "here";
?>
