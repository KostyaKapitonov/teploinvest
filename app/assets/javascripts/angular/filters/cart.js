
ANTALEX.filter("onlyConfirmed", function() {
    return function(input) {
        var res =[];
        input.each(function(p){
            if(p.confirmed) res.push(p);
        });
        return res;
    };
});