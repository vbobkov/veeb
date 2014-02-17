<ul>
	Continuing where the <a target="_blank" href="/shenanigans/nested_cssmenu"> nested CSS Menu tutorial left off</a>, let us address the mobile/touchpad issue.
	The solution is essentially 1 well-placed event bind, but there's a lot of logic packed into very few lines of code.  In my example, I shall use $.delegate() instead of $.bind(), but that's mostly a personal preference.
	So, let's first assume a few things:
	<li>We wish to keep the hover functionality.</li>
	<li>We wish to expand menus on a touch start/click event, if they are not already expanded.</li>
	<li>If they are already expanded, we wish for them to behave like they normally would, if clicked.</li>
	<br />

	The finished JQuery code is at the bottom of the page, and is a rather small piece of copy/paste code.
	Once again, there is going to be a lot going on, so let's take it one step at a time.
	First, determine what events we are modifying:
	<li>touchstart - touchpads exist on most mobile devices, and we have to assume click will not always be there to rescue us</li>
	<li>click - if click is there, touchstart isn't, AND hover/mouseover is absent as well (which can and does happen)</li>
	<li>either way, one of these 2 events WILL be there for us to use</li>
	<br />

	Now, let's determine what set of elements we need to capture the events for.  This one is trickier than it looks, because we have to account for users clicking/hvoering outside of the menus:
	<li>the menu items (in this case, .cssmenu-item)</li>
	<li>the submenus (in this case, .cssmenu-item-list)</li>
	<li>everything on the page (if the user wants to close the menu without making a selection)</li>
	<li>so really, everything on the page</li>

	So, the event bind will have to be on everything on the page, for touchstart and click events, like so:
	<pre class="prettyprint lang-js">
$(document).ready(function() {
	// bind can also be used (line comment below), but I prefer delegate
	// $('.cssmenu-item').bind('click touchstart', function(event) {
	$(document).delegate('*', 'click touchstart', function(event) {
	});
});
	</pre>

	Let's start by assigning commonly used elements:
	<pre class="prettyprint lang-js">
$(document).ready(function() {
	$(document).delegate('*', 'click touchstart', function(event) {
		var menu = $(this).closest('.cssmenu-item'); // get the menu item the click/touch event is triggered inside
		var submenu = menu.find('>.cssmenu-item-list'); // get any submenus items inside the menu item
	});
});
	</pre>

	Next, there is exactly 3 logic scenarios we have to account for:
	<li>the user clicked on a menu item which is already open, or has no submenu (let the click/touch event execute normally, which in this case means going to the hyperlinked page via the anchor tag)</li>
	<li>the user clicked on a menu item which has a submenu and isn't open (expand the submenu, but also close any menu expansions outside this one)</li>
	<li>the user has clicked somewhere outside the menu (close any existing submenu expansions)</li>
	<pre class="prettyprint lang-js">
$(document).ready(function() {
	$(document).delegate('*', 'click touchstart', function(event) {
		var menu = $(this).closest('.cssmenu-item');
		var submenu = menu.find('>.cssmenu-item-list');

		if(submenu.length > 0) { // the user is clicking inside a menu item with a submenu
			// do not let this event bubble, or triggering a click on this will bubble up to, say, the html body,
			// which will result in our else {} clause inadvertently closing all submenus
			event.stopPropagation();

			if(submenu.css('display') == 'none') { // looks like this menu item has a submenu, and the submenu is not open
				// do not let the default event execution fire
				// otherwise we will (unintentionally) force the user to navigate away from the page via a hyperlink, etc, etc.
				event.preventDefault();

				$('.cssmenu-item-list').css('display', '');
				// somewhat unorthodox - get ALL the parent elements of the clicked-on menu item that are submenus
				// $.parents() gets all parents of the element, unlike $.parent()
				menu.parents('.cssmenu-item-list').css('display', 'inline-block');
				submenu.css('display', 'inline-block');
			}
		}
		else {
			$('.cssmenu-item-list').css('display', '');
		}
	});
});
	</pre>

	That's it!  Without comments, the finished code is then ~15 lines total and copy/pastable to any page (or <a target="_blank" href="http://en.wikipedia.org/wiki/Model-view-controller">MVC</a> header/footer):
	<pre class="prettyprint lang-js">
$(document).ready(function() {
	$(document).delegate('*', 'click touchstart', function(event) {
		var menu = $(this).closest('.cssmenu-item');
		var submenu = menu.find('>.cssmenu-item-list');
		if(submenu.length > 0) {
			event.stopPropagation();
			if(submenu.css('display') == 'none') {
				event.preventDefault();
				$('.cssmenu-item-list').css('display', '');
				menu.parents('.cssmenu-item-list').css('display', 'inline-block');
				submenu.css('display', 'inline-block');
			}
		}
		else {
			$('.cssmenu-item-list').css('display', '');
		}
	});
});
	</pre>

	<br />
	If you wish to test the click event on a desktop, just comment out the <i>.cssmenu-item:hover > .cssmenu-item-list {}</i> CSS rule.

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



	.cssmenu {
		height: 5em;
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
	<script type="text/javascript">
		$(document).ready(function() {
			$(document).delegate('*', 'click touchstart', function(event) {
				var menu = $(this).closest('.cssmenu-item');
				var submenu = menu.find('>.cssmenu-item-list');
				if(submenu.length > 0) {
					event.stopPropagation();
					if(submenu.css('display') == 'none') {
						event.preventDefault();
						$('.cssmenu-item-list').css('display', '');
						menu.parents('.cssmenu-item-list').css('display', 'inline-block');
						submenu.css('display', 'inline-block');
					}
				}
				else {
					$('.cssmenu-item-list').css('display', '');
				}
			});
		});
	</script>
</ul>