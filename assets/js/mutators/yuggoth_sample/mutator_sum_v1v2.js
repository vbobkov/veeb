mutator_sum_v1v2 =
{
    name: 'sum_v1v2',
    leftHandSide: ['value1', 'value2'],
    rightHandSide: 'sum1',
    mutate: function(cells) {
        return Number($.parseFloatOr(cells.value1.text(), 0) + $.parseFloatOr(cells.value2.text(), 0));
    },
    saveToDB: false
};