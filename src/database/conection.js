const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
try {
	mongoose.connect('mongodb://127.0.0.1:27017/msp-sign', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log('base de datos conectada');
} catch (error) {
	console.log(error);
}
