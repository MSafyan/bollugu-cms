export function getAge(birthDate) {
	var now = new Date();

	function isLeap(year) {
		return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
	}

	// days since the birthdate    
	var days = Math.floor((now.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24);
	var age = 0;
	// iterate the years
	for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++) {
		var daysInYear = isLeap(y) ? 366 : 365;
		if (days >= daysInYear) {
			days -= daysInYear;
			age++;
			// increment the age only if there are available enough days for the year.
		}
	}
	return age;
}

export function getDateTime(date) {
	const d = new Date(date);
	return `${d.toDateString()} ${d.toLocaleTimeString()}`;
}

export function joinDateTime(_date, _time) {
	const date = new Date(_date);
	const Time = new Date(_time);
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Time.getHours(), Time.getMinutes());
}