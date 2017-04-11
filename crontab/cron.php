<?php
/**
 * CRONTAB SCRIPT.
 */
require __DIR__ . '/../bootstrap.php';

if (isset($argv[1])) {
	$clz = $argv[1];
	if (is_subclass_of($clz, '\wulaphp\util\ICrontabJob')) {
		/* @var wulaphp\util\ICrontabJob $cls */
		$cls = new $clz();
		exit(intval($cls->run()));
	} else {
		echo "'{$clz}' is not a valid crontab job.\n";
		exit(1);
	}
} else {
	fire('crontab', time());
}
//that's all.
