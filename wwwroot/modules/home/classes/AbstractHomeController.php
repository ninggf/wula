<?php
/**
 *
 * User: Leo Ning.
 * Date: 18/10/2016 22:23
 */

namespace home\classes;

use home\HomeUrlPrefix;
use wulaphp\mvc\controller\Controller;
use wulaphp\mvc\controller\LayoutSupport;
use wulaphp\mvc\controller\SessionSupport;

class AbstractHomeController extends Controller {
	use HomeUrlPrefix, SessionSupport, LayoutSupport;
	protected $layout = 'home/views/index';

	//	protected function onInitLayoutDatax($data) {
	//		return $data;
	//	}
}