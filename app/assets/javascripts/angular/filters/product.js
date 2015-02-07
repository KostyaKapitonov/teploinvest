
ANTALEX.filter("onlySelected", function() {
    return function(input, firm, category) {
        if(!firm && !category) return input;
        var res =[];
        input.each(function(p){
            if(!category && p.firm_id == firm) res.push(p);
            if(!firm && p.category_id == category) res.push(p);
            else if (p.firm_id == firm && p.category_id == category) res.push(p);
        });
        return res;
    };
});