---
title: 'wula中的简单模型封装-SimpleTable'
layout: 'default'

doctitle: '简单模型'
level: 'level3'
parent: 'db'
order: 3
author: 'wangwei'
---
# 简单模型

wula中的简单模型封装`wulaphp\db\SimpleTable`很简单，`SimpleTable`继承了`Table`类，
当我们使用一张表的时候只需要简单的实例化一下`SimpleTable`一下，轻松进行CURD操作，具体实例如下：

```php
$student = new SimpleTable('student');
$student->alias('stu');
$res = $student->select('*')->where(['age'>10])->toArray();
```
> `SimpleTable`简单模型。可以实现所有连贯操作，不需要建立一个模型就可以实现所有连贯操作！是不是很简单！