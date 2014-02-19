<ul>
	<div class="title1">A Multi-Layer Menu Using Plain HTML+CSS (no CSS3 required!)</div>
	<ul>
		There are plenty of clunky/image-ridden, javascript-heavy or Flash/Actionscript-infested menus out there.
		While they usually get the job done, it's all too easy for them to become a nightmare due to:
		<li>Conflicts with code from other JS/JQuery plugins</li>
		<li>Conflicts with other CSS rules</li>
		<li>Slower loading/execution times</li>
		<li>Maintenance/development, when you have a zillion CSS/JS/HTML files to juggle in a rapidly growing project</li>
		<br />
		That, and who wants to use all those extra images and all that extra code/logic?
		Or to be forced to use a plugin, 99% of whose features you don't utilize?
		This is a much simpler, cleaner and more elegant way to take care of just about any dropdown menu.
		<br /><br />
		Before I go on, the CSS-only approach does have 1 notable shortcoming:
		<li>
			In its basic form, this CSS menu is entirely dependent on the :hover event.
			For mobile/touchpad devices, <a target="_blank" href="/shenanigans/nested_cssmenu_mobile">a little Javascript becomes necessary</a>.
		</li>
		<br />
		This tutorial is as much about explaining what's going on as providing the example.
		If you only wish to see what the finished code looks like, scroll down to the very bottom.
		So, in the spirit of this website, let's see what a little old-school text editing can do!
		<br /><br />
		The cornerstone of just about any HTML/CSS-only menu consists of two ideas:
		<li>
				It's possible to continue narrowing down a CSS selector after special commands such as hover/after/before:
				<pre class="prettyprint lang-css">
.element:hover .element2 {
	display: inline-block;
}
				</pre>
			This means we can do shenanigans such as toggling the display of a contained element via a CSS's hover:
			<pre class="prettyprint lang-css">
.element .element2 {
	display: none;
}

.element:hover .element2 {
	display: inline-block;
}
			</pre>
		</li>
		<li>
			The <a href="http://www.w3schools.com/cssref/sel_element_gt.asp">nearest-child selector</a>.
			<pre class="prettyprint lang-css">
/* every element with class 'element2' whose immediate parent has class 'element1' */
element >.element2 {
	color: green;
}
			</pre>
		</li>
	</ul>
</ul>



<ul>
	So, what do we get if we combine them?
	Well, we can have an element (say, a menu item) display its child element (say, a list of its submenus) only when a user hovers over the element.
	If the child element contains elements similar to itself (say, multiple-nested menus), they can be excluded by using the nearest-child selector.
	Based off these 2 CSS features, these 4 rules perfectly describe just about any menu out there:

	<pre class="prettyprint lang-css">
/*
* The block/inline-block can be replaced by any other valid value, as long as it's not 'none'
* However, I recommend sticking with block and inline-block for each rule.
*/
.cssmenu-item {
	display: inline-block;
}

.cssmenu-item-list {
	display: none;
	position: absolute;
}

.cssmenu-item-list .cssmenu-item {
	display: block;
}

.cssmenu-item:hover > .cssmenu-item-list {
	display: inline-block;
}
	</pre>
</ul>



<ul>
	<div>
	So, just with those 4 CSS rules, we are now capable of building dropdown menus of any complexity and any structure and shape.
	We can use CSS rules to further coerce the menus into vertical/horizontal/diagonal bars of any sort.
	The following example will cover the most common navigation menu, where
	<li>the main links are a horizontal bar</li>
	<li>each main link consists of a vertical dropdown list of more submenus, possibly with multiple layers.</li>

	Below is an example of some (very) basic positioning, shape, borders and coloring.
	<br />
	(This website's menu is actually just a slightly fancier version of this example.)

	<br /><br />
	<div class="title2">the example in action</div>
	<style>
	.cssmenu-item {
		display: inline-block;
	}

	.cssmenu-item-list {
		display: none;
		position: absolute;
	}

	.cssmenu-item-list .cssmenu-item {
		display: block;
	}

	.cssmenu-item:hover > .cssmenu-item-list {
		display: inline-block;
	}



	.cssmenu-item {
		background-color: white;
		border: 1px solid black;
		min-width: 5em;
	}

	.cssmenu-item:hover {
		background-color: #eeeeee;
	}

	.cssmenu-item a {
		color: blue;
		display: block;
	}

	.cssmenu-item a {
	}

	.cssmenu-item-list {
		margin-left: 2em;
	}
	</style>
	<div class="cssmenu" id="#cssmenu-example">
		<div class="cssmenu-item">
			<a target="" href="#cssmenu-example">link 1 (single-layered subcategories)</a>
			<div class="cssmenu-item-list">
				<div class="cssmenu-item">
					<a target="" href="#cssmenu-example">link 1.1</a>
				</div>
				<div class="cssmenu-item">
					<a target="" href="#cssmenu-example">link 1.2</a>
				</div>
				<div class="cssmenu-item">
					<a target="" href="#cssmenu-example">link 1.3</a>
				</div>
				<div class="cssmenu-item">
					<a target="" href="#cssmenu-example">link 1.4</a>
				</div>
				<div class="cssmenu-item">
					<a target="" href="#cssmenu-example">link 1.5</a>
				</div>
			</div>
		</div>
		<div class="cssmenu-item">
			<a href="#cssmenu-example">link 2 (multi-layered subcategories)</a>
			<div class="cssmenu-item-list">
				<div class="cssmenu-item">
					<a target="" href="#cssmenu-example">link 2.1</a>
					<div class="cssmenu-item-list">
						<div class="cssmenu-item">
							<a target="" href="#cssmenu-example">link 2.1.1</a>
							<div class="cssmenu-item-list">
								<div class="cssmenu-item">
									<a target="" href="#cssmenu-example">link 2.1.1.1</a>
								</div>
							</div>
						</div>
						<div class="cssmenu-item">
							<a target="" href="#cssmenu-example">link 2.1.2</a>
							<div class="cssmenu-item-list">
								<div class="cssmenu-item">
									<a target="" href="#cssmenu-example">link 2.1.2.1</a>
								</div>
							</div>
						</div>
						<div class="cssmenu-item">
							<a target="" href="#cssmenu-example">link 2.1.3</a>
						</div>
					</div>
				</div>
				<div class="cssmenu-item">
					<a target="" href="#cssmenu-example">link 2.2</a>
					<div class="cssmenu-item-list">
						<div class="cssmenu-item">
							<a target="" href="#cssmenu-example">link 2.2.1</a>
						</div>
					</div>
				</div>
				<div class="cssmenu-item">
					<a target="" href="#cssmenu-example">link 2.3</a>
				</div>
			</div>
		</div>
		<div class="cssmenu-item">
			<a target="" href="#cssmenu-example">link 3 (no subcategories)</a>
		</div>
	</div>

	<div class="title2">code for the example</div>
	<pre class="prettyprint lang-html">
&lt;style&gt;
/* the 4 essential rules */
.cssmenu-item {
	display: inline-block;
}

.cssmenu-item-list {
	display: none;
	position: absolute;
}

.cssmenu-item-list .cssmenu-item {
	display: block;
}

.cssmenu-item:hover > .cssmenu-item-list {
	display: inline-block;
}



/* basic styling, to make the menu elements stand out and position in a legible manner when triggered. */
.cssmenu-item {
	background-color: white;
	border: 1px solid black;
	min-width: 5em;
}

.cssmenu-item:hover {
	background-color: #eeeeee;
}

.cssmenu-item a {
	color: blue;
	display: block;
}

.cssmenu-item a {
}

.cssmenu-item-list {
	margin-left: 2em;
}
&lt;/style&gt;

&lt;!--
And now, the HTML for this particular example.
Note that I purposely use specifically named classes and nothing else.
This is to remain as unobtrusive as possible to any other styling and plugins on the page.
I encourage everyone else to do the same, as it is part of one of the Coding Virtues.
--&gt;
&lt;div class="cssmenu"&gt;
	&lt;div class="cssmenu-item"&gt;
		&lt;a target="" href="#cssmenu-example"&gt;link 1 (single-layered subcategories)&lt;/a&gt;
		&lt;div class="cssmenu-item-list"&gt;
			&lt;div class="cssmenu-item"&gt;
				&lt;a target="" href="#cssmenu-example"&gt;link 1.1&lt;/a&gt;
			&lt;/div&gt;
			&lt;div class="cssmenu-item"&gt;
				&lt;a target="" href="#cssmenu-example"&gt;link 1.2&lt;/a&gt;
			&lt;/div&gt;
			&lt;div class="cssmenu-item"&gt;
				&lt;a target="" href="#cssmenu-example"&gt;link 1.3&lt;/a&gt;
			&lt;/div&gt;
			&lt;div class="cssmenu-item"&gt;
				&lt;a target="" href="#cssmenu-example"&gt;link 1.4&lt;/a&gt;
			&lt;/div&gt;
			&lt;div class="cssmenu-item"&gt;
				&lt;a target="" href="#cssmenu-example"&gt;link 1.5&lt;/a&gt;
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
	&lt;div class="cssmenu-item"&gt;
		&lt;a target="" href="#cssmenu-example"&gt;link 2 (multi-layered subcategories)&lt;/a&gt;
		&lt;div class="cssmenu-item-list"&gt;
			&lt;div class="cssmenu-item"&gt;
				&lt;a target="" href="#cssmenu-example"&gt;link 2.1&lt;/a&gt;
				&lt;div class="cssmenu-item-list"&gt;
					&lt;div class="cssmenu-item"&gt;
						&lt;a target="" href="#cssmenu-example"&gt;link 2.1.1&lt;/a&gt;
						&lt;div class="cssmenu-item-list"&gt;
							&lt;div class="cssmenu-item"&gt;
								&lt;a target="" href="#cssmenu-example"&gt;link 2.1.1.1&lt;/a&gt;
							&lt;/div&gt;
						&lt;/div&gt;
					&lt;/div&gt;
					&lt;div class="cssmenu-item"&gt;
						&lt;a target="" href="#cssmenu-example"&gt;link 2.1.2&lt;/a&gt;
						&lt;div class="cssmenu-item-list"&gt;
							&lt;div class="cssmenu-item"&gt;
								&lt;a target="" href="#cssmenu-example"&gt;link 2.1.2.1&lt;/a&gt;
							&lt;/div&gt;
						&lt;/div&gt;
					&lt;/div&gt;
					&lt;div class="cssmenu-item"&gt;
						&lt;a target="" href="#cssmenu-example"&gt;link 2.1.3&lt;/a&gt;
					&lt;/div&gt;
				&lt;/div&gt;
			&lt;/div&gt;
			&lt;div class="cssmenu-item"&gt;
				&lt;a target="" href="#cssmenu-example"&gt;link 2.2&lt;/a&gt;
				&lt;div class="cssmenu-item-list"&gt;
					&lt;div class="cssmenu-item"&gt;
						&lt;a target="" href="#cssmenu-example"&gt;link 2.2.1&lt;/a&gt;
					&lt;/div&gt;
				&lt;/div&gt;
			&lt;/div&gt;
			&lt;div class="cssmenu-item"&gt;
				&lt;a target="" href="#cssmenu-example"&gt;link 2.3&lt;/a&gt;
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
	&lt;div class="cssmenu-item"&gt;
		&lt;a target="" href="#cssmenu-example"&gt;link 3 (no subcategories)&lt;/a&gt;
	&lt;/div&gt;
&lt;/div&gt;
	</pre>
</ul>
