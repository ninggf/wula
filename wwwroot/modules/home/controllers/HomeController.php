<?php
namespace home\controllers;

use home\classes\AbstractHomeController;

class HomeController extends AbstractHomeController {

	public function index() {
		$name = sess_get('name');

		return view(['nihao' => 'hello world from' . $name]);
	}

	public function set() {
		$_SESSION['name'] = 'leo ning';

		return 'ok';
	}
}

?>