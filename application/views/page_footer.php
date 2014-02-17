</div>
<div id="footer"><div class="footer-content">Copyright &copy; 2014 Veeb</div></div>
</body>
</html>

<script type="text/javascript">
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
			}
			else {
				$('.cssmenu-item-list').css('display', '');
			}
		});
	});
</script>