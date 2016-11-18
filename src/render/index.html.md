---
title: '一个小巧的PHP开发框架'
doctitle: '首页'
layout: 'default'

isHome: 'true'
level: 'level1'
docid: 'index'
order: 0
---

# 环境准备

在开始之前请确保你的PHP开发环境已经准备好啦:

1. PHP: 版本5.6以上并且安装了以下扩展： 
    - mbstring (必须,UTF8,UTF8,UTF8)
    - pdo, pdo_mysql (必须)
    - apcu （可选，生产环境推荐）
    - memcached (可选，需要缓存时安装)
    - redis（可选，需要基于Redis缓存时安装） 
2. WEB服务器: apache或者nginx。
    - **它们俩都需要支持重写功能**
3. MySQL: 版本5.6以上 (如果需要请安装).

> 如果你还没准备好开发环境，请移步到[开发环境配置](/dev-config.html)。

# 安装wula
目前推荐通过composer进行安装(wula正处于开发阶段，所以添加`-s beta`):

`composer create-project -s beta wula/wula`

安装完成之后你将看到一个崭新的炮架子！

> 友情提示:
>
> 如果你不了解composer,请移步[Composer](https://getcomposer.org/)或
> [Google](https://www.google.com/#q=composer)或
> [度娘](https://www.baidu.com/s?wd=composer)。
>
> [点我下载最新版Composer](https://getcomposer.org/download/)。


## wula目录结构

**wula**(`wula@php`)是[wulaphp]框架的炮架子，它为[wulaphp]框架提供`web`应用开发的基础目录结构:

<pre>
wula
|--conf # 配置目录，可通过CONF_DIR常量自定义
   |--cache_config.php # 缓存配置文件
   |--cluster_config.php # 分布式部署配置文件
   |--config.php # 应用配置文件，可通过.env(将.env.example复制到.env)文件进行配置
   |--dbconfig.php # 数据库配置文件，可通过.env文件中的db段进行配置
|--crontab # 定时任务运行目录，可随意命名，如果不需要定时任务可删除
   |--cron.php # 定时任务脚本, 通过crontab服务运行
|--extensions # 扩展目录, 可通过EXTENSION_DIR常量自定义
   |-- ... # 扩展的实现...
|--includes # 应用使用的第三方库（不可通过composer加载），可通过LIBS_DIR常量自定义
   |-- common.php # 第三方库加载入口。
|--logs # 目录日志，可通过LOGS_DIR常量自定义
|--tmp # 运行临时目录，可通过TMP_DIR常量自定义
|--vendor # composer库目录,不可自定义
|--wwwroot # 网站根目录，如果网站根目录不是此目录，需要修改WWWROOT_DIR常量值
   |--modules # 模块目录, 可通过MODULE_DIR常量修改。
      |--home # home模块
         |--classes # 模块类目录，此目录中的类文件可以按需自动加载(autoload) 
         |--controllers # 模块控制器目录
            |--HomeController.php # 默认控制器，首页请求由此控制器处理
         |--views # 视图目录
            |--index.tpl # 基于Smarty的视图模板文件
         |--bootstrap.php # 模块引导文件
      | -- ... # 其它模块
   |--themes # 网站前台主题目录,可通过THEME_DIR常量自定义
      |--default # 默认主题
         |--index.tpl # 网站首页模板
         |--404.tpl # 404页面模板
         |--template.php # 主题数据处理器定义文件 
   |--index.php # 网站入口,一般情况不需要修改.
|--.env.example # 环境配置示例文件
|--bootstrap.php # wulaphp引导文件
|--composer.json # composer配置文件
|--wula.php # wula炮架安装脚本
</pre>

上边的目录结构不复杂，一级目录有：`conf`,`crontab`,`extensions`,`includes`,`logs`,`tmp`,`vendor`,`wwwroot`

**起初，你只需要关注：__wwwroot__, 你的大部分开发都将在此目录下进行。**

> 注：
> 
> 1. 下文中的`your_project_public_dir`应为`wwwroot`目录的绝对路径.
> 2. 当`your_project_public_dir`目录是`wwwroot`的上级目录时，要将`WWWROOT_DIR`常量定义为`/wwwroot/`
> 3. `wwwroot`目录名可以自定义.
> 4. 以上所有常量的自定义都要放在`bootstrap.php`文件中.


# 配置 

通过composer安装完成之后，就可以配置apache或nginx来运行wula了。**以下配置不分操作系统**。

## apache 配置
- `apache` 需要重写功能支持
- 请检查`wwwroot`目录中的`.htaccess`文件，此文件必须存在.

### apache 虚拟主机配置
```
<VirtualHost *:80>
    <Directory "your_project_public_dir">
        Options FollowSymLinks
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>		
    ServerAdmin your-email-address
    DocumentRoot "your_project_public_dir"
    ServerName your_server_name
    # other directives can be here
</VirtualHost>
```

> 注:
>
> `your_project_public_dir` 应指是 `wwwroot`的绝对路径.
> 
> 配置完成后重启apache生效.

### apache 独立主机配置
修改apache的配置文件中的以下内容:

1. 修改DocumentRoot

```
DocumentRoot "your_project_public_dir"
```

2. 修改目录配置

```
<Directory "your_web_public_dir">
    Options FollowSymLinks -Indexes
    AllowOverride all
    Order allow,deny
    Allow from all
</Directory>
```

> 注:
>
> `your_project_public_dir` 应指是 `wwwroot`的绝对路径.
> 
> 配置完成后重启apache生效.

## nginx 配置 (推荐)
在nginx的配置中添加一个server如下：

```
server {
    listen       80;
    server_name  your_server_name;
    root your_project_public_dir;
    location / {
        index index.php index.html index.htm;
        if (!-e $request_filename){
            rewrite ^(.*)$ index.php last;
        }
    }
    location ~ /(modules|assets|themes)/.+\.(php[s345]?|tpl|inc)$ {
        return 404;
    }        
    error_page  404              /404.html;
    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root/$fastcgi_script_name;
        include        fastcgi_params;
    }
    location ~ /\.ht {
        deny  all;
    }
}
```

> 注:
>
> `your_project_public_dir`应是`wwwroot`的绝对路径.
>
> 如果你运行在linux,mac,bsd等系统下建议：
> - 将`127.0.0.1:9000`换为更高效的`unix:/tmp/php-fpm.sock`
> - 路径请根据根据实际情况做出调整.
>
> 配置完成后重新加载nginx的配置生效.

# 目录权限

1. 运行nginx或apache的用户对`tmp` 和 `logs`目录需要有可读可写权限.可通过`chmod 777 tmp logs`进行修改
2. 将`bootstrap.php`文件中的APPID常量修改为一个有意义的值且在同一个php运行环境此值不能重复.

> **再次提醒：如果你还没准备好开发环境，请移步到[开发环境配置](/dev-config.html)**。


# Hello wula!!

安装完成后通过浏览器访问[http://your_server_name/](http://your_server_name/) 看到以下输出说明安装成功：**Hello wula !!**

# BUG提交与参与

1. 如果任何问题或建议请到[issues](https://github.com/ninggf/wula/issues)提交。
2. 如果您对wula感兴趣，欢迎fork并提交您的代码。
3. 您还可以加入我们的QQ群: 371487281。

接下来你可以[立即开始](/get-started.html)了。

[wulaphp]: https://github.com/ninggf/wulaphp