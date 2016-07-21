<?php
chmod ( 'tmp', '0777' );
$content = file_get_contents ( 'bootstrap.php' );
$content = str_replace ( "define ( 'APPID', 1 )", "define ( 'APPID', " . rand ( 1, 10000000 ) . " )", $content );
file_put_contents ( 'bootstrap.php', $content );