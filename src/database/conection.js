const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
try {
	mongoose.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log('base de datos conectada');
} catch (error) {
	console.log(error);
}
