---
title: '使用wula进行数据高级查询'
layout: 'default'

doctitle: '高级查询'
level: 'level3'
parent: 'db'
order: 100
author: 'wangwei'
---

# 高级查询


## where条件查询

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['name'] = 'wula';
$where['status'] = 1;
$res = $test->select($fields)->where($where)->toArray();
//return array;
```
> wulaphp 还提供`find($fields, $where)`查询方法，具体实例如下：

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['name'] = 'wula';
$where['status'] = 1;
$res = $test->find('id,name',$where);
//return array;
```
## 区间查询

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['id >'] = 1;
$where['create_time >'] = $start_time;
$where['create_time <'] = $end_time;
//$res = $test->find('id,name',$where);
$res = $test->select('id,name')->where($where)->toArray();
//return array;
```
## 模糊查询

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['name like'] = '%wula%';
//$res = $test->find('id,name',$where);
$res = $test->select('id,name')->where($where)->toArray();
//return array;
```

## 统计查询

### 查询符合条件的总条数

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['id in'] = array(1,2,3);
$where['status'] = 1;
$res = $test->select('*')->where($where)->count();
//return int;
```


### 查询某个字段的sum,max,min,avg，比如我们查询id：

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['status'] = 1;
$res1 = $test->select(imv('sum(id)', 'sum_id'))->where($where)->get();
$res2 = $test->select(imv('max(id)', 'max_id'))->where($where)->get();
$res3 = $test->select(imv('min(id)', 'min_id'))->where($where)->get();
$res4 = $test->select(imv('avg(id)', 'avg_id'))->where($where)->get();
//return int;
```
> 上面的sql为`SELECT sum(id) AS sum_id FROM test where status=1`,
> 所有sql的统计都可以这么用！

## 升序，降序查询

### 升序查询,`asc`

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['id >'] = 0;
$where['status'] = 1;
$res = $test->select('*')->where($where)->asc('create_time')->toArray();
//return array;
```

### 降序查询,`desc`

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['id >'] = 0;
$where['status'] = 1;
$res = $test->select('*')->where($where)->desc('create_time')->toArray();
//return array;
```
> 升序降序你也可以使用排序大法`sort($field,$order)`如`sort('id','desc')`或者`sort('id','asc')`;

##  联合查询

```php
$test1 = new Test1Table(); //实例化model方法
//$test1 = new SimpleTable('test1');//加载SimpleTable类写法
//$test1 = App::table('test1');  //加载App类写法
$where['id >'] = 0;
$where['status'] = 1;
$res = $test1->select('Test1.*,t2.*')->left('test2 as t2','Test1.id','t2.tid')->where($where)->desc('Test1.create_time')->toArray();
//return array;
```
> [ 特别说明 ]：请注意，请注意，请注意重要的事情说三遍！
>> wulaphp会默认将表名转为首字母大写的表名，如`wula`会转为`Wula`;如果你想as一个新的名字请使用重命名大法`alias('name');`给你们一个例子:

```php
$test1 = new Test1Table(); //实例化model方法
//$test1 = new SimpleTable('test1');//加载SimpleTable类写法
//$test1 = App::table('test1');  //加载App类写法
$test1->alias('t1');
$where['id >'] = 0;
$where['status'] = 1;
$res = $test1->select('t1.*,t2.*')->left('test2 as t2','t1.id','t2.tid')->where($where)->desc('t1.create_time')->toArray();
//return array;
```

> 当然如果你不喜欢上面的方法你也使用：

```php
$db = App::db();
$where['id >'] = 0;
$where['status'] = 1;
$res = $db->select('t1.*,t2.*')->from('test1','t1')->left('test2 as t2','t1.id','t2.tid')->where($where)->desc('t1.id')->toArray();
//return array;
```
> 上面的写法取决于你的喜好！想怎么写就怎么写，wula都将满足你！`let's do it`!

## 分页

```php
$test = new TestTable(); //实例化model方法
//$test = new SimpleTable('test');//加载SimpleTable类写法
//$test = App::table('test');  //加载App类写法
$where['id >'] = 0;
$where['status'] = 1;
$res = $test->select('*')->where($where)->limit($start,$limit)->sort('id','desc')->toArray();
//return array;
$page_total = count($res);
```






