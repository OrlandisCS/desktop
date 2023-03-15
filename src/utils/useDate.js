const { format } = require('date-fns');

const getDate = () => {
	return format(new Date(), 'dd-MM-yyyy');
};
const getTime = () => {
	return format(new Date(), 'HH:mm:ss');
};

module.exports = {
	getDate,
	getTime,
};
