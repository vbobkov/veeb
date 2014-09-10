command_uncheckall =
{
    appendLocation: '.YugCommand',
    classes: 'YugCommand_Button',
    method: function(yTable) {
        $(yTable.table_selector + ' tbody tr input[type="checkbox"]').prop('checked', false);
    },
    name: 'uncheckall',
    title: 'Uncheck All'
};