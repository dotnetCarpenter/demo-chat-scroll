https://stackoverflow.com/questions/57367962/chat-does-not-scroll-to-the-bottom-when-i-use-jquery-load-method

[Back to index](../README.md)

I am going to show you how to implement, some of a very simple
and naive chat. Not in jQuery, because it seems that you still
need to _get_ the foundation of front-end development, but in
vanilla javascript (js).

We are going to look at best practice for front-end architecture,
CSS naming and the most useful DOM API's.

### Architecture

The most used front-end architecture is Model View Controller
(MVC) or small deviations of MVC.
That means that our chat app has decoupled code that manages
how and where we get our data (Model), what a user can see -
presentation of our data (View) and the code that controls the Model and react to user actions (Controller).

![MVC - who speaks to who][mvc]

_As shown above; the Model never speaks to the View and vice versa._


### View

A front-end View, mainly, consist of HTML and CSS.
HTML is pretty easy to grasp which is also the whole point of
HTML.
However, we do strive for semantic HTML. That is, HTML that
convey a meaning about the structure. This is both helpful for
the next developer, who need to read your code, for search
engines and screen readers.

For our simple chat we will use the following HTML:

```html
<section class="chat chat--disabled">
  <div class="chat__output">
    <p class="chat__message">
    <p class="chat__message">
  </div>
  <button class="chat__toggle">Enable</button>
</section>
```
[Block Element Modifier (BEM)](http://getbem.com/naming/ "BEM naming conventions")


[mvc]: ./mvc.png "MVC - who speaks to who"