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
2. 使用`App::table()`方法获取`SimpleTable`实例，此方法是继承`SimpleTable`实例的快捷方式,具体可以查看`SimpleTable`类。
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

### 准备工作
> 我们以学生管理为实例

![E-R](/figures/figure1.svg)

>  你可以[下载本示例SQL](/wula_test.sql).


### 简单查询操作

首先我们可以在home模块下新建一个models文件夹 然后我们新建一个StudentTable.php, student为对应的表名：

```php
<?php
	
namespace home\models;

use wulaphp\db\Table;

class StudentTable extends Table {
	// do something
}
```

然后我们就可以在Controller层的HomeController中使用了：

> 查询所有学生信息

 ```php  
$student = new StudentTable();
$stu_info = $student->select('*')->toArray();
```




我们还支持App::table，使用方法如下：

 ```php
$student = App::table('student');
$stu_info = $student->select('*')->toArray();
```    		
> 以上返回结果将是一个二维数组；如果你想了解更多条件查询的方法请移步[条件查询](/mvc/db/query.html)




###  插入操作

> 插入操作wulaphp提供了`insert`插入方法和`inserts`批量插入方法

1. `insert`插入方法

```php
$student = App::table('student');
$data['name'] = 'wula';
$data['age']  = 9;
$data['genger']  = '男';
$data['height']  = 154;
$data['weight']  = 28;
$insert_id  = $student->insert($data);
```
> 这里将返回主键id

2. `inserts`批量插入方法

```php
$student = App::table('student');

$data[0]['name'] = 'jack';
$data[0]['age']  = 9;
$data[0]['genger']  = '男';
$data[0]['height']  = 151;
$data[0]['weight']  = 28;

$data[1]['name'] = 'david';
$data[1]['age']  = 9;
$data[1]['genger']  = '男';
$data[1]['height']  = 150;
$data[1]['weight']  = 27;
$res = $test->inserts($data);
 ```
> 这里将返回多个插入的主键id

### 更新操作：

> 呀！上面那个david学生的年龄我们搞错了，修改下吧！

```php
$student = App::table('student');
$data['age'] = '10';
$where['name'] = 'david';
$res = $student->update($data ,$where);
```
>这里将返回一个bool(true)

###  删除操作
> `david`这个学生突然转学了，将信息删除吧！

```php
$student = App::table('student');
$res = $student->delete(['id'=>5]);
```
>这里将返回一个bool(true)

**最后各位看官老爷觉得原生sql语句比较顺手，我们wulaphp也是支持的！请使用`$db = App::db(); $db->query();`给各位一个例子：**

```php
$db = App::db();
$res  = $db->query('select * from student where id = %d ', 1);
```
>这里将返回一个数组