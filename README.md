wula
==========
**wula**(`wula@php`)是[wulaphp]框架的炮架子，它为[wulaphp]框架提供`web`应用开发的基础目录结构:
<pre>
wula
|--conf # 配置目录，可通过CONF_DIR常量自定义
   |--cache_config.php # 缓存配置文件
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
|--artisan # wula命令行工具
</pre>


> 注：
> 
> 1. 下文中的`your_project_public_dir`应为`wwwroot`目录的绝对路径.
> 2. 当`your_project_public_dir`目录是`wwwroot`的上级目录时，要将`WWWROOT_DIR`常量定义为`/wwwroot/`
> 3. `wwwroot`目录名可以自定义.
> 4. 以上所有常量的自定义都应该放在`bootstrap.php`文件中.


## 1 安装
目前推荐的安装方式composer:

`composer create-project wula/wula`

## 2. 配置 
推荐使用`nginx`的配置.

### 2.1 apache 配置
- `apache` 需要开启重写功能支持
- 请检查`wwwroot`目录中的`.htaccess`文件，此文件必须存在.

#### 2.1.1 apache 虚拟主机配置
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

#### 2.1.2 apache 独立主机配置
修改apache的配置文件中的以下内容:
- 修改DocumentRoot
```
DocumentRoot "your_project_public_dir"
```
- 修改目录配置
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

### 2.2 nginx 配置 (推荐)
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
> `your_project_public_dir` 应指是 `wwwroot`的绝对路径.
> 
> 配置完成后重新加载nginx的配置生效.

## 环境检测

- 运行nginx或apache的用户对`tmp` 和 `logs`目录需要有可读可写权限.可通过`chmod 777 tmp logs`进行修改
- 将`bootstrap.php`文件中的APPID常量修改为一个有意义的值且在同一个php运行环境此值不能重复.

## 安装验证

- 安装完成后通过浏览器访问[http://your_server_name/](http://your_server_name/) 看到以下输出说明安装成功：**Hello wula !!**

### BUG提交与参与
- 如果任何问题或建议请到[issues](https://github.com/ninggf/wula/issues)提交。
- 如果您对wula感兴趣，欢迎fork并提交您的代码。
- 您还可以加入我们的QQ群: 371487281。
- 了解wulaphp请传送至[wulaphp].

[wulaphp]: https://github.com/ninggf/wulaphp