---
title: '数据库访问(M)'
layout: 'default'

level: 'level2'
parent: 'mvc'
docid: 'db'
order: 10
---

# 数据库访问

在开始之前，请参照[数据库配置](/config.html#h-10),配置好你的数据库链接使wulaphp可以连接上你的数据库。


## 数据库访问方式

wulaphp操作数据库的CURD操作有三种写法,

1. 继承`Table`类或`View`类，将业务逻辑封装在此类中进行，**推荐**。
    ```php
		class UserTable extends Table {
			public function add($user){
				// TODO: 你的业务逻辑
			}
		}

		$userTable = new UserTable();
		$userTable->add(['username'=>'adfasdf']);
	```
2. 直接创建`SimpleTable`的实例进行简单数据库操作或使用`App::table()`方法获取`SimpleTable`实例，此方法是创建`SimpleTable`实例的快捷方式。
    ```php 
		$userTable = new SimpleTable('user');
	```
	```php 
		$userTable = App::table('user');
	```
3. 通过`App::db()`获取数据库连接进行直接操作.
	```php 
		$db = App::db();
		$user = $db->select('*')->from('user')->where(['name LIKE'=>'%leo%'])->get();
		$data = $db->query('select * from user where id = %d ', 1);
	```

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