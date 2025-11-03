export function addTimeToCurrentDate(date: Date, timeString: string): Date {
	const result = new Date(date);
  
	const regex = /(\d+)([smhd])/g;
	let match;
  
	while ((match = regex.exec(timeString)) !== null) {
		const value = parseInt(match[1], 10);
		const unit = match[2];
    
		switch (unit) {
		case 's':
			result.setSeconds(result.getSeconds() + value);
			break;
		case 'm':
			result.setMinutes(result.getMinutes() + value);
			break;
		case 'h':
			result.setHours(result.getHours() + value);
			break;
		case 'd':
			result.setDate(result.getDate() + value);
			break;
		}
	}
  
	return result;
}
