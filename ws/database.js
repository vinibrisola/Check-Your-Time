const mongoose = require('mongoose');
const URI = 'mongodb+srv://vizuUser:K1WMEDLydiLxHo1v@clusterdev.r6v5h.mongodb.net/vizu?retryWrites=true&w=majority';


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(URI)
  .then(() => console.log('DB is Up!'))
  .catch((err) => console.log(err));
