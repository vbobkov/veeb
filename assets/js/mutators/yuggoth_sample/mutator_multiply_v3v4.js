mutator_multiply_v3v4 =
{
    name: 'multiply_v3v4',
    leftHandSide: ['value3', 'value4'],
    rightHandSide: 'multiply1',
    mutate: function(cells) {
        return $.parseFloatOr(cells.value3.text(), 0) * $.parseFloatOr(cells.value4.text(), 0);
    },
    saveToDB: false
};