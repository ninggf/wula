<?php
namespace home\controllers;

use wulaphp\io\Response;
use wulaphp\mvc\controller\Controller;
use wulaphp\router\Router;

class IndexController extends Controller {
	public function beforeRun($action, $refMethod) {
		parent::beforeRun($action, $refMethod);
		if (!Router::is('index.html')) {
			//不能出现多个url对应一个相同的页面.
			Response::respond(404);
		}
	}

	public function index() {
		// 可以按需修改
		return template('index.tpl', ['nihao' => 'Hello wula']);
	}
}