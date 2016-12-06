---
title: '使用wula进行数据条件查询'
layout: 'default'

doctitle: '条件查询'
level: 'level3'
parent: 'db'
order: 3
author: 'wangwei'
---

# 高级查询

> 此处以`Table`模型操作为实例

# select($fields)

## 参数

需要查询的字段名，如：select('name');

## 用法

查询需要的字段，实例如下：

```php
$student = new StudentTable();
$res = $student->select('*');
```
> 生成的sql语句为：`select * from student as Student`

> 将上面生成的query转化为数组请使用`get`或者`toArray`,用法如下:

读取数据是指读取数据表中的一行数据（或者关联数据），主要通过`get`方法完成，例如：

```php
$student = new StudentTable();

$stu_info = $student->select('*')->get();

```

读取数据是指读取数据表中的多行数据（或者关联数据），主要通过`toArray`方法完成，例如：

 ```php
$student = new StudentTable();

$stu_info = $student->select('*')->toArray();

```  

# where($where)

## 参数

查询条件`array`

## 用法

根据条件插叙需要的字段，实例如下：

### 条件查询

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['name'=>'wula'])->get();

```
> `sql`语句为：`select * from student as Student where name=wula`

### 区间查询

> 查询年龄段在5-10的所有学生的信息

```php
$student = new StudentTable();
$where['age >'] = 5;
$where['age <'] = 10;
$res = $student->select('id,name,gender')->where($where)->toArray();

```
> `sql`语句为：`select id,name,gender from student as Student where age>5 and age<10`

> 你也可以使用`between`条件查询

```php
$student = new StudentTable();
$where['age between'] = array('5','10');
$res = $student->select('id,name,gender')->where($where)->toArray();

```
> `sql`语句为：`select id,name,gender from student as Student where age>5 and age<10`

> `or`查询例子：

```php
$student = new StudentTable();
$where['age'] = 5;
$where['|| age'] = 10;
$res = $student->select('id,name,gender')->where($where)->toArray();

```
>  生成sql为：`select id,name,gender from student as Student where age=5 or age=10`;

### 统计查询

#### 查询符合条件的总条数

> 查询数学成绩大于80分的学生人数

```php

$grade = new GradeTable();
$where['grade >'] = 80;
$res = $grade->select('*')->where($where)->count();

```
> 生成的`sql`语句为：`select count('*') from grade as Grade where grade>80`

#### sum,max,min,avg

> 查询数学成绩的总成绩，最高分，最低分，平均分

```php
$grade = new GradeTable();
$where['course_id'] = 2;
$res1 = $grade->select(imv('sum(grade)', 'sum_grade'))->where($where)->get();
$res2 = $grade->select(imv('max(grade)', 'max_grade'))->where($where)->get();
$res3 = $grade->select(imv('min(grade)', 'min_grade'))->where($where)->get();
$res4 = $grade->select(imv('avg(grade)', 'avg_grade'))->where($where)->get();

```

> 上面的`imv`是不需要任何转译的意思！上面的sql语句为`SELECT sum(grade) AS sum_grade FROM grade as Grade where course_id=2`!咦，这么表名`grade`变成大写了，好奇吧，稍后解释！

### 模糊查询

> 查询所有学生姓名中带'wula'的学生的信息

```php
$student = new StudentTable();
$where['name like'] = '%wula%';
$res = $student->select('*')->where($where)->toArray();

```
> 生成的`sql`语句为:`select * from student as Student where name like '%wula%'`

# exist($where,$field)

## 参数

`$where` 条件

`$field` 字段

## 用法

判断数据是否存在,实例如下:

```php
$student = new StudentTable();
$where['age >'] = 5;
$where['age <'] = 10;
$res = $student->exist($where,'name');
```
> `$field`可为空，如果存在会返回bool 成功true，失败false.

# map($where, $valueField, $keyField = null, $rows = [])

## 参数

`$where`      条件

`$valueField` value字段

`$keyField`   key字段

`$rows`       初始数组


## 用法

获取key/value数组,实例如下:

```php
$map = new MapTable();
$res = $map->map(array('key'=>'wula'),'value','key');
```
> 这样会返回 `array('wula'=>'I am wula value')`;

# asc($field)

## 参数

`$field`      字段

## 用法

查询结果升序排序,实例如下：

> 查询语文成绩,升序排列

```php
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->asc('grade')->toArray();
```
> 生成的`sql`语句为:`select * from grade as Grade where id>0 and course_id=1 order by grade asc`

# desc($field)

## 参数

`$field`      字段

## 用法

查询结果降序排序,实例如下：

> 查询语文成绩,降序排列

```php
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->desc('grade')->toArray();
```
> 生成的`sql`语句为:`select * from grade as Grade where id>0 and course_id=1 order by grade desc`

# sort($field,$order)

## 参数

`$field`      字段

`$order`     `asc`升序 or `desc`降序

## 用法

查询结果升序或降序排序,排序实例如下：

> 查询语文成绩,降序排列

```php
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->desc('grade')->toArray();
```
> 生成的`sql`语句为:`select * from grade as Grade where id>0 and course_id=1 order by grade desc`

> 查询语文成绩,升序排列

```php
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->asc('grade')->toArray();
```
> 生成的`sql`语句为:`select * from grade as Grade where id>0 and course_id=1 order by grade asc`

# left($tableName,$on)

## 参数

`$tableName`    表名  

`$on`     联合条件

## 用法

联合查询左连接,实例如下：

> 查询学生各门课程成绩

```php
$student = new StudentTable();
$res = $student->select('Student.name,g.grade,c.name as cname')->left('grade as g','Student.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
```
> [ 特别说明 ]：请注意，请注意，请注意重要的事情说三遍！
>> wulaphp会默认将表名转为首字母大写的表名，如`wula`会转为`Wula`;如果你想as一个新的名字请使用重命名大法`alias('name');`给你们一个例子:


> 生成的`sql`语句为: `select Student.name,g.grade,c.name as cname from student as Student left join grade as g on Student.id = g.student_id left join course as c on g.course_id = c.id`

```php
$student = new StudentTable();
$this->alias('stu');
$res = $student->select('stu.name,g.grade,c.name as cname')->left('grade as g','stu.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
```
> 生成的`sql`语句为: `select stu.name,g.grade,c.name as cname from student as stu left join grade as g on stu.id = g.student_id left join course as c on g.course_id = c.id`


> 当然如果你不喜欢上面的方法你也使用：

```php
$db = App::db();
$res = $db->select('stu.name,g.grade,c.name as cname')->from('student','stu')->left('grade as g','stu.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
```
> 生成的`sql`语句为: `select stu.name,g.grade,c.name as cname from student as stu left join grade as g on stu.id = g.student_id left join course as c on g.course_id = c.id`


> 上面的写法取决于你的喜好！想怎么写就怎么写，wula都将满足你！`let's do it`!

# groupBy($field)

## 参数

`$field`    字段  

## 用法

`groupBy`分组统计,实例如下：

>例如我们查询学生成绩的总分

```php
$student = new StudentTable();
$this->alias('stu');
$res = $student->select('stu.name',imv('sum(g.grade)','sum'))->left('grade as g','stu.id','g.student_id')->groupBy('stu.name')->toArray();
```
> 生成的`sql`语句为:`select stu.name,sum(g.grade) as sum from student as stu left join grade as g on stu.id=g.student_id group by stu.name`

# limit($start, $limit)

## 参数

`$start`    开始位置

`$limit`    分页条数  

## 用法

将查询的数据分页,实例如下：

```php
$student = new StudentTable();
$this->alias('stu');
$start = 1;
$limit = 20;
$res = $student->select('*')->where(['id >'=>0])->limit(($start-1)*$limit,$limit)->sort('id','desc')->toArray();
```
> 生成的`sql`语句为: `select * from student as stu where id>0 limit 0,20 order by id desc`


