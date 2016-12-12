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



## where

**功能:** 根据条件查询需要的字段

**参数:**
1.  $con  条件.

**返回值:** QueryBuilder

例：

### 等于

> 查詢`name`为`leo`的学生信息

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['name'=>'leo'])->get();

```
对应SQL：
```sql
SELECT * FROM student AS Student WHERE name='leo'; 
```

### 不等于

> 查詢`name`不为`leo`的学生信息

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['name !='=>'leo'])->get();

```
对应SQL：
```sql
SELECT * FROM student AS Student WHERE name!='leo'; 
```

### 大于

> 查詢年龄大于5岁的学生信息

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['age >'=>5])->get();

```
对应SQL：
```sql
SELECT * FROM student AS Student WHERE age>5; 
```

### 大于等于

> 查詢年龄大于等于5岁的学生信息

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['age >='=>5])->get();

```
对应SQL：
```sql
SELECT * FROM student AS Student WHERE age>=5; 
```

### 小于

> 查詢年龄小于10岁的学生信息

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['age <'=>10])->get();

```
对应SQL：
```sql
SELECT * FROM student AS Student WHERE age<10; 
```

### 小于等于

> 查詢年龄小于等于10岁的学生信息

```php
$student = new StudentTable();

$stu_info = $student->select('*')->where(['age <='=>10])->get();

```
对应SQL：
```sql
SELECT * FROM student AS Student WHERE age<=10; 
```
### BETWEEN

> 查詢年龄在5到10岁之间的所有学生信息

```php
$student = new StudentTable();
$where['age BT'] = array('5','10');
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：
```sql
SELECT id,name,gender FROM student AS Student WHERE age BETWEEN 5 AND 10; 
```

### NOT BETWEEN

> 查詢年龄不在5到10岁之间的所有学生信息

```php
$student = new StudentTable();
$where['age !BT'] = array('5','10');
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：
```sql
SELECT id,name,gender FROM student AS Student WHERE age NOT BETWEEN 5 AND 10; 
```

### IN

> 查詢年龄为5,6,10岁的所有学生信息

```php
$student = new StudentTable();
$where['age IN'] = array('5','6','10');
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：
```sql
SELECT id,name,gender FROM student AS Student WHERE age IN (5,6,10); 
```

### NOT IN

> 查詢年龄不为5,6,10岁的所有学生信息

```php
$student = new StudentTable();
$where['age !IN'] = array('5','6','10');
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：
```sql
SELECT id,name,gender FROM student AS Student WHERE age NOT IN (5,6,10); 
```

### LIKE

> 查詢名字中带`leo`的所有学生信息

```php
$student = new StudentTable();
$where['name like'] = '%leo%';
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：
```sql
SELECT id,name,gender FROM student AS Student WHERE name LIKE '%leo%'; 
```

### NOT LIKE

> 查詢名字中不带`leo`的所有学生信息

```php
$student = new StudentTable();
$where['age !like'] =  '%leo%';
$res = $student->select('id,name,gender')->where($where)->toArray();

```
对应SQL：
```sql
SELECT id,name,gender FROM student AS Student WHERE age NOT LIKE '%leo%'; 
```

### OR

> 查詢年龄为5岁或10岁的所有学生信息

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

```php
$student = new StudentTable();
$con['name'] = 'wula';
$con['age'] = 10;
$con['||name'] = 'jack';
$con['age '] = '5';
$res = $student->select('id,name,gender')->where($con)->toArray();

```

对应SQL：

```sql
SELECT id,name,gender FROM student AS Student WHERE name=`wula` AND age=10 OR name=`jack` AND age=5; 
```


### MATCH


```php
$student = new StudentTable();
$where['name Match'] = 'jack';
$res = $student->select('id,name,gender')->where($where)->toArray();

```
> 使用`Match`必须加全文索引`Full Text`而且mysql指定了最小字符长度，默认是4，必须要匹配大于4的才会有返回结果，可以用SHOW VARIABLES LIKE 'ft_min_word_len' 来查看指定的字符长度，也可以在mysql配置文件my.ini 更改最小字符长度，方法是在my.ini 增加一行 比如：ft_min_word_len = 2，改完后重启mysql即可。

对应SQL：

```sql
SELECT * FROM student AS Student WHERE MATCH(`name`) AGAINST (`jack`)
```

### REGEXP 

> 查询所有以`j`开头`k`结尾的学生信息

```php
$student = new StudentTable();
$where['name ~'] = '^j|k$';
$res = $student->select('id,name,gender')->where($where)->toArray();

```

对应SQL：

```sql
SELECT * FROM student AS Student WHERE `name` REGEXP `^j|k$`
```

### NOT REGEXP 

> 查询所有不以`j`开头`k`结尾的学生信息

```php
$student = new StudentTable();
$where['name !~'] = '^j|k$';
$res = $student->select('id,name,gender')->where($where)->toArray();

```

对应SQL：

```sql
SELECT * FROM student AS Student WHERE `name` NOT REGEXP `^j|k$`
```

### EXISTS 

> 查询学生语文成绩大于80分的学生信息

```php
$student = new StudentTable();
$grade   = new GradeTable();

$where['@'] = $grade->select('*')->where(['student_id'=>imv('Student.id'),'grade >'=>80,'course_id'=>1]);
$res = $student->select('*')->where($where)->toArray();

```

对应SQL：

```sql
SELECT * FROM student AS Student WHERE EXISTS (SELECT * FROM grade AS Grade WHERE `student_id` = Student.id AND `grade` > 80 AND `course_id`=1)
```

> 注意上面使用了`imv`方法，如果不使用会把`Student.id`转译为字符串，加上`imv`就是不需要转译！

### NOT EXISTS 

> 查询学生语文成绩小于80分的学生信息

```php
$student = new StudentTable();
$grade   = new GradeTable();

$where['!@'] = $grade->select('*')->where(['student_id'=>imv('Student.id'),'grade >'=>80,'course_id'=>1]);
$res = $student->select('*')->where($where)->toArray();

```

对应SQL：

```sql
SELECT * FROM student AS Student WHERE NOT EXISTS (SELECT * FROM grade AS Grade WHERE `student_id` = Student.id AND `grade` > 80 AND `course_id`=1)
```

### IS NULL 

> 查询`student`表中`name`字段中有空值的信息

```php
$student = new StudentTable();

$where['name $'] = NULL ;
$res = $student->select('*')->where($where)->toArray();

```

对应SQL：

```sql
SELECT * FROM student AS Student WHERE `name` IS NULL
```

### IS NOT NULL 

> 查询`student`表中`name`字段中没有空值的信息

```php
$student = new StudentTable();

$where['name $'] = 'abb' ;
$res = $student->select('*')->where($where)->toArray();

```

对应SQL：

```sql
SELECT * FROM student AS Student WHERE `name` IS NOT NULL
```
> `$where['name $'] = 'abb';`中`abb`这个字符串可以随意填写,有值就是不为空嘛！写个`NULL`就是`IS NULL`嘛！