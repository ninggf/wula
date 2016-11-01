<?php
/**
 *
 * User: Leo Ning.
 * Date: 18/10/2016 18:04
 */

namespace home\controllers;

use wulaphp\mvc\controller\Controller;

class TestController extends Controller {
	public function index() {
		return view('index', ['nihao' => 'hello world']);
	}
}