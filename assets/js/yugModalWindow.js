/**
 * @summary     Modal Window of Yuggoth
 * @description A modal window plugin.
 * Its primary purpose is to prevent the rest of the page from scrolling when the mouse pointer is inside the modal window.
 *
 * @version     1.0.0
 * @file        yugModalWindow.js
 * @author      Vic Bobkov
 * @contact     vik.bobkov@gmail.com
 *
 * @copyright Copyright 2013 Vic Bobkov, all rights reserved.
 *
 */

 $.fn.yugModalWindow = function(data) {
	var self = this;
	self.window_id = data.windowID;
	self.window_selector = '#' + self.window_id;
	self.container_selector = '#' + $(this).prop('id');

	if($('#' + self.window_id).length < 1) {
		$(self.container_selector).append('<div class="' + data.windowClass + '" id="' + self.window_id + '">' + data.content + '</div>');

		if(typeof data.closeButton !== 'undefined') {
			$(self.window_selector + ' ' + data.closeButton).click(function() {
				$(self.window_selector).css('display', 'none');
				$('body').css('position', '');
			});
			$(document).keydown(function(event) {
				if(event.which == 27) { // user pressed escape
					$(self.window_selector + ' ' + data.closeButton).click();
				}
			});
		}

		$(self.window_selector).mouseover(function (event) {
			$('body').css('position', 'fixed');
		});
		$(self.window_selector).mouseout(function (event) {
			$('body').css('position', '');
		});

		if(data.draggable) {
			$(self.window_selector).draggable({ containment: 'window' });
		}

		if(data.resizable) {
			$(self.window_selector).resizable({ handles: 'n,e,s,w,se' });
		}
	}
	else {
		$(self.window_selector).css('display', '');
	}

	return self.window_selector;
};