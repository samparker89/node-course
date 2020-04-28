require('../src/db/mongoose');
const User = require('../src/models/user.js');

const updateAgeAndCount = async (id, age) => {
  await User.findByIdAndUpdate(id, { age });
  const docsCount = await User.countDocuments({ age });

  return docsCount;
};

updateAgeAndCount('5ea6df2024e1913d360bb568', 1).then((count) => {
  console.log(count);
}).catch((e) => {
  console.log(e);
});
