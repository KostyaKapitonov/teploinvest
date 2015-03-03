
MYAPP.filter("onlySelected", function() {
    return function(input, firm, category, sub_cat) {
        if(!firm && !category) return input;
        var res =[];
        input.each(function(p){
            if (firm && category && sub_cat) {
                if (p.firm_id == firm && p.category_id == category && p.sub_cat_id == sub_cat) res.push(p);
            } else  if (category && sub_cat){
                if (p.category_id == category && p.sub_cat_id == sub_cat) res.push(p);
            } else  if (category && firm){
                if (p.category_id == category && p.firm_id == firm) res.push(p);
            } else if (sub_cat && firm) {
                if (p.sub_cat_id == sub_cat && p.firm_id == firm) res.push(p);
            } else if (category){
                if (p.category_id == category) res.push(p);
            } else if (sub_cat){
                if (p.sub_cat_id == sub_cat) res.push(p);
            } else if (firm){
                if (p.firm_id == firm) res.push(p);
            } else if (!firm && !category && !sub_cat) res.push(p);
        });
        return res;
    };
});