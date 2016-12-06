---
title: 'wula中的简单模型封装-SimpleTable'
layout: 'default'

doctitle: '简单模型'
level: 'level3'
parent: 'db'
order: 1
author: 'wangwei'
---

# 简单模型

通过wulaphp提供的简单模型类`SimpleTable`（继承了`Table`类）可以对数据库中的表进行CRUD(增删改查)操作。
我们只需要通过`App::table('表名')`获取一个`SimpleTable`的实例后即可轻松进行CURD操作，具体实例如下：

```php
$student = App::table('student');
$res = $student->select('*')->where(['age >'=>10])->toArray();
```

以上代码就可以从student表中取出所有年龄大于10的学生，对应的SQL语句如下:

```sql
SELECT * FROM `student` AS `Student` WHERE `age` > 10;
```

`SimpleTable`只是简单的继承了`Table`类，如果需要将具体的业务逻辑放到模型中操作则可以
继承`Table`类实现自的业务模型,详见[自定义模型](model.html).


下面详细说明Table类提供的功能与方法.

# Table类详解

## 继承关系

<pre>
View
|-- Table
    | -- SimpleTable
</pre>

- View 对应数据库中的view
- Table 对应数据中的table,默认主键为`id`


## View类提供的方法

### select

**功能:** 指定要查询的字段

**参数:**
1. array ...$fileds 要查询的字段列表.

**返回值:** View

例:

```php
$student = App::table('student');
$res = $student->select('id','name AS studentName,age')->where(['age >='=>10])->toArray();
```

对应SQL：
```sql
SELECT id,name AS studentName,age FROM student AS Student WHERE age >= 10; 
```

### get

**功能:** 根据主键或条件取一条记录.

**参数:** 
1. int|array $id  主键或条件数组
2. string    $fields 字段列表,默认为*.

**返回值:** array 

例:取主键值为1的学生数据:

```php
$student = App::table('student');
$res = $student->get(1);
```

对应SQL：
```sql
SELECT * FROM student AS Student WHERE id = 1; 
```

例: 取一个年龄为10岁的学生数据
```php
$student = App::table('student');
$res = $student->get(['age'=>10]);
```

对应SQL：
```sql
SELECT * FROM student AS Student WHERE age = 10 LIMIT 1; 
```

