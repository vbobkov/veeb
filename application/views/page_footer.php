</div>
<div id="footer"><div class="footer-content">Copyright &copy; 2014 VeeB</div></div>
</body>
</html>

<script type="text/javascript">
	function selectText(text) {
		var doc = document;
		// var text = doc.getElementById(element);
		var range;
		var selection;
		if (doc.body.createTextRange) { //ms
			range = doc.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		} else if (window.getSelection) { //all others
			selection = window.getSelection();        
			range = doc.createRange();
			range.selectNodeContents(text);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}



	$(document).ready(function() {
		prettyPrint();

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
				else {
				}
			}
			else {
				$('.cssmenu-item-list').css('display', '');
			}
		});

		$(document).delegate('pre', 'click', function(event) {
			if($(this).hasClass('selected-code')) {
				$(this).removeClass('selected-code');
			}
			else {
				$('pre').removeClass('selected-code');
				$(this).addClass('selected-code');
				selectText(this);
			}
		});

		$('#container pre').each(function(event) {
			$(this).attr('title', 'click to select/unselect all');
		});
		$('.title1').each(function(event) {
			$(this).prepend('<div class="title1-upper-border"></div>');
		});
	});
</script>