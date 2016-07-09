<?

// Order link for Head of table
if(!function_exists('orderLink')) {
    function orderLink($name, $column) {
        $active_class = '';
        $pagination_param = '';
        if(Request::get('page')) {
            $pagination_param = '&page='.Request::get('page');
        }
        if(Request::get('orderBy') === $column) $active_class = "active-".Request::get('direction');
        $direction = (Request::get('direction') == 'asc') ? 'desc' : 'asc';

        return '<a href="?orderBy='.$column.'&direction='.$direction. $pagination_param.'" class="sort-link '.$active_class.'">'.$name.'</a>';
    }
}