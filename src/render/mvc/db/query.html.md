---
title: '使用wula进行数据条件查询'
layout: 'default'

doctitle: '条件查询'
level: 'level3'
parent: 'db'
order: 3
author: 'wangwei'
---

# 条件查询

> 此处以`Table`模型操作为实例

## select

**功能:** 指定要查询的字段

**参数:**
1. array ...$fileds 要查询的字段列表.

**返回值:** View

例：

```php
$student = new StudentTable();
$res = $student->select('*');
```
对应SQL：
```sql
SELECT * FROM student AS Student ; 
```


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

## where

**功能:** 根据条件查询需要的字段

**参数:**
1.  $con  条件.

**返回值:** QueryBuilder

例：

### 条件查询

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['name'=>'wula'])->get();

```
对应SQL：
```sql
SELECT * FROM student AS Student WHERE name=wula; 
```

### 区间查询

> 查询年龄段在5-10的所有学生的信息

```php
$student = new StudentTable();
$where['age >'] = 5;
$where['age <'] = 10;
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：
```sql
SELECT id,name,gender FROM student AS Student WHERE age>5 AND age<10; 
```

> 你也可以使用`between`条件查询

```php
$student = new StudentTable();
$where['age between'] = array('5','10');
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：
```sql
SELECT id,name,gender FROM student AS Student WHERE age>5 AND age<10; 
```

> `or`查询例子：

```php
$student = new StudentTable();
$where['age'] = 5;
$where['|| age'] = 10;
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：

```sql
SELECT id,name,gender FROM student AS Student WHERE age=5 OR age=10; 
```
### 统计查询

#### 查询符合条件的总条数

> 查询数学成绩大于80分的学生人数

```php

$grade = new GradeTable();
$where['grade >'] = 80;
$res = $grade->select('*')->where($where)->count();

```
对应SQL：

```sql
SELECT COUNT('*') FROM grade as Grade WHERE grade>80 
```
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
对应SQL：

```sql
SELECT SUM(grade) AS sum_grade FROM grade AS Grade WHERE course_id=2 
```
> 上面的`imv`是不需要任何转译的意思！

### 模糊查询

> 查询所有学生姓名中带'wula'的学生的信息

```php
$student = new StudentTable();
$where['name like'] = '%wula%';
$res = $student->select('*')->where($where)->toArray();

```
对应SQL：
```sql
SELECT * FROM student as Student WHERE name LIKE '%wula%'
```
## exist

**功能:** 判断数据是否存在

**参数:**

1.array  $con 条件

2.string $id  字段.

**返回值:** boolean 有记数返回true,反之返回false.

例:

```php
$student = new StudentTable();
$where['age >'] = 5;
$where['age <'] = 10;
$res = $student->exist($where,'name');
```
> `$id`可为空，如果存在会返回bool 成功true，失败false.

## map

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

## asc

**功能:** 查询结果升序排序

**参数:**

1.  `$field`      字段

**返回值:**     QueryBuilder

例：

> 查询语文成绩,升序排列

```php
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->asc('grade')->toArray();
```
对应SQL：
```sql
SELECT * FROM grade AS Grade WHERE id>0 AND course_id=1 ORDER BY grade ASC
```
## desc

**功能:** 查询结果降序排序

**参数:**

1.  `$field`      字段

**返回值:**     QueryBuilder

例：

> 查询语文成绩,降序排列

```php
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->desc('grade')->toArray();
```
对应SQL：
```sql
SELECT * FROM grade AS Grade WHERE id>0 AND course_id=1 ORDER BY grade DESC
```
## sort

**功能:** 查询结果升序或降序排序

**参数:**

1.`$field`      字段

2.`$order`     `asc`升序 or `desc`降序

**返回值:**     QueryBuilder

例：

> 查询语文成绩,降序排列

```php
$grade = new GradeTable();
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
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->asc('grade')->toArray();
```
对应SQL：
```sql
SELECT * FROM grade AS Grade WHERE id>0 AND course_id=1 ORDER BY grade ASC
```

## left

**功能:** 联合查询左连接

**参数:**

1.`$tableName`    表名  

2.`$on`     联合条件

**返回值:**     QueryBuilder

例：
> 查询学生各门课程成绩

```php
$student = new StudentTable();
$res = $student->select('Student.name,g.grade,c.name as cname')->left('grade as g','Student.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
```
对应SQL：
```sql
SELECT Student.name,g.grade,c.name AS cname FROM student AS Student LEFT JOIN grade AS g ON Student.id = g.student_id LEFT JOIN course AS c ON g.course_id = c.id
```

> [ 特别说明 ]：请注意，请注意，请注意重要的事情说三遍！
>> wulaphp会默认将表名转为首字母大写的表名，如`wula`会转为`Wula`;如果你想as一个新的名字请使用重命名大法`alias('name');`给你们一个例子:



```php
$student = new StudentTable();
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

## groupBy

**功能:** 分组

**参数:**

1.`$field`    字段  

**返回值:**     QueryBuilder

例：

>例如我们查询学生成绩的总分

```php
$student = new StudentTable();
$this->alias('stu');
$res = $student->select('stu.name',imv('sum(g.grade)','sum'))->left('grade as g','stu.id','g.student_id')->groupBy('stu.name')->toArray();
```
对应SQL：
```sql
SELECT stu.name,SUM(g.grade) AS sum FROM student AS stu LEFT JOIN grade AS g ON stu.id=g.student_id GROUP BY  stu.name
```
## limit

**功能:** 将查询的数据分页

**参数:**

1.`$start`    开始位置

2.`$limit`    分页条数 

**返回值:**     QueryBuilder

例：

```php
$student = new StudentTable();
$this->alias('stu');
$start = 1;
$limit = 20;
$res = $student->select('*')->where(['id >'=>0])->limit(($start-1)*$limit,$limit)->sort('id','desc')->toArray();
```

对应SQL：
```sql
SELECT * FROM student AS stu WHERE id>0 LIMIT 0,20 ORDER BY id DESC
```

