<?php

namespace home\classes;

use wulaphp\router\IURLDispatcher;

class DemoDispatcher implements IURLDispatcher {
	public function dispatch($url, $router, $parsedInfo) {
		if ($url == 'index.html') {
			return template('index.tpl', ['nihao' => 'Hello wula from index page']);
		}

		return null;
	}
}
