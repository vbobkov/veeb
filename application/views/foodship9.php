<ul>

Technically, this doesn't count as this page having images, because the game is a standalone project that I just happen to showcase.
<br />
I think.
<br />
Aaanyway.
<br /><br />
Unfortunately, I don't yet have time to explain everything I did to make this possible with just CSS and JQuery.
For now, all you get is a taste of what's already possible with only the built-in basics of a modern browser's tools.
<br /><br />
Below is a very, very, VERY rough draft of the beginnings of a 2d game engine.  One day, I will come back and work on it some more.
As you can see, no pre-compiled code or proprietary languages are required.
I predict most flash/Java applet games will eventually be replaced with games powered with only Javascript and CSS.
HTML5 too, but that's not part of this example. Yet. :)
<br /><br />
Controls
<li><b>move (arrow keys or WASD):</b><br />Fly around in The Giant Edible Ship Of Incredible Destructive Power</li>
<li><b>shoot (space bar):</b><br />shoot laser-looking things</li>
<li><b>special (SHIFT key):</b><br />a flashy, limited-distance teleport to where the mouse cursor is (seriously, try it a few times!) - teleporting in place triggers a large, shiny energy nova</li>

<div id="sw-game"></div>
<script src="/assets/sw_demo/sw/quad.js" type="text/javascript"></script>
<script src="/assets/sw_demo/sw/sw.js" type="text/javascript"></script>
<script>
$(document).ready(function() {
	var sw1 = new SW("#sw-game");
});
</script>

</ul>