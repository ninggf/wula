---
title: '使用wula进行数据条件查询'
layout: 'default'

doctitle: '条件查询'
level: 'level3'
parent: 'db'
order: 1
author: 'wangwei'
---

# 高级查询

> 在wulaphp中读取数据的方式很多，通常分为读取数据、读取数据集和读取字段值。
>数据查询方法支持的连贯操作方法有：

<table>
<thead>
<tr>
<th style="text-align:right">连贯操作</th>
<th style="text-align:right">作用</th>
<th style="text-align:right">支持的参数类型</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:right">where</td>
<td style="text-align:right">用于查询或者更新条件的定义</td>
<td style="text-align:right">字符串、数组和对象</td>
</tr>
<tr>
<td style="text-align:right">alias</td>
<td style="text-align:right">用于给当前数据表定义别名</td>
<td style="text-align:right">字符串</td>
</tr>
<tr>
<td style="text-align:right">select</td>
<td style="text-align:right">查询字段</td>
<td style="text-align:right">字符串</td>
</tr>
<tr>
<td style="text-align:right">find</td>
<td style="text-align:right">查询字段</td>
<td style="text-align:right">字符串</td>
</tr>
<tr>
<td style="text-align:right">left</td>
<td style="text-align:right">左连接</td>
<td style="text-align:right">字符串、数组</td>
</tr>
<tr>
<td style="text-align:right">desc</td>
<td style="text-align:right">降序排序</td>
<td style="text-align:right">字符串</td>
</tr>
<tr>
<td style="text-align:right">asc</td>
<td style="text-align:right">升序排序</td>
<td style="text-align:right">字符串</td>
</tr>
<tr>
<td style="text-align:right">sort</td>
<td style="text-align:right">排序</td>
<td style="text-align:right">字符串</td>
</tr>
<tr>
<td style="text-align:right">toArray</td>
<td style="text-align:right">转换成数组</td>
<td style="text-align:right">不需要</td>
</tr>
<tr>
<td style="text-align:right">join</td>
<td style="text-align:right">用于对查询的join支持</td>
<td style="text-align:right">字符串和数组</td>
</tr>
<tr>
<td style="text-align:right">count</td>
<td style="text-align:right">统计</td>
<td style="text-align:right">字符串</td>
</tr>
<tr>
<td style="text-align:right">map</td>
<td style="text-align:right">获取key/value数组</td>
<td style="text-align:right">字符串和数组</td>
</tr>
<tr>
<td style="text-align:right">groupBy</td>
<td style="text-align:right">用于对查询的groupBy支持</td>
<td style="text-align:right">字符串</td>
</tr>
<tr>
<td style="text-align:right">limit</td>
<td style="text-align:right">用于对查询数据的分页</td>
<td style="text-align:right">int</td>
</tr>
<tr>
<td style="text-align:right">exist</td>
<td style="text-align:right">判断查询的数据是否存在</td>
<td style="text-align:right">不需要</td>
</tr>
</tbody>
</table>
    
>  以上是wula支持的连贯操作方法,下面将会举例说明：



## where条件查询

读取数据是指读取数据表中的一行数据（或者关联数据），主要通过`get`方法完成，例如：

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['name'=>'wula'])->get();

```

读取数据是指读取数据表中的多行数据（或者关联数据），主要通过`toArray`方法完成，例如：

 ```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['age >'=>5])->toArray();

```  
## 判断数据是否存在`exist`

```php
$student = new StudentTable();
$where['age >'] = 5;
$where['age <'] = 10;
$res = $student->exist($where,'name');
```
> `exist`的语法为`exist($where,$field)`,`$field`可为空，如果存在会返回bool 成功true，失败false.

## 获取key/value数组 `map`

```php
$map = new MapTable();
$res = $map->map(array('key'=>'wula'),'value','key');
```
> 这样会返回 `array('wula'=>'I am wula value')`;
> `map`的语法为`map($where, $valueField, $keyField = null, $rows = [])`,`$where`条件，`$valueField` value字段,`$keyField`key字段，`$rows`初始数组.赶紧测试下吧！

## 区间查询

> 查询年龄段在5-10的所有学生的信息

```php
$student = new StudentTable();
$where['id >'] = 0;
$where['age >'] = 5;
$where['age <'] = 10;
$res = $student->select('id,name,gender')->where($where)->toArray();

```

> 你也可以使用`between`条件查询

```php
$student = new StudentTable();
$where['age between'] = array('5','10');
$res = $student->select('id,name,gender')->where($where)->toArray();

```
> `or`查询例子：

```php
$student = new StudentTable();
$where['age'] = 5;
$where['|| age'] = 10;
$res = $student->select('id,name,gender')->where($where)->toArray();

```
>  生成sql为：`select id,name,gender from Student where age=5 or age=10`;

## 模糊查询

> 查询所有学生姓名中带‘伟’的学生的信息

```php
$student = new StudentTable();
$where['name like'] = '%伟%';
$res = $student->select('*')->where($where)->toArray();

```

## 统计查询

### 查询符合条件的总条数

> 查询数学成绩大于80分的学生人数

```php

$grade = new GradeTable();
$where['grade >'] = 80;
$res = $grade->select('*')->where($where)->count();

```
### sum,max,min,avg

> 查询数学成绩的总成绩，最高分，最低分，平均分

```php
$grade = new GradeTable();
$where['course_id'] = 2;
$res1 = $grade->select(imv('sum(grade)', 'sum_grade'))->where($where)->get();
$res2 = $grade->select(imv('max(grade)', 'max_grade'))->where($where)->get();
$res3 = $grade->select(imv('min(grade)', 'min_grade'))->where($where)->get();
$res4 = $grade->select(imv('avg(grade)', 'avg_grade'))->where($where)->get();

```

> 上面的`imv`是不需要任何转译的意思！上面的sql语句为`SELECT sum(grade) AS sum_grade FROM Grade where course_id=2`!咦，这么表名`grade`变成大写了，好奇吧，稍后解释！

## 升序，降序查询

### 升序查询,`asc`

> 查询语文成绩,升序排列

```php
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->asc('grade')->toArray();
```

### 降序查询,`desc`

> 查询语文成绩,降序序排列

```php
$grade = new GradeTable();
$where['id >'] = 0;
$where['course_id'] = 1;
$res = $grade->select('*')->where($where)->desc('grade')->toArray();
```

> 升序降序你也可以使用排序大法`sort($field,$order)`如`sort('grade','desc')`或者`sort('grade','asc')`;

##  联合查询

> 查询学生各门课程成绩

```php
$student = new StudentTable();
$res = $student->select('Student.name,g.grade,c.name as cname')->left('grade as g','Student.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
//return array;
```
> [ 特别说明 ]：请注意，请注意，请注意重要的事情说三遍！
>> wulaphp会默认将表名转为首字母大写的表名，如`wula`会转为`Wula`;如果你想as一个新的名字请使用重命名大法`alias('name');`给你们一个例子:

```php
$student = new StudentTable();
$this->alias('stu');
$res = $student->select('stu.name,g.grade,c.name as cname')->left('grade as g','stu.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
//return array;
```

> 当然如果你不喜欢上面的方法你也使用：

```php
$db = App::db();
$res = $db->select('stu.name,g.grade,c.name as cname')->from('student','stu')->left('grade as g','stu.id','g.student_id')->left('course as c','g.course_id','c.id')->toArray();
//return array;
```
> 上面的写法取决于你的喜好！想怎么写就怎么写，wula都将满足你！`let's do it`!

## groupBy

>例如我们查询学生成绩的总分

```php
$student = new StudentTable();
$this->alias('stu');
$res = $student->select('stu.name',imv('sum(g.grade)','sum'))->left('grade as g','stu.id','g.student_id')->groupBy('stu.name')->toArray();
```

## 分页

```php
$student = new StudentTable();
$where['id >'] = 0;
$res = $student->select('*')->where($where)->limit($start,$limit)->sort('id','desc')->toArray();
//return array;
$page_total = count($res);
```