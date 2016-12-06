---
title: 'wula中的模型实现-Table与View'
layout: 'default'

doctitle: '自定义模型'
level: 'level3'
parent: 'db'
order: 2
author: 'wangwei'
---

# 自定义模型


## 模型定义

> 模型类并非必须定义，只有当存在独立的业务逻辑或者属性的时候才需要定义。

模型类通常需要继承系统的View类或其子类Table，下面是一个home\models\StudentTable类的定义：

```php
<?php
	
namespace home\models;

use wulaphp\db\Table;

class StudentTable extends Table {
	// do something
}
```
> 继承`View`类和`Table`的区别，我们之后会一一讲到！

模型类的作用大多数情况是操作数据表的，如果按照系统的规范来命名模型类的话，大多数情况下是可以自动对应数据表。
模型类的命名规则是除去表前缀的数据表名称，采用驼峰法命名，并且首字母大写，然后加上模型层的名称（默认定义是Table），例如：
`StudentTable`使用`student`表，`StudentCourseTable`使用的是`student_course`表！

> 注意这个属性的定义不需要加表的前缀wula_

## 模型实例化

在walaphp中，如果你要使用一张表型只需要实例化一下就可以轻轻松松操作你需要的表：

 ```php  
$student = new StudentTable();
$stu_info = $student->select('*')->toArray();
```

## 继承`Table`与`View`的区别

### 继承`View`类

我们可以在`wulaphp\db\View.php`中可以看到`View`只提供了我们查询相关的操作！
如果你的模型继承`View`类，你想进行数据库删除，添加，更新操作，对不起wula是拒绝的！
你只能进行数据的查询相关操作！

### 继承`Table`类

我们可以在`wulaphp\db\View.php`中看到`Table`类提供我们添加，删除，回收站，
更新的数据库相关操作！而我们也看到`Table`类继承的`View`类，所以模型继承`Table`
类，CURD操作我们都可以使用！友情提醒:模型请继承`Table`类，如果你任性的就要继承
`View`类也可以，不过你就只能使用查询相关操作了！


  