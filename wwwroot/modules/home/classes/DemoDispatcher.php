<?php

namespace home\classes;

use wulaphp\mvc\view\JsonView;
use wulaphp\router\IURLDispatcher;

class DemoDispatcher implements IURLDispatcher {
	public function dispatch($url, $router, $parsedInfo) {
		return new JsonView (['url' => $url, 'info' => $parsedInfo]);
	}
}

?>