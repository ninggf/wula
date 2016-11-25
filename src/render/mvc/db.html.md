---
title: '数据库访问(M)'
layout: 'default'

level: 'level2'
parent: 'mvc'
docid: 'db'
order: 10
---

# 数据库访问

## 数据库配置 

### 通过.env文件配置 

```ini 
//这里是数据库配置
[db]
;db.driver = MySQL
;db.host = localhost
;db.port = 3306
;db.name = test
;db.charset = UTF8MB4
;db.user = leo
;db.password = 888888
;db.options =
```

### 通过dbconf.php文件配置

```php
<?php
/**
 * 数据库配置。
 */
$config = new \wulaphp\conf\DatabaseConfiguration('default');
$config->driver(env('db.driver', 'MySQL'));
$config->host(env('db.host', 'localhost'));
$config->port(env('db.port', '3306'));
$config->dbname(env('db.name', 'test'));
$config->encoding(env('db.charset', 'UTF8MB4'));
$config->user(env('db.user', 'root'));
$config->password(env('db.password', 'root'));
$options = env('db.options', '');
```

> 以上配置你可以选择使用一个 不过我们推荐第一种，第二种线上环境我们可以使用

## 数据库操作方式

wulaphp操作数据库的CURD操作有三种写法,实例化`Table`类，`SimpleTable`,`App::table`.
其实`SimpleTable`和`App::table`最后都是继承`Table`；

## 数据库操作

### 插入操作

首先我们可以在home模块下新建一个models文件夹 然后我们新建一个TestTable.php, test为对应的表名：

```php
<?php
	
namespace home\models;

use wulaphp\db\Table;

class TestTable extends Table {
	// do something
}
```

然后我们就可以在Controller层的HomeController中使用了：

 ```php  
$test = new TestTable();
$data['param1'] = 'test';
$data['param2'] = 'test';
$data['param3'] = 'test';
$res = $test->insert($data);
//return bool(true)

```

当然如果你觉得实例化model比较麻烦你可以直接使用 SimpleTable类 具体使用方法如下：
 
 ```php
$test = new SimpleTable('test');
$data['param1'] = 'test';
$data['param2'] = 'test';
$data['param3'] = 'test';
$res = $test->insert($data);
//return bool(true)	
```

我们还支持App::table，使用方法如下：

 ```php
$test = App::table('test');
$data['param1'] = 'test';
$data['param2'] = 'test';
$data['param3'] = 'test';
$res = $test->insert($data);
//return bool(true)
```    		
		
### 批量插入操作

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$datas[0]['param1'] = 'test';
$datas[0]['param2'] = 'test';
$datas[1]['param1'] = 'test';
$datas[1]['param2'] = 'test';
$datas[2]['param1'] = 'test';
$datas[2]['param2'] = 'test';
$res = $test->inserts($datas);
//return array;这里将返回多个插入的主键id

 ```

## 查询操作
 
### 根据id查询
 ```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$res = $test->get(['id'=>1]);
//return array;
```

### 查询所有
 ```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$res = $test->select('*')->toArray();//当然你也可以选择字段
//return array;

```

## 更新操作：
```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$data['param1'] = 'test';
$data['param2'] = 'test';
$data['param3'] = 'test';
$res = $test->update($data ,$where);
//return bool(true)		
```
##  删除操作
```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$res = $test->delete($where); //$res = $test->delete(['id'=>1]);
//return bool(true)
```

**最后各位看官老爷觉得原生sql语句比较顺手，我们wulaphp也是支持的！请使用`$db = App::db(); $db->query();`给各位一个例子：**

```php
$db = App::db();
$res  = $db->query('select * from test where id = %d ', 1);
//return array
```