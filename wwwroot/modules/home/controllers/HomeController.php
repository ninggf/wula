<?php
namespace home\controllers;

use home\classes\AbstractHomeController;

class HomeController extends AbstractHomeController {

	public function index() {
		return view(['nihao' => 'Hello wula!']);
	}
}
