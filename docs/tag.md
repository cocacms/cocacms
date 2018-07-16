# 标签文档
CocaCms内置模板的标签说明
## 标签列表
*  [category](#category)
*  [menu](#menu)
*  [list](#list)
*  [single](#single)
*  [hook](#hook)
*  [static](#static)
## category
### 标签作用
根据`ID`或`关键字`获取`树状`或`扁平`的栏目
### 用法
```html
{% category key,id,_res,buildTree,withMe %}
<!-- 内容 -->
{% endcategory %}
```
### 参数说明
参数  |类型  |说明  |默认值  |是否必填
-------------|-------------|-------------|-------------|-------------
key  |string  |栏目关键字  |-  |是（key，id二者必填一个）
id  |int  |栏目id  |-  |是（key，id二者必填一个）
_res  |string  |结果数据的变量名  |_res  |否
buildTree  |boolean  |结果数据是否是树形  |false  |否
withMe  |boolean  |是否包含自身  |false  |否
### 例子

```html
<div class="am-container am-g">
    {% category key='footer',_res='footerTree',buildTree=true,withMe=true %}
        <ul class="footer-category am-u-sm-12 am-u-md-8 am-cf">
        {% asyncEach item in footerTree %}
            <li>
            {{ item.name }}
            {% if(item.children and item.children.length > 0)%}
                <ul>
                {% asyncEach subitem in item.children %}
                <li>
                    <a href="{{ subitem.jump }}">
                    {{ subitem.name }}
                    </a>
                </li>
                {% endeach %}
                </ul>
            {% endif %}
            </li>
        {% endeach %}
        </ul>
    {% endcategory %}
</div>
```

### 其他说明
1.  可以通过结果数据中每一项的参数`jump`来做跳转，`jump`是标签自动生成的，你可以在上面的例子中看到使用方法。
2.  由于结果数据分为`扁平`和`树状`两种结果，所以将结果集放在一个变量`_res`中，数据由开发者根据具体情况遍历。

## menu
### 标签作用
根据`ID`获取`树状`或`扁平`的导航
### 用法
```html
{% menu id,_res,buildTree %}
<!-- 内容 -->
{% endmenu %}
```
### 参数说明
参数  |类型  |说明  |默认值  |是否必填
-------------|-------------|-------------|-------------|-------------
id  |int  |导航id，默认获取根节点即-1  |-1  |否
_res  |string  |结果数据的变量名  |_res  |否
buildTree  |boolean  |结果数据是否是树形  |false  |否
withMe  |boolean  |是否包含自身  |false  |否
### 例子

```html
<ul class="menu am-hide-sm-only am-cf" >
    {% menu buildTree=true %}
        {% asyncEach item in _res %}
            <li>
            <a href="{{ item.jump }}">
                {{ item.name}}
            </a>
            {% if (item.children and item.children.length > 0) %}
                <ul class="submenu animated">
                {% asyncEach subitem in item.children %}
                <li class="animated">
                    <a class="animated" href="{{ subitem.jump }}">
                    {{ subitem.name }}
                    </a>
                </li>
                {% endeach %}

                </ul>
            {% endif %}
            </li>
        {% endeach %}
    {% endmenu%}

</ul>
```

### 其他说明
1.  可以通过结果数据中每一项的参数`jump`来做跳转，`jump`是标签自动生成的，你可以在上面的例子中看到使用方法。
2.  由于结果数据分为`扁平`和`树状`两种结果，所以将结果集放在一个变量`_res`中，数据由开发者根据具体情况遍历。


## list
### 标签作用
根据模型等条件获取数据列表（可分页）
### 用法
```html
{% list model,name,item,withPage,_pager,page,pageSize,where,fields,order, %}
<!-- 内容 -->
{% endlist %}
```
### 参数说明
参数  |类型  |说明  |默认值  |是否必填
-------------|-------------|-------------|-------------|-------------
model  |boolean  |是否是自定义模型  |false  |否
name  |string  |模型关键字/数据表表名（如果是模型不需要加前缀）  |-  |是
item  |string  |每一条数据的变量名  |item  |否
withPage  |boolean  |是否分页  |true  |否
_pager  |string  |分页信息的变量名（全局）  |_pager  |否
page  |string\|int  |页码，由1开始  |1  |否
pageSize  |string\|int  |每页数据数量  |20  |否
where  |array  |条件  |[]  |否
fields  |string  |显示数据字段  |'*'  |否
order  |array  |排序  |[]  |否
### 例子
```html
<ul class="am-avg-sm-2 am-avg-md-3 am-thumbnails ">
    {% list model=true,name='product',page=ctx.query.page,where=[['active', 1]],pageSize=12,order=[['hot', 'desc']] %}
        <li class="item">
            <a href="{{ helper.urlFor('web-detail', { key: 'product', id: item.id }) | safe }}">
                <img class="am-thumbnail" src="{{ item.pic[0] }}" />
                <div class="title"> {{ item.name }} </div>
            </a>
        </li>
    {% endlist %}
</ul>
{% if (_pager.pageCount > 1) %}
<ul class="am-pagination">
    <li class="{{ '' if _pager.pre else 'am-disabled' }}"><a href="{{ helper.urlFor('me', { category: ctx.query.category, page: _pager.pre }) }}">&lt;</a></li>
    {% for i in range(1, _pager.pageCount + 1) -%}
    <li class="{{ 'am-active' if _pager.page === i else '' }}"><a href="{{ helper.urlFor('me', { category: ctx.query.category, page:i }) }}">{{i}}</a></li>
    {%- endfor %}
    <li class="{{ '' if _pager.next else 'am-disabled' }}"><a href="{{ helper.urlFor('me', { category: ctx.query.category, page: _pager.next }) }}">&gt;</a></li>

    <li style="color: #000; font-size: 1rem;">共{{ _pager.pageCount }}页</li>
</ul>
{% endif %}
```

### 其他说明
-  `_page`参数说明

参数  |类型  |说明
-------------|-------------|-------------
pre  |int\|null  |上一页页码，不存在上一页则为null
next  |int\|null  |下一页页码，不存在下一页则为null
pageCount  |int  |总共页数
page  |int  |当前页码
data  |array  |本页的全部数据结果集合，一般不常用到

> PS：当设置了分页时才有该变量，注意这个变量会设为全局变量，有可能会覆盖你的已经定义的数据，所以你可以根据情况设置`_page`的变量名称

## single
### 标签作用
根据模型等条件获取单条数据的详情
### 用法
```html
{% single model,name,_res,where,fields,order, %}
<!-- 内容 -->
{% endsingle %}
```
### 参数说明
参数  |类型  |说明  |默认值  |是否必填
-------------|-------------|-------------|-------------|-------------
model  |boolean  |是否是自定义模型  |false  |否
name  |string  |模型关键字/数据表表名（如果是模型不需要加前缀）  |-  |是
_res  |string  |数据的变量名  |_res  |否
where  |array  |条件  |[]  |否
fields  |string  |显示数据字段  |'*'  |否
order  |array  |排序  |[]  |否
### 例子
```html
{% single name='category',where=[['key', 'test' ]] %}
  {% single model=true,name='find',where=[['id', _res.bind]],_res='_bind_find' %}
    <div>test栏目绑定的find结果为{{ _bind_find.name }}</div>
  {% endsingle %}
{% endsingle %}
```

### 其他说明
无

## hook
### 标签作用
在模板中注入钩子，一般配合插件使用

### 用法
```html
{% hook name %}
```
### 参数说明

参数  |类型  |说明  |默认值  |是否必填
-------------|-------------|-------------|-------------|-------------
name  |string  |hook名称  |-  |是

### 例子
```html
{% hook 'appLoaded' %}
```

### 其他说明
参数中不需要写`name='appLoaded'`，直接传入`'appLoaded'`即可，具体用法请看例子


## static
### 标签作用
在模板中引入当前主题模板的静态资源

### 用法
```html
{% static url %}
```
### 参数说明

参数  |类型  |说明  |默认值  |是否必填
-------------|-------------|-------------|-------------|-------------
url  |string  |静态资源路径  |-  |是

### 例子
```html
<link rel="stylesheet" href="{% static 'css/app.css' %}">
<script src="{% static 'js/typed.min.js' %}"></script>
```

### 其他说明
参数中不需要写`url='css/app.css'`，直接传入`'css/app.css'`即可，具体用法请看例子
如当前的主题为`default`，则例子中输出结果为
```html
<link rel="stylesheet" href="http://xxxxx/static/default/css/app.css">
<script src="http://xxxxx/static/default/js/typed.min.js"></script>
```