<?php
use wulaphp\app\App;
define ( 'WWWROOT', __DIR__ . DIRECTORY_SEPARATOR );
require WWWROOT . '../bootstrap.php';
App::run ();
//that is all.