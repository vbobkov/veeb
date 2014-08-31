command_checkall =
{
    appendLocation: '.YugCommand',
    classes: 'YugCommand_Button',
    method: function(yTable) {
        $(yTable.table_selector + ' tbody tr input[type="checkbox"]').prop('checked', true);
    },
    name: 'checkall',
    title: 'Check All'
};