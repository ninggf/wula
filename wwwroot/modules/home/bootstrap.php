<?php
namespace home;

use home\classes\DemoDispatcher;
use wulaphp\app\App;
use wulaphp\app\Module;
use wulaphp\router\Router;
use wulaphp\router\URLPrefixSupport;

trait HomeUrlPrefix {
	use URLPrefixSupport;

	public static function getURLPrefix() {
		return ['~', 'backend'];
	}
}

class HomeModule extends Module {
	use HomeUrlPrefix;

	public function getName() {
	}

	public function getDescription() {
	}

	public function getHomePageURL() {
	}

	/**
	 * @param Router $router
	 *
	 * @bind  router\registerDispatcher 1
	 */
	public static function onRouterRegisterDispatcher($router) {
		$router->register(new DemoDispatcher());
	}
}

App::register(new HomeModule());
