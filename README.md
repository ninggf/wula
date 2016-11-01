# 快速开始

## 1. 安装
### 1.1 通过comopser安装
composer create-project -s beta wula/wula

### 1.2 下载或clone
- 从github下载[https://github.com/ninggf/wula/releases]最新版本
- `git clone https://github.com/ninggf/wula.git`
> 说明:
> 
> 下载并解压或clone完成后需要执行 `composer update` 下载相关依赖.

## 2. 配置
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
```
DocumentRoot "your_project_public_dir"
```
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

### 2.2 nginx 配置
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

- 安装完成后通过浏览器访问[http://your_server_name/] 看到以下输出说明安装成功：**Hello wula!!**
- 安装完成后通过浏览器访问[http://your_server_name/backend/home] 看到以下输出说明安装成功：**Hello wula!!**

### BUG提交与参与
- 如果任何问题或建议请到[https://github.com/ninggf/wula/issues]提交。
- 如果您对wula感兴趣，欢迎fork并提交您的代码。
- 您还可以加入我们的QQ群: 371487281。
- 了解wulaphp请传送至[https://github.com/ninggf/wulaphp].