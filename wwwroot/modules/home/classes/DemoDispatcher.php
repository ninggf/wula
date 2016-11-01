<?php

namespace home\classes;

use wulaphp\router\IURLDispatcher;

class DemoDispatcher implements IURLDispatcher {
	public function dispatch($url, $router, $parsedInfo) {
		return template('index.tpl', ['nihao' => 'Hello wula']);
	}
}
