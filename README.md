# slider

简单的模拟横竖滑动条的插件，支持a标签锚点。

## 使用


1. 引入 jQuery：

  ``` html
  <script src="/js/libs/jquery-1.11.3.min.js"></script>
  ```

2. 引入插件：

  ``` html

  <link rel="stylesheet" href="dist/css/boncui.slider.min.css">
  <script src="dist/js/boncui.slider.min.js"></script>

  <div class="first">...</div>

  ```

4. 调用：

  ``` javascript
   var first = document.querySelector('.first');
   BoncUI.slider(first, {
     width: '800px',
     height: '300px',
     gotoLeft:gotoLeft,
     gotoTop:gotoTop
  });

   ```

### Options

* width

  绑定的dom对象的宽，即如果内容大于定义width，则自动出现横向滑动条
  
  ``` javascript
  $('#page').byPagination({
    width: '800px',
  })
  ```
  
* height

  绑定的dom对象的高，即如果内容高于定义height，则自动出现纵向滑动条
  
* scrollBoxYWidth

  纵向滚动条底部的宽度，默认为8px
  
* scrollBoxXHeight

  横向滚动条底部的高度，默认为8px
  
* scrollBoxColor

  滚动条底部的颜色，默认为透明
  
* scrollBarColor

  滑动滚动条的颜色，默认为#a3becc
 
* gotoTop

  纵向滚动条回到最顶部，绑定dom对象
  
* gotoLeft

  横向滚动条回到最左边，绑定dom对象
  
注意： height 和 width 为必填参数，其他均为可选参数。

## Browser support

* Modern browsers
* Microsoft Internet Explorer 8.0+
