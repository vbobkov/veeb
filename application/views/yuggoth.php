<ul>
To properly use this plugin, extensive knowledge of <a target="_blank" href="http://datatables.net/">dataTables</a> is highly recommended.
<br />
Essentially, Yuggoth extends the functionality of <a target="_blank" href="http://datatables.net/">dataTables</a> to include:
<li>Highly customizable click-and-go table cell editing. Clicking editable cells turns them into input/textarea boxes, navigating away from them automatically saves them to the database.</li>
<li>Customizable column formats/css classes.</li>
<li>Fully customizable custom commands (redundant redudancy, heh).  Anything from setting certain columns to specific values, to, well. Anything. Includes specifying their CSS classes, their ID names, their location in the HTML DOM tree, etc.</li>
<li>Mutators. No, it's not just a cool-sounding name for something that already exists. Ever wanted certain database rows and/or table cells to update their value if, say, some other column got updated? Well, that's exactly what mutators do. Fully chainable (column 1 modifies column2, which changes column4, which is a sum of column2 and column3, etc, etc.). Just be careful with infinite loops!</li>
<li>Every little change is saveable, and by default shows up highlighted in red. Specifying a save URL allows every single table edit to be saved to a back-end database via server-side Ajax calls.</li>
<li>Image previewer. Hovering over an image preview cell will trigger a chat bubble preview of the image. Can be combined with editable cells.</li>
<li>Optionally resizable/draggable table contents (requires <a target="_blank" href="https://jqueryui.com/">JQuery UI</a>).</li>
<li>FUTURE: Automatically detect table columns from the JSON/URL data source.</li>
<li>FUTURE: Allow loading from Javascript objects. For now, Yuggoth's only option is to load from URLs.</li>

<br /><br />
The original purpose I created Yuggoth for was scalable rendering and editing of large data sets, with the ability to fully customize how and when a website can mold said data sets.
With the right parameters, Yuggoth is capable of loading ridiculously large data sets without relying on server-side processing (paginating/returning only a few rows from the database at a time).
<br /><br />
Yes, Yuggoth can load the entire huge table of whatever it is.  The highest I've tried so far has been roughly 500MB of JSON data, gzipped, sent over the wire, unzipped and parsed into Yuggoth.
Yuggoth is only limited by browser/system memory. Although, I'd imagine loading over 1GB of JSON data would make any browser unresponsive for a rather long time. :)
<br /><br />
The source code for Yuggoth can be found <a target="_blank" href="/assets/js/yugTable.js">here.</a>
<br />
Yuggoth is open source under the <a target="_blank" href="http://www.gnu.org/licenses/gpl.html">GPL v3 license</a>.
<br /><br />
Unfortunately, I don't have any showable examples for this plugin; so far, all of its uses have been tied to proprietary applications. It's definitely on my to-do list to create public examples. Yuggoth will require several in-depth examples to go through everything.
</ul>