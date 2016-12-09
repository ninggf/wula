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

### exist

**功能:** 判断数据是否存在

**参数:**

1.array  $con 条件

2.string $id  字段.

**返回值:** boolean 有记数返回true,反之返回false.

例:

```php
$student = App::table('student');
$where['age >'] = 5;
$where['age <'] = 10;
$res = $student->exist($where,'name');
```
> `$id`可为空，如果存在会返回bool 成功true，失败false.

### map

**功能:** 获取key/value数组

**参数:**

1.  array  $where      条件.
2.  string $valueField value字段.
3.  string $keyField   key字段.
4.  array  $rows       初始数组.

**返回值:**     array 读取后的数组

例:


```php
$map = new MapTable();
$res = $map->map(array('key'=>'wula'),'value','key');
```
> 这样会返回 `array('wula'=>'I am wula value')`;

### asc

**功能:** 查询结果升序排序

**参数:**

1.  `$field`      字段

**返回值:**     QueryBuilder

例：

> 查询语文成绩,升序排列

```php
$grade = App::table('grade');
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->asc('grade')->toArray();
```
对应SQL：
```sql
SELECT * FROM grade AS Grade WHERE id>0 AND course_id=1 ORDER BY grade ASC
```
### desc

**功能:** 查询结果降序排序

**参数:**

1.  `$field`      字段

**返回值:**     QueryBuilder

例：

> 查询语文成绩,降序排列

```php
$grade = App::table('grade');
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->desc('grade')->toArray();
```
对应SQL：
```sql
SELECT * FROM grade AS Grade WHERE id>0 AND course_id=1 ORDER BY grade DESC
```
### sort

**功能:** 查询结果升序或降序排序

**参数:**

1.`$field`      字段

2.`$order`     `asc`升序 or `desc`降序

**返回值:**     QueryBuilder

例：

> 查询语文成绩,降序排列

```php
$grade = App::table('grade');
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->desc('grade')->toArray();
```
对应SQL：
```sql
SELECT * FROM grade AS Grade WHERE id>0 AND course_id=1 ORDER BY grade DESC
```
> 查询语文成绩,升序排列

```php
$grade = App::table('grade');
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->asc('grade')->toArray();
```
对应SQL：
```sql
SELECT * FROM grade AS Grade WHERE id>0 AND course_id=1 ORDER BY grade ASC
```

### left

**功能:** 联合查询左连接

**参数:**

1.`$tableName`    表名  

2.`$on`     联合条件

**返回值:**     QueryBuilder

例：
> 查询学生各门课程成绩

```php
$student = App::table('student');
$res = $student->select('Student.name,g.grade,c.name as cname')->left('grade as g','Student.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
```
对应SQL：
```sql
SELECT Student.name,g.grade,c.name AS cname FROM student AS Student LEFT JOIN grade AS g ON Student.id = g.student_id LEFT JOIN course AS c ON g.course_id = c.id
```

> [ 特别说明 ]：请注意，请注意，请注意重要的事情说三遍！
>> wulaphp会默认将表名转为首字母大写的表名，如`wula`会转为`Wula`;如果你想as一个新的名字请使用重命名大法`alias('name');`给你们一个例子:



```php
$student = App::table('student');
$this->alias('stu');
$res = $student->select('stu.name,g.grade,c.name as cname')->left('grade as g','stu.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
```
对应SQL：
```sql
SELECT stu.name,g.grade,c.name AS cname FROM student AS stu LEFT JOIN grade AS g ON Student.id = g.student_id LEFT JOIN course AS c ON g.course_id = c.id
```

> 当然如果你不喜欢上面的方法你也使用：

```php
$db = App::db();
$res = $db->select('stu.name,g.grade,c.name as cname')->from('student','stu')->left('grade as g','stu.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
```
对应SQL：
```sql
SELECT stu.name,g.grade,c.name AS cname FROM student AS stu LEFT JOIN grade AS g ON Student.id = g.student_id LEFT JOIN course AS c ON g.course_id = c.id
```

> 上面的写法取决于你的喜好！想怎么写就怎么写，wula都将满足你！`let's do it`!

### groupBy

**功能:** 分组

**参数:**

1.`$field`    字段  

**返回值:**     QueryBuilder

例：

>例如我们查询学生成绩的总分

```php
$student = App::table('student');
$this->alias('stu');
$res = $student->select('stu.name',imv('sum(g.grade)','sum'))->left('grade as g','stu.id','g.student_id')->groupBy('stu.name')->toArray();
```
对应SQL：
```sql
SELECT stu.name,SUM(g.grade) AS sum FROM student AS stu LEFT JOIN grade AS g ON stu.id=g.student_id GROUP BY  stu.name
```
### limit

**功能:** 将查询的数据分页

**参数:**

1.`$start`    开始位置

2.`$limit`    分页条数 

**返回值:**     QueryBuilder

例：

```php
$student = App::table('student');
$this->alias('stu');
$start = 1;
$limit = 20;
$res = $student->select('*')->where(['id >'=>0])->limit(($start-1)*$limit,$limit)->sort('id','desc')->toArray();
```

对应SQL：
```sql
SELECT * FROM student AS stu WHERE id>0 LIMIT 0,20 ORDER BY id DESC
```




