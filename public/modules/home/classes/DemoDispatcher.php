<?php

namespace home\classes;

use wulaphp\router\IURLDispatcher;
use wulaphp\mvc\view\JsonView;

class DemoDispatcher implements IURLDispatcher {
	public function dispatch($url, $router, $parsedInfo) {
		return new JsonView ( [ 'url' => $url,'info' => $parsedInfo ] );
	}
}

?>