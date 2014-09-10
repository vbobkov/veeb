/**
 * @summary     Command Prompt of Yuggoth
 * @description A text-based command prompt, simulating unix/linux terminals and MS-DOS.
 *
 * @version     1.0.0
 * @file        yugCommandPrompt.js
 * @author      Vic Bobkov
 * @contact     vik.bobkov@gmail.com
 *
 * @copyright Copyright 2013 Vic Bobkov, all rights reserved.
 *
 * This source file is free software, under the GPL v3 license:
 *   http://www.gnu.org/licenses/gpl.html
 *   http://www.gnu.org/licenses/gpl.txt
 */

$.fn.yugCommandPrompt = function(data) {
	var self = this;
	self.container_selector = '#' + $(this).prop('id');
	if($(self.container_selector).length < 1) {
		return;
	}
	else if(typeof $(self.container_selector)[0].yugCommandPrompt !== 'undefined') {
		return $(self.container_selector)[0].yugCommandPrompt;
	}
	else if(typeof data === 'undefined') {
		return;
	}



	self.settings = data;
	self.history = [];
	self.history_current_selection_index = -1;



	if(typeof self.settings.processCommand === 'function') {
		self.command = self.settings.processCommand;
	}
	else {
		self.command = function(command, yCP) {};
	}

	if(typeof self.settings.callbacks !== 'object') {
		self.settings.callbacks = {};
	}

	$(document).delegate(self.container_selector, 'focusout keyup', function(event) {
		if((event.type == 'keyup' && event.which == 13) || event.type == 'focusout') {
			var command = $(this).prop('value');

			if(typeof self.settings.callbacks.beforeCommand === 'function') {
				self.settings.callbacks.beforeCommand();
			}

			if(self.command(command, self)) {
				if(self.history.length < self.settings.historySize) {
					self.history.push(command);
				}
				else {
					self.history.push(command);
					self.history.shift();
				}
				self.history_current_selection_index = -1;
			}

			if(typeof self.settings.callbacks.afterCommand === 'function') {
				self.settings.callbacks.afterCommand();
			}

			$(this).prop('value', '');
		}
		else if(event.type == 'keyup' && [38,40].indexOf(event.which) != -1) {
			if(event.which == 38) { // up key
				if(self.history_current_selection_index == -1) {
					self.history_current_selection_index = self.history.length - 1;
				}
				else if(self.history_current_selection_index == 0) {
					self.history_current_selection_index = self.history.length - 1;
				}
				else {
					self.history_current_selection_index--;
				}
			}
			else if(event.which == 40) { // down key
				if(self.history_current_selection_index == -1) {
					self.history_current_selection_index = self.history.length - 1;
				}
				else if(self.history_current_selection_index >= self.history.length - 1) {
					self.history_current_selection_index = 0;
				}
				else {
					self.history_current_selection_index++;
				}
			}
			$(self.settings.input).prop('value', self.history[self.history_current_selection_index]);
		}
	});
};