<?php
/**
 * 集群配置缓存.
 */
$config = new \wulaphp\conf\ClusterConfiguration();
$config->enabled(env('cluster.enabled', 0));
$host    = env('redis.host', 'localhost');
$port    = env('redis.port', 6379);
$db      = env('redis.db', 0);
$timeout = env('redis.timeout', 1);
$auth    = env('redis.auth');
$config->addRedisServer($host, $port, $db, $timeout, $auth);
return $config;
