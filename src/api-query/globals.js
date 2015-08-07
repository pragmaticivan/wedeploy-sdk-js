import Query from './Query';
import Filter from './Filter';

if (typeof window !== undefined) {
	window.Query = Query;
	window.Filter = Filter;
}
