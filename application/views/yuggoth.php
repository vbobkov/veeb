<ul>
To properly use this plugin, extensive knowledge of <a target="_blank" href="http://datatables.net/">dataTables</a> is highly recommended.
<br />
Essentially, Yuggoth extends the functionality of <a target="_blank" href="http://datatables.net/">dataTables</a> to include:
<li>Highly customizable click-and-go table cell editing. Clicking editable cells turns them into input/textarea boxes, navigating away from them automatically saves them.</li>
<li>Every little change is saveable, and by default shows up highlighted in red. Specifying a save URL allows every single table edit to be saved to a back-end database via server-side Ajax calls.</li>
<li>Customizable <a target="_blank" href="http://redis.io/">Redis</a> support! The redis settings can be customized to post to a URL of your choice every edit/add/delete.</li>
<li>Customizable column formats/css classes.</li>
<li>Fully customizable custom commands (redundant redudancy, heh).  Anything from setting certain columns to specific values, to, well. Anything. Includes specifying their CSS classes, their ID names, their location in the HTML DOM tree, etc.</li>
<li>Mutators. No, it's not just a cool-sounding name. Ever wanted certain database rows and/or table cells to update their value if, say, some other column got updated? Well, that's exactly what mutators do. Fully chainable (column 1 modifies column2, which changes column4, which is a sum of column2 and column3, etc, etc.). Just be careful with infinite loops!</li>
<li>Image previewer. Hovering over an image preview cell will trigger a chat bubble preview of the image. Can be combined with editable cells.</li>
<li>Optionally resizable/draggable table contents (requires <a target="_blank" href="https://jqueryui.com/">JQuery UI</a>).</li>

<br /><br />
The original purpose I created Yuggoth for was scalable rendering and editing of large data sets, with the ability to fully customize how and when a website can mold said data sets.
With the right parameters, Yuggoth is capable of loading ridiculously large data sets without relying on server-side processing (paginating/returning only a few rows from the database at a time).
<br /><br />
Yes, Yuggoth can load the entire huge table of whatever it is.
The highest I've tried so far has been roughly 500MB of JSON data, gzipped, sent over the wire, unzipped and parsed into Yuggoth, equating to 300,000+ table rows with 50+ columns of data.
Yuggoth is only limited by browser/system memory, but at (obscenely) large data sets, there is an noticeable browser freeze as it loads the data into memory. Also, download speed can start to become an issue, if the client doesn't already have the data on their hard drive.  Luckily, the built-in progress bar at least informs the user of what's going on.
<br /><br />
I'd imagine loading over 1GB of JSON data would make any browser unresponsive for a rather long time, but if the user has the RAM for it, Yuggoth will eventually load it, after which it's smooth sailing.
<br /><br />
The latest source code for Yuggoth can be found <a target="_blank" href="/assets/js/yugTable.js">here.</a>
<br />
Yuggoth is open source under the <a target="_blank" href="http://www.gnu.org/licenses/gpl.html">GPL v3 license</a>.
<br /><br />
<a target="_blank" href="/shenanigans/yuggoth_sample">Sample of Yuggoth in action.</a> (Barebone, no server-side stuff. 2 tables, 50,000 and 25,000 entries, no database saving or redis.)
</ul>
