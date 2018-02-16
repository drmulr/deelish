const mongoose = require('mongoose');
const Store = mongoose.model('Store'); 


exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store'});
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
}; 

exports.getStores = async (req, res) => {
  //need query DB for stores
  const stores = await Store.find();
  console.log(stores);

  res.render('stores', {title: 'Stores', stores});
}


exports.editStore = async (req, res) => {
  //find store id
  // res.json(req.params); to test
  const store = await Store.findOne({ _id: req.params.id });
  // res.json(store); to test

  //confirm owner 


  //render edit form to update
  res.render('editStore', { title: `Edit ${store.name}`, store});
}

exports.updateStore = async (req, res) => {
  //find and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, 
    { new: true,
      runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -></a>`);
    res.redirect(`/stores/${store._id}/edit`);



  //redirect them the store and tell them worked
}
