import Filter from './Filter';
import Geo from './Geo';
import Query from './Query';
import Range from './Range';
import Search from './Search';
import SearchFilter from './SearchFilter';

if (typeof window !== undefined) {
	window.Filter = Filter;
	window.Geo = Geo;
	window.Query = Query;
	window.Range = Range;
	window.Search = Search;
	window.SearchFilter = SearchFilter;
}
