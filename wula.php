<?php
@ob_end_clean();
echo "\tchmod ( 'tmp', 0777 )\n";
flush();
chmod('tmp', 0777);
echo "\tchmod ( 'logs', 0777 )\n";
flush();
chmod('logs', 0777);
$appid = rand(1, 10000);
echo "\tgenerated appid: ", $appid, "\n";
flush();
$content = file_get_contents('bootstrap.php');
$content = str_replace("app1", "app" . $appid, $content);
file_put_contents('bootstrap.php', $content);
