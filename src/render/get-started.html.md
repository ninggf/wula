---
title: '立即开始'
layout: 'default'

level: 'level1'
docid: 'start'
order: 1
---

开始啦，啦啦啦~
========
你已经根据[安装wula](/index.html#h-1)配置好了wula，让我们开始吧。
在此，我们以输出**hello world**为终极目标，让我们开始吧，Just do it, go go go.

> 多说一句哈
>
> 使用[PhpStorm](https://www.jetbrains.com/phpstorm/)开发真的很不懒呢。

# 新建目录 - hello

根据wulaphp的约定，我们需要在wwwroot/modules/目录下建立我们自己的模块`hello`:

1. 在`wwwroot/modules`下新建一个目录`hello`用于存放模块的所有文件。
2. 在`wwwroot/modules/hello`下新建一个目录`controllers`用于存放模块的控制器。
3. 在`wwwroot/modules/hello`下新建一个目录`views`用于存放模块的视图文件。
4. 在`wwwroot/modules/hello`下新建文件`bootstrap.php`用于引导模块。

建完之后你的目录结构是这样地：

<pre>
|-- wwwroot
    |-- hello
        |-- controllers
        |-- views
        |-- bootstrap.php
</pre>

> 多说一句哈:
>
> hello目录名将是URL组成一部分（**wulaphp使用所见即所得的[路由规则](/mvc/router.html)**)，这个名字可修改.

# 引导文件 - bootstrap.php

wulaphp的模块需要一个引导文件`bootstrap.php`, 此文件用来定义并向wulaphp注册一个模块，它的代码是这样的：

```php
<?php
namespace hello;

use wulaphp\app\App;
use wulaphp\app\Module;

class HelloModule extends Module {
	public function getName() {
		return 'helloworld';
	}

	public function getDescription() {
		return '输出helloworld的演示模块';
	}

	public function getHomePageURL() {
		return '';
	}

}
// 注册模块.
App::register(new HelloModule());

```

> **注意**:
>
> 1. `namespace hello`是必须的，wulaphp中模块要有一个独一无二的[命名空间](http://php.net/manual/zh/language.namespaces.rationale.php).
> 2. 命名空间名称不必和目录名相同.
> 3. bootstrap.php的命名空间只能有一级， `namespace hello\abc`这样的是不行地.
> 4. 本例中`hello`为模块的命名空间.
> 3. 模块中的所有控制器,类的命名空间必须是bootstrap.php命名空间的子命名空间,不然无法自动加载:
>    - 控制器的命名空间为: `hello\controllers`
>    - 其它类的命名空间为类文件所在的目录.


# 默认控制器 - HelloController

**hello -> HelloController**，就是这样，与模块命名空间同名的控制器即为默认控制器.
在`controllers`目录下新建文件`HelloController.php`:

```php
<?php
namespace hello\controllers;

use wulaphp\mvc\controller\Controller;

class HelloController extends Controller {
	public function index() {
		// 直接返回了'hello world'表示使用简单视图。
		return 'hello world';
	}
}
```

保存，打开你最爱的浏览器，比如，360安全浏览器（呵呵）,在地址栏输入URL:[http://localhost/hello](http://localhost/hello),You will see:

**hello world**

That's all, 就是这么简单。

## 默认方法 - index

按惯例:
```php
public function index(){}
```

是控制器的默认方法.

# 使用视图

wulaphp通过View抽象类支持多种模板引擎，本例我们使用[Smarty](http://www.smarty.net/)这个老牌PHP模板引擎.
**wulaphp的默认模板引擎为Smarty**。

让我们用视图来显示**hello world**,在`views`目录下新建Smarty模板 `world.tpl`:

```html
<html>
<head>
    <meta charset="utf-8">
    <title>hello world</title>
</head>
    <body>
        <h1>{$message}</h1>
    </body>
</html>
```

接下我们在`HelloController.php`文件中添加方法`world`:

```php
public function world() {
    $data['message'] = 'hello world';
    // 当方法名与模板名相同时，可以省略模板名.
    return view($data);
}
```

打开你最爱的浏览器，比如，360安全浏览器（呵呵）,在地址栏输入URL:[http://localhost/hello/world](http://localhost/hello/world),You will see:

**hello world**

> **多说一句哈**
>
> 代码中的注释也要读一读。
>
> 除了Smarty模板引擎，wulaphp内置了:
>    1. 基于PHP文件的HtmlView.
>    2. 基于Array的JsonView.
> 
> 你还可以自定义模板引擎，详细高级部分。

# 向您问好

我们要再向前一步，我们要通过参数传递姓名。在`HelloController.php`文件中添加方法`say`:

```php
public function say($name = '兄台') {
    $data['message'] = $name . '，你好!';
    
    return view('world', $data);
}
```

没错，say方法的`$name`参数即为URL中的参数, wulaphp中GET参数传递有二种方式:
1. 传统的: [http://localhost/hello/say?name=zhangsan](http://localhost/hello/say?name=zhangsan).
2. wulaphp的: [http://localhost/hello/say/zhangsan](http://localhost/hello/sayzhangsan).

根据个人喜好，用你最爱的浏览器，比如，360安全浏览器（呵呵）打开上述URL，You will see:

**zhangsan，你好!**

如果你直接访问[http://localhost/hello/say](http://localhost/hello/say)而不加任何参数，那么你将看到:

**兄台，你好!**

是的，就是这么简单, `$name`有个默认值:兄台.

> 思考题：多个参数怎么搞?



# 非默认控制器

我们不能把模块中所有方法都写在一个控制器里，我们需要更多的控制器。请看一个牛逼的控制器 -- `NiuBiController`:

- 在`controllers`目录中新建文件`NiuBiController.php` 

```php
<?php
namespace hello\controllers;

use wulaphp\mvc\controller\Controller;

class NiuBiController extends Controller {
	public function say() {

		return view(['niubi' => 'wula is very niubi!']);
	}
}
```

- 创建模板文件`views/niubi/say.tpl`:

```html
<html>
<head>
    <meta charset="utf-8">
    <title>wula</title>
</head>
<body>
    <h1>{$niubi}</h1>
    <div>
        <a href="{'hello\controllers\HelloController::say'|action}/乌拉">点此向wula问好吧</a>
    </div>
    <div>
        <a href="{'hello/say'|app}/乌拉">点此向wula问好吧</a>
    </div>
</body>
</html>
```

快点访问[http://localhost/hello/nuiBi/say](http://localhost/hello/nuiBi/say)。你看到了什么？

你看到了二个『点此向wula问好吧』的链接，这二个链接的出现只是为了介绍如何在模板中生成URL:

1. 通过`action`修改器([modifier])：`{'hello\controllers\HelloController::say'|action}`
2. 通过`app`修改器([modifier]):`{'hello/say'|app}`
3. 他们的区别将在高级部分有详细的说明.
4. 请认真理解action与app修改器，很重要，相当重要。

> 思考题：`NiuBiController`控制器可以有默认方法吗？

# 藏起来

还记得前文我说『hello目录名将是URL组成一部分，这个名字可修改』吧。请你把`hello`目录名修改为任意一个符合URL规则的名字,比如`wulaphp-is-very-good`。
改好后，请将URL中的`hello`修改为修改后的目录名(此例中为`wulaphp-is-very-good`)进行访问，靠，可以~

**同时请您关注那二个『点此向wula问好吧』的链接**.他们变了，有没有？

# 接下来

接下来我们要进行[数据库](/mvc/db.html)操作了，我们是CRUD程序员哈。当然你也可以续断深入[控制器](/mvc/controller.html)部分的学习.

[modifier]: http://www.smarty.net/docs/zh_CN/language.modifiers.tpl