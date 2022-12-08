
export function descendingComparator(a, b, orderBy) {
	const innerBody = orderBy.split('.');
	const hasInner = innerBody.length > 1;
	if (hasInner) {
		if (b[innerBody[0]][innerBody[1]] < a[innerBody[0]][innerBody[1]]) {
			return -1;
		}
		if (b[innerBody[0]][innerBody[1]] > a[innerBody[0]][innerBody[1]]) {
			return 1;
		}
	}
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

export function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

export function stabilize(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}