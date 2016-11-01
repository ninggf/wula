<?php
/**
 *
 * User: Leo Ning.
 * Date: 19/10/2016 17:48
 */

namespace home\controllers;

use home\classes\AbstractHomeController;

class TestOkController extends AbstractHomeController {
	public function index() {
		return 'pk';
	}

	public function save($abc) {
		return 'save';
	}
}