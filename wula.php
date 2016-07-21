<?php
@ob_end_clean ();
echo "php wula.php\n";
echo "chmod ( 'tmp', 0777 )\n";
flush ();
chmod ( 'tmp', 0777 );
$appid = rand ( 1, 10000000 );
echo "generated appid: ", $appid, "\n";
flush ();
$content = file_get_contents ( 'bootstrap.php' );
$content = str_replace ( "define ( 'APPID', 1 )", "define ( 'APPID', " . $appid . " )", $content );
file_put_contents ( 'bootstrap.php', $content );