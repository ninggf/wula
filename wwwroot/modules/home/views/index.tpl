<html>
<head>

</head>
<body>
{$nihao} <br/>it works!!<br/>
{'~test/save'|app}<br/>
{'home\controllers\HomeController'|action}<br/>
{'home\controllers\HomeController::set'|action}<br/>
{'home\controllers\TestController'|action}<br/>
<a href="{'home\controllers\TestOkController'|action}">{'home\controllers\TestOkController'|action}</a><br/>
{'a.png'|here}
{if $workspaceView}
    {include $workspaceView}
{/if}
</body>
</html>

