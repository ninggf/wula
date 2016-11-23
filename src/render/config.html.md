---
title: '配置你的wulaphp应用'
layout: 'default'

doctitle: '配置'
level: 'level2'
parent: 'start'
order: 
---

# wulaphp的配置

『约定大于配置』，约定好的，就不需要配置，减少团队协作难度。但是没有配置的框架肯定是玩不转的，该配置的还得配置。
wulaphp的配置分为以下几种:

1. 默认配置
2. 数据库配置
3. 缓存配置
4. 分布式缓存配置（实验性质）

# 默认配置

wulaphp的默认配置文件是`conf/config.php`,打开它，默认的配置是这样的：

```php 
<?php
/**
 * 应用配置文件.
 */
return ['debug' => env('debug', DEBUG_DEBUG)];
```

此文件需要返回一个配置数组，**请在此添加你的配置**，嗯，配置就是这么简单。

配置的读取也简单，有以下几种方式：

1. `App::config()`可以获取config.php文件中返回的配置数组,接下来随你整:
    ```php
    $cfgs  = App::config();
    $debug = $cfgs['debug'];
    echo $debug;
    ```
2. `App::cfg($key,$default='')` 读取配置数组中的$key对应的配置如:
   ```php
   $debug = App::cfg('debug',DEBUG_DEBUG);
   ```
3. `App::bcfg($key,$default=false)` 读取bool型的配置.
4. `App::icfg($key,$default=0)` 读取int型的配置.

> 注意: $default为配置项不存在时的默认值。

## 读取配置的高级方式

如果你的配置文件是这样的:
```php 
return [
	'debug' => env('debug', DEBUG_DEBUG),
	'app'   => [
	    'url'    => 'http://www.wulaphp.com/',
	    'author' => [
                'name'  => 'Leo',
                'email' => 'windywany@gmail.com'
	    ]
	
];
```
你可以这样读取app配置里的url配置:

```php 
$url = App::cfg('app.url');
```

你可以这样读取app作者的姓名与邮件:

```php 
$authorName = App::cfg('app.author.name');
$email      = App::cfg('app.author.email');
```
或者:
```php 
$author     = App::cfg('app.author');
$authorName = $author['name'];
$email      = $author['email'];
```
随便你了。

## 配置的高级方式

配置文件中：

```php 
return ['debug' => env('debug', DEBUG_DEBUG)];
```

看到`env`函数了吗？你看到了，肯定的。它很**牛逼**的，它可以从`.env`文件(ini格式)中读取相同的字段。
如果你的目录下没有这个文件（linux，macos 下它是隐藏的可以通过`ls -a`看到它），
你可以新建一个空白的ini文件并将它命名为`.env`或者将`.env.example`重命名为`.env`.

`.env.example`中默认的文件内容如下:

```ini
[app]
debug    = DEBUG_DEBUG

[db]
;db.driver = MySQL
;db.host = localhost
;db.port = 3306
;db.name = test
;db.charset = UTF8MB4
;db.user = leo
;db.password = 888888
;db.options =

[cache]
;cache.enabled = 0
;cache.type = [redis|memcached]

#for redis
;redis.host = localhost
;redis.port = 6379
;redis.db  = 0
;redis.auth =

#for memcached
;memcached.host = localhost
;memcached.port = 11211
;memcached.weight = 100

[cluster]
;cluster.enabled = 0
;redis.host = localhost
;redis.port = 6379
;redis.db  = 0
;redis.auth =
```

就是一个简单的ini文件。 `db`段为默认数据库配置段；`cache`为缓存配置段；`cluster`为集群配置段(先忽视它).

**有了它，多人协同开发时，你不需要改变`config.php`文件了，配置文件再也不会冲突了，哈哈。**

## 自定义配置文件

`config.php`是wulaphp的默认配置文件，从它里边读取配置这样的：

```php
   $debug = App::cfg('debug',DEBUG_DEBUG);
```

那我们如何将配置定义在其它文件里呢？简答很简单，在`conf`目录下创建一个以`_config.php`结尾的的文件就行，
比如，`my_config.php`,它的内容可以参照`config.php`来写，返回一个数组就行：

```php
<?php
return ['title'=>'另一个配置文件'];
```

接下来就是读取啦，你只需要这样：`App::cfg('title@my')`就能得到:「另一个配置文件」。其它还用多说吗？^_^

> 特别注意：
> `title@my`中的'`my`'为配置名,默认配置名为'`default`',后边会用到。
> 

## 多环境（模式）下的配置

理论上有了.evn，我们不再需要多种环境，但是为了性能（APCU缓存）wula还是需要定义开发模式的。wulaphp的默认开发模式为:**dev**。
开发模式的定义有二种方法：

### 在nginx或apache中配置

1. nginx添加fastcgi_param:
```
location ~ \.php$ {
    ...
    fastcgi_param  APPMODE  pro;
    ...
}   
```

2. apache通过SetEnv指令（需要安装mod_env）:
```
SetEnv APPMODE  pro
```

### 在bootstrap.php中配置

在`bootstrap.php`文件中定义常量:**APP_MODE**，值为字符数字的组合。

```php
define('APP_MODE','pro');
```

上边配置中的`pro`即为开发模式名称。**强烈建议通过nginx或apache的方式配置开发模式**。

### 配置文件加载

wulaphp配置文件的加载流程:

<pre>
配置名是'default'？
|
|- YES - config_{APP_MODE}.php 存在？  
|        | - YES - 加载config_{APP_MODE}.php
|        | - NO  - 加载config.php
|- NO  - {$name}_config_{APP_MODE}.php 存在?
|        | - YES - 加载{$name}_config_{APP_MODE}.php
|        | - NO  - 加载{$name}_config.php
</pre>

看不明白？来看代码：

```php
public function loadConfig($name = 'default') {
    $config = new Configuration($name);
    if ($name == 'default') {
        $_wula_config_file = APPROOT . CONF_DIR . '/config';
    } else {
        $_wula_config_file = APPROOT . CONF_DIR . '/' . $name . '_config';
    }
    $wula_cfg_fiels [] = $_wula_config_file . '_' . APP_MODE . '.php';
    $wula_cfg_fiels [] = $_wula_config_file . '.php';
    foreach ($wula_cfg_fiels as $_wula_config_file) {
        if (is_file($_wula_config_file)) {
            $cfg = include $_wula_config_file;
            if ($cfg instanceof Configuration) {
                $cfg->setName($name);
                $config = $cfg;
            } elseif (is_array($cfg)) {
                $config->setConfigs($cfg);
            }
            break;
        }
    }
    unset ($_wula_config_file, $wula_cfg_fiels);

    return $config;
}
```

# 数据库配置

wulaphp目前只支持MySQL,通过PDO_MYSQL方式访问。数据库的配置在wulaphp中是不能直接读取的，数据库配置由`App::db()`使用.


## 默认数据库配置

默认数据库配置文件为`conf/dbconfig.php`，不同数据库配置类似[自定义配置文件](#h-4)，只是需要使用`App::db('name')`来获取数据库链接.

`conf/dbconfig.php`文件内容如下:

```php
$config = new \wulaphp\conf\DatabaseConfiguration('default');
$config->driver(env('db.driver', 'MySQL'));
$config->host(env('db.host', 'localhost'));
$config->port(env('db.port', '3306'));
$config->dbname(env('db.name', ''));
$config->encoding(env('db.charset', 'UTF8MB4'));
$config->user(env('db.user', 'root'));
$config->password(env('db.password', ''));
$options = env('db.options', '');
```
以上内容不需要一一解释了吧^_^

## 自定义数据库配置

按[自定义配置文件](#h-4)的规定在`conf`下新建文件`yourdb_dbconfig.php`，内容按你的实际情况来。

接下来你可以：

1. `$db = App::db('yourdb')`
2. `$table = App::table('test','yourdb')`
3. `$table = new SimpleTable('test','yourdb')`
4. `$user  = new UserTable('yourdb')`

真不应该提供4种方式进行数据访问。

# 缓存配置

系统内置了基于`Redis`和`memcached`的缓存，请你按需要在`conf/cache_config.php`或`.env`文件中配置，配置好了之后，你就可以尽情向下边这样使用缓存了：

```php
$cache = Cache::getCache();
$cache->add('key','content will be cached');
```

## 基于Redis配置

1. conf/cache_config.php

```php
$config = new \wulaphp\conf\CacheConfiguration();
$config->enabled(env('cache.enabled', 0));
$type = env('cache.type');
if ($type == 'redis') {
	$host    = env('redis.host', 'localhost');
	$port    = env('redis.port', 6379);
	$db      = env('redis.db', 0);
	$timeout = env('redis.timeout', 1);
	$auth    = env('redis.auth');
	$config->addRedisServer($host, $port, $db, $timeout, $auth);
	$config->setDefaultCache(CACHE_TYPE_REDIS);
} elseif ($type == 'memcached') {
	$config->setDefaultCache(CACHE_TYPE_MEMCACHED);
	$hosts = explode(',', env('memcached.host', 'localhost'));
	$ports = explode(',', env('memcached.port', 11211));
	$ws    = explode(',', env('memcached.weight', 100));
	foreach ($hosts as $idx => $host) {
		$port = isset($ports[ $idx ]) ? $ports[ $idx ] : $ports[0];
		$w    = intval(isset($ws[ $idx ]) ? $ws[ $idx ] : $ws[0]);
		if ($w > 100 || $w < 1) {
			$w = 100;
		}
		$config->addMemcachedServer($host, $port, $w);
	}
}
return $config;
```

2. .env

```ini
[cache]
cache.enabled = 1
cache.type = redis
redis.host = localhost
redis.port = 6379
redis.db  = 0
redis.auth =
```

## 基于memcached配置

1. conf/cache_config.php

见Redis配置。

2. .env

```ini
[cache]
cache.enabled = 1
cache.type = memcached
memcached.host = localhost
memcached.port = 11211
memcached.weight = 100
```

以上配置请按需修改。

# 分布式缓存配置（实验性质）

此为实验性质，先不聊了。