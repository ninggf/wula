<?php
namespace home\controllers;

use wulaphp\mvc\controller\Controller;

class HomeController extends Controller {

	public function index() {
		return view(['nihao' => 'Hello wula from home module']);
	}
}
