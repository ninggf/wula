<?php
@ob_end_clean ();
echo "\t\tchmod ( 'tmp', 0777 )\n";
flush ();
chmod ( 'tmp', 0777 );
$appid = rand ( 1, 10000000 );
echo "\t\tgenerated appid: ", $appid, "\n";
flush ();
$content = file_get_contents ( 'bootstrap.php' );
$content = str_replace ( "define ( 'APPID', 1 )", "define ( 'APPID', " . $appid . " )", $content );
file_put_contents ( 'bootstrap.php', $content );