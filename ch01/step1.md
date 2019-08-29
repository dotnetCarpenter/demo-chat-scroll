https://stackoverflow.com/questions/57367962/chat-does-not-scroll-to-the-bottom-when-i-use-jquery-load-method

[Back to index](../README.md)

Before jumping in and give the implementation in jQuery, let's
take a step back and implement this in a framework/library
agnostic way. That can then be either augmented or refactored to
use a library, like [jQuery][jquery], or a framework like
[Vue.js][vuejs].

We are going to look at best practice for front-end architecture,
Cascading Style Sheets (CSS) naming conventions and
the most common used Document Object Model (DOM) APIs.

## Architecture

The most used front-end architecture is Model View Controller
(MVC) or small deviations of MVC.
That means that our chat app has decoupled code that manages
how and where we get our data (Model), what a user can see -
presentation of our data (View) and the code that controls the Model and react to user actions (Controller).

![MVC - who speaks to who][mvc]

_As shown above; the Model never speaks to the View and vice versa._


## View

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
    <p class="chat__message">message 1</p>
    <p class="chat__message">message 2</p>
    ...
  </div>
  <button class="chat__toggle">Enable</button>
</section>
```

_`<section>` denote a block that can be reused on the same page
or across pages. `<p>` is a paragraph of text, in this case a
chat message. `<button>` conveys an action to enable/disable the
chat module. `<div>` has no semantic meaning but we will use the
element to measure scrolling position and add new `<p>` elements._


### CSS

More often than not, we need to create elements for styling
purposes. While you should know `::before` and `::after`, which
can be used to create hidden pseudo elements for styling purposes.
It's often necessary to create one or two elements for the sole purpose
of styling and/or programmatically measure/manipulate. In the case
that an element has no semantic meaning, we use `<div>` for block
elements and `<span>` for inline elements. If an element has a
semantic meaning, you should [search][html] for another element to
convey the meaning of your structure.

You probably also noticed that each HTML element in our chat has a
`class` attribute and their naming is somewhat consistent.
What I have used here is
[Block Element Modifier (BEM)][bem],
which guarantees that CSS does not cascade out of our chat module
to other parts of our app, as long as the Block name is unique
(it's conflict free).
This technique works well for both small and big apps and is
heavily optimized in all browsers as oppose to [CSSinJS][CSSinJS]
which has a negative impact on performance and is more difficult
to setup, whereas a naming convention has zero setup (except for
the setup happening in your brain).

The structure of [BEM][bem] is:

1. Block - The root element of your module.
2. Element - The elements inside your module.
3. Modifier - Changes to your block or your elements.

For our little example we will use the following CSS:

```css
.chat__output {
  height: 80px;

  overflow-y: scroll;

  transition: background-color 250ms;
}

.chat--disabled .chat__output {
  background-color: hsla(0, 0%, 0%, 0.4);
}

.chat--enabled .chat__output {
  background-color: hsla(0, 0%, 0%, 0);
}

.chat__message {
  margin: 0;
  padding: 0 .2em;

  line-height: 1.4em;
}

.chat__message:nth-child(odd) {
  background-color: hsla(0, 0%, 0%, 0.2);
}
```
_We don't absolutely have to style every BEM element, but
experience tells me that in a real world scenario, we probably
will. We have 1 state, which we visualize with a fading
transition of the background color. Our `.chat__message` is
currently a `<p>` element, which is a block element in CSS
terms (not [BEM][bem]) and has some browser styling by default.
We negate the default margin and add a little spacing for
readability. You should use a CSS normalize base for any
app that has considerable styling. A good one is
[normalize.css][cssNormalize]._


The key points of [BEM][bem] performance is:

1. [Standalone CSS selectors][cssSelector]. Except for state
modifiers.
2. [Parallelism, since styles are static][cssParallelism].
3. [Non-competing with the main thread since, since styles are
static and not applied via js][cssMainThread].
4. [Scalable/Distributed, since styles are not generated on a server][cssServerSide].

If the above has not convinced you, then we can take a lengthy
talk about it in another forum. I think it's an emotional topic
and we should really move on to talk about the Model.


## Model



[jquery]: https://api.jquery.com/
[vuejs]: https://vuejs.org
[mvc]: ./mvc.png "MVC - who speaks to who"
[html]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Content_sectioning "List of HTML elements, with description"
[CSSinJS]: https://cssinjs.org/ "One of many CSSinJS implementations"
[bem]: http://getbem.com/naming/ "BEM naming conventions"

[cssNormalize]: https://github.com/necolas/normalize.css

[cssSelector]: https://csswizardry.com/2011/09/writing-efficient-css-selectors/ "CSS Selectors Performance"
[cssParallelism]: https://hacks.mozilla.org/2017/08/inside-a-super-fast-css-engine-quantum-css-aka-stylo/ "Multi-core CSS rendering"
[cssMainThread]: https://developer.mozilla.org/en-US/docs/Tools/Performance/Scenarios/Intensive_JavaScript "All js blocks the browser - the question is for how long?"
[cssServerSide]: https://cssinjs.org/server-side-rendering?v=v10.0.0-alpha.24 "Since a browsers do work on a user's machine,
it does not matter if you have 1 or 1.000.000 simultaneous
users, but if you move the same work to your server, it DOES
matter if you have to do the same work 1 or 1.000.000 times!"