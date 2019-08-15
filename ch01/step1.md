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

[Block Element Modifier (BEM)](http://getbem.com/naming/ "BEM naming conventions")


[mvc]: ./mvc.png "MVC - who speaks to who"
